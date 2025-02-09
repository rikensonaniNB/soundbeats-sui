import { ILeaderboard, ISprint } from './ILeaderboard';
import { IDynamoResult } from '../dataAccess/IDynamoResult';
import { Config } from '../config';
import { DynamoDbAccess } from '../dataAccess/DynamoDbAccess';
import { String } from 'aws-sdk/clients/batch';

const DEFAULT_SPRINT_KEY = "default";
const GSI_SPRINT_NAME = "GSI_SPRINT";
const GSI_ACTIVE_NAME = "GSI_ACTIVE";
const DEFAULT_SPRINT_LENGTH = 86400 * 14; 

//TODO: add logging 
//TODO: exception handling 
//TODO: log warning or error if any data access call is not successful 

function unixDate() {
    return Math.floor(Date.now()/1000);
}

interface IScore {
    wallet: string; 
    username: string;
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
    
    update(wallet: string, username: string, score: number) {
        if (this.data[wallet]) {
            this.data[wallet].score = score;
            this.data[wallet].username = username
        }
        else {
            this.data[wallet] = { wallet, score, username}
        }
    }
    
    refresh(scores: IScore[]) {
        this.lastRefresh = unixDate();
        for(let n=0; n<scores.length; n++) {
            this.update(scores[n].wallet, scores[n].username, scores[n].score);
        }
    }
    
    clear() {
        this.lastRefresh = 0;
        this.data = {};
    }
}

//TODO: cache expiration seconds should come from .env
const localScoreCache_default = new LocalScoreCache(300); 

const localScoreCache_sprint = new LocalScoreCache(300); 
   

export class LeaderboardDynamoDb implements ILeaderboard {
    network: string;
    dynamoDb: DynamoDbAccess;

    constructor(network: string) {
        this.network = network;
        
        const n = process.env.AWS_ACCESS_KEY;
        
        this.dynamoDb = new DynamoDbAccess();
    }

    async getLeaderboardScore(wallet: string, sprintId: string = ""): Promise<{ wallet: string, score: number, username: string, network: string }> {
        if (!sprintId || !sprintId.length) 
            sprintId = DEFAULT_SPRINT_KEY;
        if (sprintId == "current") 
            sprintId = await this._getActiveSprintName(); 
            
        
        const output = {
            wallet: wallet, 
            score: 0, 
            username: '',
            network: this.network
        };
        
        const result = await this._dataAccess_getScore(wallet, sprintId);
        
        if (result.success && result.data) {
            output.score = parseInt(result.data.score.N);
            output.username = result.data.username.S;
        }
        
        return output;
    }

