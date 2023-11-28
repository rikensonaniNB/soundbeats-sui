import { ILeaderboard } from './ILeaderboard';
import * as AWS from "aws-sdk";
import { start } from 'repl';

const DEFAULT_SPRINT_KEY = "default";
const SCORES_TABLE_NAME = process.env.DBTABLE_NAME_SCORES; 
const SPRINTS_TABLE_NAME = process.env.DBTABLE_NAME_SPRINTS;
const GSI_SPRINT_NAME = "GSI_SPRINT";
const GSI_SCORE_NAME = "GSI_SCORE"; 
const GSI_ACTIVE_NAME = "GSI_ACTIVE";

//TODO: add logging 
//TODO: exception handling 
//TODO: clear score cache after changing sprint 
//TODO: log warning or error if any data access call is not successful 

function unixDate() {
    return Math.floor(Date.now()/1000);
}

interface IScore {
    wallet: string; 
    score: number;
}

interface ISprint {
    sprintId: string; 
    active: boolean; 
    startDate: number; 
    endDate: number; 
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
    
    getAsArray(limit: number = 0, sort: boolean = false): IScore[] {
        const output = Object.values(this.data).slice(0, limit);
        if (sort)
            output.sort((a, b) => b.score - a.score);
        return output;
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
        this.lastRefresh = unixDate();
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
        if (!sprintId || !sprintId.length) 
            sprintId = DEFAULT_SPRINT_KEY;
        
        const output = {
            wallet: wallet, 
            score: 0, 
            network: this.network
        };
        
        const result = await this._dataAccess_getScore(wallet, sprintId);
        
        if (result.success && result.data) {
            output.score = parseInt(result.data.score.N);
        }
        
        return output;
    }

    async getLeaderboardScores(limit: number = 100, sprintId: string = ""): Promise<{ scores: IScore[], network: string, fromCache: boolean }> {
        if (!sprintId || !sprintId.length) 
            sprintId = DEFAULT_SPRINT_KEY;

        let output = { scores: [], network: this.network, fromCache: false };
        
        //if default, get from local cache 
        if (sprintId == DEFAULT_SPRINT_KEY) {
            const cache = await this._getScoresFromCache(localScoreCache_default, DEFAULT_SPRINT_KEY, limit); 
            output.scores = cache.scores;
            output.fromCache = cache.fromCache;
        }
        else {
            output.fromCache = false; 
            
            //check: is it current sprint? 
            if (await this._isCurrentSprint(sprintId)) {
                const cache = await this._getScoresFromCache(localScoreCache_sprint, sprintId, limit); 
                output.scores = cache.scores;
                output.fromCache = cache.fromCache;
            }
            else {
                //default: scan table for scores 
                output.scores = await this._scanForScores(sprintId);
                
                //sort and limit
                output.scores.sort((a, b) => parseInt(b.score.N) - parseInt(a.score.N)).slice(0, limit);
            }
        }

        return output;
    }

    async addLeaderboardScore(wallet: string, score: number, sprintId: string = ""): Promise<{ score: number, network: string }> {
        if (!sprintId || !sprintId.length) 
            sprintId = DEFAULT_SPRINT_KEY;
            
        const output = { score: score, network: this.network };
        
        //get current score first 
        const result = await this._dataAccess_getScore(wallet, sprintId); 
        if (result.success && result.data) {
            output.score = parseInt(result.data.score.N) + score;
        }
        
        //write accumulated score 
        await this._dataAccess_putScore(wallet, output.score, sprintId); 
        
        //add to default too, if adding to sprint 
        if (sprintId != DEFAULT_SPRINT_KEY) {
            await this.addLeaderboardScore(wallet, score); 
        }
        
        //update the cache 
        await this._updateCacheItem(wallet, score, sprintId);
        
        return output; 
    }

    //admin methods 
    async createSprint(sprintId: string, startDate: number = 0): Promise<boolean> {
        if (startDate == 0) 
            startDate = unixDate();

        //validation: check that date is ok 
        if (startDate < unixDate() - 1000) {
            throw new Error("Start date cannot be in the past");
        }
            
        //validation: check that sprint name is not taken 
        const exists = await this._sprintExists(sprintId); 
        if (exists) {
            //TODO: log warning
            return false;
        }
        
        //create sprint record 
        await this._dataAccess_putSprint(sprintId, startDate);

        //check that sprint is created 
        const created = await this._sprintExists(sprintId); 
        
        //if start date is now, set active 
        if (created && startDate <= unixDate()) {
            await this.setActiveSprint(sprintId);
        }
        
        return created;
    }

    async endSprint(sprintId: string): Promise<boolean> {
        //validation: check that sprint exists 
        const sprint = await this.getSprint(sprintId);
        if (!sprint) {
            //TODO: log warning
            return false;
        }
        
        //validation: check that sprint not already ended 
        if (!sprint.active) {
            //TODO: log warning
            return false;
        }
        
        //write record: set active=false and endDate = now
        sprint.endDate = unixDate(); 
        await this._dataAccess_putSprint(sprintId, sprint.startDate, sprint.endDate, 0);
        
        return !(await this._isCurrentSprint(sprintId));
    }
    
    async getSprint(sprintId: string): Promise<ISprint> {
        let output: ISprint = null;
        const sprint = await this._dataAccess_getSprint(sprintId); 
        if (sprint.success && sprint.data) {
            output = {
                sprintId : sprintId,
                active: parseInt(sprint.data.active.N) > 0,
                startDate: parseInt(sprint.data.startDate.N),
                endDate: parseInt(sprint.data.endDate.N)
            }
        }
        
        return output; 
    }
    
