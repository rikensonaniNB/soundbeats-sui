import { ILeaderboard } from './ILeaderboard';
import * as AWS from "aws-sdk";

const DEFAULT_SPRINT_KEY = "default";
const SCORES_TABLE_NAME = "leaderboard-scores-test"; 
const SPRINTS_TABLE_NAME = "leaderboard-sprints-test"; 

//TODO: end sprint automatically if end date is != null and is in past 
//TODO: enforce only one active sprint at a time 
//TODO: add logging 
//TODO: add scores to cache when adding
//TODO: protect cache from one-off queries

interface IScore {
    wallet: string; 
    score: number;
}

class LocalScoreCache {
    expirationSeconds: number; 
    lastRefresh: number; 
    count: number; 
    data: { [wallet: string]: IScore };

    constructor(expirationSeconds: number = 600) {
        this.expirationSeconds = expirationSeconds;
        this.count = 0;
        this.lastRefresh = 0;
        this.data = {};
    }
    
    getAsArray(limit: number = 0): IScore[] {
        return Object.values(this.data);
    }
    
    ageSeconds(): number {
        return Math.floor(Date.now()/1000) - this.lastRefresh;
    }
    
    isExpired(): boolean {
        return this.ageSeconds() > this.expirationSeconds;
    }
    
    update(score: IScore) {
        this.data[score.wallet] = score;
    }
    
    refresh(scores: IScore[]) {
        this.lastRefresh = Math.floor(Date.now()/1000);
        for(let n=0; n<scores.length; n++) {
            this.update(scores[n]);
        }
    }
}

const localScoreCache_default = new LocalScoreCache(); 

const localScoreCache_sprint = new LocalScoreCache(); 
    

interface IDynamoResult {
    success: boolean;
    data: any; 
    error: any; 
}

export class LeaderboardDynamoDb implements ILeaderboard {
    network: string;
    dynamoDb: any;

