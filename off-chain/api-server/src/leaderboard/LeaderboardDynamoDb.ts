import { ILeaderboard } from './ILeaderboard';
import AWS from 'aws-sdk';
import { string } from 'superstruct';

const DEFAULT_SPRINT_KEY = "default";
const SCORES_TABLE_NAME = "scores"; 
const SPRINTS_TABLE_NAME = "sprints"; 

interface IScore {
    wallet: string; 
    score: number;
}

class LocalScoreCache {
    expirationSeconds: number; 
    lastRefresh: number; 
    count: number; 
    data: {};

    constructor(expirationSeconds: number = 600) {
        this.expirationSeconds = expirationSeconds;
        this.count = 0;
        this.lastRefresh = 0;
    }
    
    getAsArray(limit: number = 0): IScore[] {
        return [];
    }
    
    ageSeconds(): number {
        return Math.floor(Date.now()/100) - this.lastRefresh;
    }
    
    isExpired(): boolean {
        return this.ageSeconds() > this.expirationSeconds;
    }
    
    update(score: IScore) {
        this.data[score.wallet] = score.score;
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
        AWS.config.update({ region: process.env.AWS_REGION });
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
            output.score = result.data.score;
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
            
        const output = { score: 0, network: this.network };
        
        //get current score first 
        const result = await this._dataAccess_getScore(wallet, sprintId); 
        if (result.success) {
            output.score = result.data.score;
        }
        
        //write accumulated score 
        this._dataAccess_putScore(wallet, output.score, sprintId); 
        
        return output; 
    }

    //admin methods 
    async startSprint(sprintId: string): Promise<boolean> {
        //validation: check that sprint name is not taken 
        //validation: check that date is ok 
        
        //create sprint record 
        //check that sprint is created 
        //return true/false
        return true;
    }

    async endSprint(sprintId: string): Promise<boolean> {
        //validation: check that sprint exists 
        //validation: check that sprint not already ended 
        //write record: set active=false and endDate = now
        return true;
    }
    
    
    //private methods 
    async _isCurrentSprint(sprintId: string): Promise<boolean> {
        const result = await this._dataAccess_getSprint(sprintId); 
        return result.success && result.data && result.data.active;
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
        const result = await this._dataAccess_scanScores(); //TODO: need to apply filter 
        if (result.success) {
            return result.data;
        }
        return [];
    }
    
    
    //data access methods 
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
                'sprint': { S: sprintId }
            }
        });
    }

    async _dataAccess_putScore(wallet: string, score: number, sprintId: string): Promise<IDynamoResult> {
        return await this._dataAccess_putItem({
            TableName: SCORES_TABLE_NAME,
            Item: {
                wallet,
                sprintId,
                score
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
                'sprintId': { S: sprintId },
                'startDate': { N: startDate }
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
            this.dynamoDb.put(params, (err, data) => {
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