    async setActiveSprint(sprintId: string) : Promise<boolean> {
        const sprint = await this._dataAccess_getSprint(sprintId); 
        
        //if sprint not found, return false 
        if (!sprint.success || !sprint.data) 
            return false; 
            
        //deactivate any active sprint 
        const activeSprints = await this._dataAccess_getActiveSprints(); 
        
        //deactivate any active sprints first
        let alreadyActive: boolean = false;
        if (activeSprints.data.length > 0) {
            for (let n=0; n<activeSprints.data.length; n++) {
                let s = activeSprints.data[n];
                if (s.sprintId.S == sprintId) 
                    alreadyActive = true; 
                else
                    await this._dataAccess_putSprint(s.sprintId.S, s.startDate.N, unixDate(), 0); 
            }
        }
            
        //if sprint not active, set active 
        if (!alreadyActive) {
            if (parseInt(sprint.data.active.N) < 1) {
                await this._dataAccess_putSprint(sprintId, sprint.data.startDate.N, sprint.data.endDate.N, 1);
            }
        }
    }
    
    //private methods 
    async _sprintExists(sprintId: string): Promise<boolean> {
        const result = await this._dataAccess_getSprint(sprintId);
        return (result.success && result.data) ? true: false;
    }
    
    async _isCurrentSprint(sprintId: string): Promise<boolean> {
        const result = await this._dataAccess_getSprint(sprintId); 
        return result.success && result.data && (result.data.active.N > 0);
    }
    
    async _getScoresFromCache(cache: LocalScoreCache, sprintId: string, limit: number = 100): Promise<{fromCache: boolean, scores: IScore[]}> {
        if (!cache.isExpired()) {
            return {
                fromCache: true,
                scores: cache.getAsArray(limit, true)
            };
        }
        
        //TODO: if refreshing the cache, do it in separate thread 
        const data = await this._scanForScores(sprintId);
        
        //cache entire table
        cache.refresh(data);

        return {
            fromCache: false,
            scores: cache.getAsArray(limit, true)
        };
    }
    
    async _updateCacheItem(wallet: string, score:number, sprintId: string) {
        let cache: LocalScoreCache = null;
        if (sprintId == DEFAULT_SPRINT_KEY) {
            cache = localScoreCache_default;
        }
        else {
            if (await this._isCurrentSprint(sprintId)) {
                cache = localScoreCache_sprint; 
            }
        }
        
        if (cache) {
            cache.update({wallet, score}); 
        }
    }
    
    async _scanForScores(sprintId: string): Promise<IScore[]> {
        const params = {
            TableName: SCORES_TABLE_NAME,
            IndexName: GSI_SPRINT_NAME,
            KeyConditionExpression: "sprintId = :sprintid_val",
            ExpressionAttributeValues: {
                ":sprintid_val": {'S': sprintId}
            }
        };

        const results: any = await new Promise((resolve, reject) => 
        {
            this.dynamoDb.query(params, (error, data) => {
                if (error) {
                    console.error("Unable to scan the table. Error JSON:", JSON.stringify(error, null, 2));
                } else {
                    //TODO: is it necessary to sort here?
                    const sortedItems = data.Items.sort((a, b) => parseInt(b.score.N) - parseInt(a.score.N));
                    resolve(sortedItems);
                }
            });
        }); 
        
        let output = results.map((i) => { return { wallet: i.wallet.S, score: parseInt(i.score.N) } });
        
        return output;
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

    async _dataAccess_getActiveSprints(): Promise<IDynamoResult> {
        const params = {
            TableName: SPRINTS_TABLE_NAME,
            IndexName: GSI_ACTIVE_NAME,
            KeyConditionExpression: "active = :active_val",
            ExpressionAttributeValues: {
                ":active_val": { 'N': "1" }
            }
        };

        const results: any = await new Promise((resolve, reject) => {
            this.dynamoDb.query(params, (error, data) => {
                if (error) {
                    console.error("Unable to scan the table. Error JSON:", JSON.stringify(error, null, 2));
                    resolve({
                        success: false,
                        error: error,
                        data: null
                    });
                } else {
                    resolve({
                        success: true,
                        error: null, 
                        data: data.Items
                    });
                }
            });
        }); 
        
        return results;
    }

    async _dataAccess_putSprint(sprintId: string, startDate: number, endDate: number = 0, active: number = 0): Promise<IDynamoResult> {
        if (endDate == 0) 
            endDate = startDate + 365 * 3.154e+7;   //one year 
            
        return await this._dataAccess_putItem({ 
            TableName: SPRINTS_TABLE_NAME,
            Item: {
                'sprintId': { 'S': sprintId },
                'startDate': { 'N': startDate.toString() },
                'endDate': { 'N': endDate.toString() },
                'active': { 'N': active.toString() }
            }
        });
    }

    async _dataAccess_getItem(params: any): Promise<IDynamoResult> {
        const result: IDynamoResult = await new Promise((resolve, reject) => {
            this.dynamoDb.getItem(params, (err, data) => {
                if (err) {
                    console.error(err);
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
                    console.error(err);
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
    
    async _dataAccess_deleteSprint(sprintId: string): Promise<IDynamoResult> {
        const params = {
            TableName: SPRINTS_TABLE_NAME,
            Key: {
                'sprintId': { S: sprintId }
            }
        }; 

        const result: IDynamoResult = await new Promise((resolve, reject) => {
            this.dynamoDb.deleteItem(params, (err, data) => {
                if (err) {
                    console.error(err);
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