    constructor(network: string) {
        this.network = network;
        
        const n = process.env.AWS_ACCESS_KEY;
        
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_ACCESS_SECRET,
            region: process.env.AWS_REGION
        });
        this.dynamoDb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
    }

    async getLeaderboardScore(wallet: string, sprintId: string = ""): Promise<{ wallet: string, score: number, network: string }> {
        if (sprintId.length == 0) 
            sprintId = DEFAULT_SPRINT_KEY;
        
        const output = {
            wallet: wallet, 
            score: 0, 
            network: this.network
        };
        
        const result = await this._dataAccess_getScore(wallet, sprintId);
        
        if (result.success) {
            output.score = parseInt(result.data.score.N);
        }
        
        return output;
    }

    //TODO: why have wallet param here?
    async getLeaderboardScores(wallet: string, limit: number = 100, sprintId: string = ""): Promise<{ scores: IScore[], network: string }> {
        if (sprintId.length == 0)
            sprintId = DEFAULT_SPRINT_KEY;

        let output = { scores: [], network: this.network };
        
        //if default, get from local cache 
        if (sprintId == DEFAULT_SPRINT_KEY) {
            output.scores = await this._getScoresFromCache(localScoreCache_default, DEFAULT_SPRINT_KEY, limit); 
        }
        else {
            //check: is it current sprint? 
            if (await this._isCurrentSprint(sprintId)) {
                output.scores = await this._getScoresFromCache(localScoreCache_sprint, DEFAULT_SPRINT_KEY, limit); 
            }
            
            //default: scan table for scores 
            output.scores = await this._scanForScores(sprintId, limit);
        }

        return output;
    }

    async addLeaderboardScore(wallet: string, score: number, sprintId: string = ""): Promise<{ score: number, network: string }> {
        if (sprintId.length == 0)
            sprintId = DEFAULT_SPRINT_KEY;
            
        const output = { score: score, network: this.network };
        
        //get current score first 
        const result = await this._dataAccess_getScore(wallet, sprintId); 
        if (result.success && result.data) {
            output.score = parseInt(result.data.score.N) + score;
        }
        
        //write accumulated score 
        await this._dataAccess_putScore(wallet, output.score, sprintId); 
        
        return output; 
    }

    //admin methods 
    async createSprint(sprintId: string, startDate: number = 0): Promise<boolean> {
        if (startDate == 0) 
            startDate = Math.floor(Date.now()/1000); 
            
        //validation: check that sprint name is not taken 
        const exists = await this._sprintExists(sprintId); 
        if (exists) {
            //TODO: log warning
            return false;
        }
        
        //validation: check that date is ok 
        
        //create sprint record 
        await this._dataAccess_putSprint(sprintId, startDate); 
        
        //check that sprint is created 
        return await this._sprintExists(sprintId); 
    }

    async endSprint(sprintId: string): Promise<boolean> {
        //validation: check that sprint exists 
        const dataResult = await this._dataAccess_getSprint(sprintId);
        if (!dataResult.success || !dataResult.data) {
            //TODO: log warning
            return false;
        }
        
        const sprint = dataResult.data;
        
        //validation: check that sprint not already ended 
        if (!sprint.active) {
            //TODO: log warning
            return false;
        }
        
        //write record: set active=false and endDate = now
        sprint.endDate = Math.floor(Date.now()/1000); 
        sprint.active = false;
        await this._dataAccess_putSprint(sprintId, sprint);
        
        return !(await this._isCurrentSprint(sprintId));
    }
    
    
    //private methods 
    async _sprintExists(sprintId: string): Promise<boolean> {
        const result = await this._dataAccess_getSprint(sprintId);
        return result.success && result.data;
    }
    
    async _isCurrentSprint(sprintId: string): Promise<boolean> {
        const result = await this._dataAccess_getSprint(sprintId); 
        return result.success && result.data && result.data.active.BOOL;
    }
    
    async _getScoresFromCache(cache: LocalScoreCache, sprintId: string, limit: number = 100): Promise<IScore[]> {
        if (!cache.isExpired()) {
            return cache.getAsArray(limit);
        }
        
        //TODO: if refreshing the cache, do it in separate thread 
        const data = await this._scanForScores(sprintId, limit); //TODO: need to apply filter 
        cache.refresh(data);
        
        return cache.getAsArray(limit);
    }
    
    async _scanForScores(sprintId: string, limit: number = 100): Promise<IScore[]> {
        const params = {
            TableName: SCORES_TABLE_NAME
        };

        const results: any = await new Promise((resolve, reject) => 
        {
            this.dynamoDb.scan(params, (error, data) => {
                if (error) {
                    console.error("Unable to scan the table. Error JSON:", JSON.stringify(error, null, 2));
                } else {
                    const sortedItems = data.Items.sort((a, b) => parseInt(b.score.N) - parseInt(a.score.N)).slice(0, 10);
                    resolve(sortedItems);
                }
            });
        }); 
        
        let output = results.map((i) => { return { wallet: i.wallet.S, score: parseInt(i.score.N) } });
        
        if (output.length > limit) {
            output = output.slice(0, limit);
        }
        
        return output;
    }
    
    
    //data access methods 
    //TODO: log warning or error if any data access call is not successful 
    
    async _dataAccess_scanScores(): Promise<IDynamoResult> {
        return await this._dataAccess_scanTable(SPRINTS_TABLE_NAME);
    }

    async _dataAccess_scanSprints(): Promise<IDynamoResult> {
        return await this._dataAccess_scanTable(SPRINTS_TABLE_NAME);
    }

    async _dataAccess_getScore(wallet: string, sprintId: string): Promise<IDynamoResult> {
        return await this._dataAccess_getItem({
            TableName: SCORES_TABLE_NAME,
            Key: {
                'wallet': { S: wallet },
                'sprintId': { S: sprintId }
            }
        });
    }

    async _dataAccess_putScore(wallet: string, score: number, sprintId: string): Promise<IDynamoResult> {
        return await this._dataAccess_putItem({
            TableName: SCORES_TABLE_NAME,
            Item: {
                wallet: {'S': wallet },
                sprintId: { 'S': sprintId },
                score: { 'N': score.toString() }
            }
        }); 
    }

    async _dataAccess_getSprint(sprintId: string): Promise<IDynamoResult> {
        return await this._dataAccess_getItem({
            TableName: SPRINTS_TABLE_NAME,
            Key: {
                'sprintId': { S: sprintId }
            }
        });
    }

    async _dataAccess_putSprint(sprintId: string, startDate: number): Promise<IDynamoResult> {
        return await this._dataAccess_putItem({
            TableName: SPRINTS_TABLE_NAME,
            Key: {
                'sprintId': { 'S': sprintId },
                'startDate': { 'N': startDate.toString() },
                'endDate': { 'N': startDate + 365 * 3.154e+7 },  //one year 
                'active': { 'BOOL': false }
            }
        });
    }

    async _dataAccess_getItem(params: any): Promise<IDynamoResult> {
        const result: IDynamoResult = await new Promise((resolve, reject) => {
            this.dynamoDb.getItem(params, (err, data) => {
                if (err) {
                    resolve({
                        success: false,
                        error: err,
                        data: null
                    });
                } else {
                    resolve({
                        success: true,
                        error: null,
                        data: data.Item
                    });
                }
            });
        });

        return result;
    }

    async _dataAccess_putItem(params: any): Promise<IDynamoResult> {
        const result: IDynamoResult = await new Promise((resolve, reject) => {
            this.dynamoDb.putItem(params, (err, data) => {
                if (err) {
                    resolve({
                        success: false,
                        error: err,
                        data: params
                    });
                } else {
                    resolve({
                        success: true,
                        error: null,
                        data: params
                    });
                }
            });
        });
        return result;
    }

    async _dataAccess_scanTable(tableName: string): Promise<IDynamoResult> {
        return {
            error: null, 
            success: true, 
            data: []
        }
    }
}