    async getLeaderboardScores(limit: number = 100, sprintId: string = ""): Promise<{ scores: IScore[], network: string, fromCache: boolean }> {
        if (!sprintId || !sprintId.length) 
            sprintId = DEFAULT_SPRINT_KEY;
        if (sprintId == "current")
            sprintId = await this._getActiveSprintName(); 

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

    async addLeaderboardScore(wallet: string, username: string, score: number, sprintId: string = ""): Promise<{ score: number, username: string, network: string }> {
        if (!sprintId || !sprintId.length) 
            sprintId = DEFAULT_SPRINT_KEY;
        if (sprintId == "current")
            sprintId = await this._getActiveSprintName(); 
            
        score = parseInt(score.toString());
            
        const output = { score: score, username: username, network: this.network }
        
        //get current score first 
        const result = await this._dataAccess_getScore(wallet, sprintId); 
        if (result.success && result.data) {
            output.score = parseInt(result.data.score.N) + score;
            output.username = result.data.username?.S ?? '';
        }
        
        //write accumulated score 
        await this._dataAccess_putScore(wallet, username, output.score, sprintId) 
        
        //add to default too, if adding to sprint 
        if (sprintId != DEFAULT_SPRINT_KEY) {
            await this.addLeaderboardScore(wallet, username, score, sprintId); 
        }
        
        //update the cache 
        await this._updateCacheItem(wallet, username, output.score, sprintId)
        
        return output; 
    }

    //admin methods 
    async createSprint(sprintId: string, startDate: number = 0): Promise<boolean> {
        if (startDate == 0) 
            startDate = unixDate();

        //disallow values 'default' and 'current'
        if (sprintId.trim().toLowerCase() == "default" || sprintId.trim().toLowerCase() == "current")
            throw new Error(`Invalid sprintId identifier: ${sprintId}`); 

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
    
    async getSprints(limit: number) : Promise<ISprint[]> {
        const result = await this._dataAccess_scanSprints();
        const items = result.success ? result.data : [];
        const sprints = [];
        
        items.forEach(s => {
            sprints.push({
                sprintId: s.sprintId.S,
                startDate: parseInt(s.startDate.N),
                endDate: parseInt(s.endDate.N),
                active: parseInt(s.active.N) > 0
            });
        });
        
        return sprints;
    }
    
    async setActiveSprint(sprintId: string) : Promise<boolean> {
        const sprint = await this._dataAccess_getSprint(sprintId); 
        
        //if sprint not found, return false 
        if (!sprint.success || !sprint.data) 
            return false; 
            
        //if sprint not active, set active 
        if (parseInt(sprint.data.active.N) < 1) {

            //deactivate any active sprint 
            await this.endActiveSprint();
            
            let endDate = sprint.data.endDate.N; 
            if (endDate < unixDate())
                endDate = unixDate() + DEFAULT_SPRINT_LENGTH;
            await this._dataAccess_putSprint(sprintId, sprint.data.startDate.N, endDate, 1);
            
            //clear score cache for current sprint 
            localScoreCache_sprint.clear();
        }
    }
    
    async endActiveSprint(): Promise<boolean> {
        const activeSprintId = await this._getActiveSprintName(); 
        if (activeSprintId == "default")
            return false; 
            
        const activeSprint = await this.getSprint(activeSprintId); 
        if (activeSprint) {
            await this._dataAccess_putSprint(
                activeSprintId, 
                activeSprint.startDate, 
                unixDate(),
                0
            )
        }
    }
    
    //private methods 
    async _sprintExists(sprintId: string): Promise<boolean> {
        const result = await this._dataAccess_getSprint(sprintId);
        return (result.success && result.data) ? true: false;
    }
    
    async _getActiveSprintName(): Promise<string> {
        const activeSprints = await this._dataAccess_getActiveSprints(); 
        if (activeSprints.success && activeSprints.data && activeSprints.data.length) {
            const sprint = activeSprints.data[0]; 
            
            //if no end date, or end date is in future, it's ok
            if (sprint.endDate && sprint.endDate.N) {
                const endDate = parseInt(sprint.endDate.N);
                if (!endDate || endDate > unixDate())
                    return sprint.sprintId.S;
            } else {
                return sprint.sprintId.S;
            }
        }
        
        return 'default';
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
    
    async _updateCacheItem(wallet: string, username: string, score:number, sprintId: string) {
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
            cache.update(wallet, username, score); 
        }
    }
    
    async _scanForScores(sprintId: string): Promise<IScore[]> {
        const params = {
            TableName: Config.scoresTableName,
            IndexName: GSI_SPRINT_NAME,
            KeyConditionExpression: "sprintId = :sprintid_val",
            ExpressionAttributeValues: {
                ":sprintid_val": {'S': sprintId}
            }
        };
        
        const result = await this.dynamoDb.query(params); 
        if (result.success) {
            const sortedItems = result.data.sort((a, b) => parseInt(b.score.N) - parseInt(a.score.N));
            return sortedItems.map((i) => { return { wallet: i.wallet.S, username: i.username?.S ?? '', score: parseInt(i.score.N) } });
        }

        return [];
    }
    
    //data access methods 
    
    //TODO: not used
    async _dataAccess_scanSprints(): Promise<IDynamoResult> {
        return await this.dynamoDb.scanTable(Config.sprintsTableName);
    }

    async _dataAccess_getScore(wallet: string, sprintId: string): Promise<IDynamoResult> {
        return await this.dynamoDb.getItem({
            TableName: Config.scoresTableName,
            Key: {
                'wallet': { S: wallet },
                'sprintId': { S: sprintId }
            }
        });
    }

    async _dataAccess_putScore(wallet: string, username: string, score: number, sprintId: string): Promise<IDynamoResult> {
        return await this.dynamoDb.putItem({
            TableName: Config.scoresTableName,
            Item: {
                wallet: {'S': wallet },
                username: {'S': username },
                sprintId: { 'S': sprintId },
                score: { 'N': score.toString() }
            }
        }); 
    }

    async _dataAccess_getSprint(sprintId: string): Promise<IDynamoResult> {
        return await this.dynamoDb.getItem({
            TableName: Config.sprintsTableName,
            Key: {
                'sprintId': { S: sprintId }
            }
        });
    }

    async _dataAccess_getActiveSprints(): Promise<IDynamoResult> {
        const params = {
            TableName: Config.sprintsTableName,
            IndexName: GSI_ACTIVE_NAME,
            KeyConditionExpression: "active = :active_val",
            ExpressionAttributeValues: {
                ":active_val": { 'N': "1" }
            }
        };
        
        return await this.dynamoDb.query(params);
    }

    async _dataAccess_putSprint(sprintId: string, startDate: number, endDate: number = 0, active: number = 0): Promise<IDynamoResult> {
        if (endDate == 0) 
            endDate = startDate + 365 * 3.154e+7;   //one year 
            
        return await this.dynamoDb.putItem({ 
            TableName: Config.sprintsTableName,
            Item: {
                'sprintId': { 'S': sprintId },
                'startDate': { 'N': startDate.toString() },
                'endDate': { 'N': endDate.toString() },
                'active': { 'N': active.toString() }
            }
        });
    }
    
    async _dataAccess_deleteSprint(sprintId: string): Promise<IDynamoResult> {
        const params = {
            TableName: Config.sprintsTableName,
            Key: {
                'sprintId': { S: sprintId }
            }
        }; 

        return await this.dynamoDb.deleteItem(params);
    }
}
