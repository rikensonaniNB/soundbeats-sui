import { Config } from '../config';
import { IAuthRecord, IAuthManager } from './IAuthManager';
import { IDynamoResult } from '../dataAccess/IDynamoResult';
const AWS = require("aws-sdk");

export class AuthManagerDynamoDb implements IAuthManager {
    dynamoDb: any;

    constructor() {
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_ACCESS_SECRET,
            region: process.env.AWS_REGION
        });
        this.dynamoDb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
    }

    async register(authId: string, authType: string, extraData: any = null): Promise<boolean> {

        //make sure it doesn't already exist
        const existing = await this._dataAccess_getAuthRecord(authId, authType);
        if (existing.success && existing.data) {
            return false;
        }

        //write it to the database
        const result = await this._dataAccess_putAuthRecord(authId, authType, extraData);

        return result.success;
    }

    async exists(authId: string, authType: string): Promise<boolean> {
        return await this.getRecord(authId, authType) != null; 
    }

    async getRecord(authId: string, authType: string): Promise<IAuthRecord> {
        let output: IAuthRecord = null; 
        
        const existing = await this._dataAccess_getAuthRecord(authId, authType); 
        if (existing.success && existing.data) {
            output = {
                authId: existing.data.authId.S,
                authType: existing.data.authType.S,
                extraData: null
            }
            
            if (existing.data.extraData && existing.data.extraData.S && existing.data.extraData.S.length > 0) {
                output.extraData = JSON.parse(existing.data.extraData.S);
            }
        }
        
        return output;
    }

    async getAuthRecords(): Promise<IAuthRecord[]> {
        const result = await await this._dataAccess_scanTable(Config.authTableName);
        const items = result.success ? result.data : [];
        const output = [];

        items.forEach(s => {
            output.push({
                authId: s.authId.S,
                authType: s.authType.S,
                extraData: s.extraData && s.extraData.S && s.extraData.S.length ? JSON.parse(s.extraData.S) : null
            });
        });

        return output;
    }

    async setSuiWalletAddress(authId: string, authType: string, suiAddress: string): Promise<boolean> {
        //get the record 
        const record: IAuthRecord = await this.getRecord(authId, authType); 
        if (!record)
            return false;
            
        //remove private key if it exists
        if (record.extraData.privateKey) {
            record.extraData.privateKey = null;
        }
        
        //update the data
        record.authId = suiAddress;
        const response = await this._dataAccess_putAuthRecord(authId, authType); 
        return response.success;
    }

    //private methods 
    
    async _dataAccess_getAuthRecord(authId: string, authType: string): Promise<IDynamoResult> {
        return await this._dataAccess_getItem({
            TableName: process.env.DBTABLE_NAME_AUTH,
            Key: {
                'authId': { S: authId },
                'authType': { S: authType }
            }
        });
    }

    async _dataAccess_putAuthRecord(authId: string, authType: string, extraData: any = null): Promise<IDynamoResult> {
        //get the core data items 
        const data: any = {
            authId: { 'S': authId },
            authType: { 'S': authType },
        };
        
        //add extra data if any
        if (extraData) {
            data.extraData = { 'S' : JSON.stringify(extraData) }; 
        }
        
        //write to DB & return result
        return await this._dataAccess_putItem({
            TableName: process.env.DBTABLE_NAME_AUTH,
            Item: data
        });
    }
    
    //TODO: move to utilities in dataAccess
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

    //TODO: move to utilities in dataAccess
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

    //TODO: move to utilities in dataAccess
    async _dataAccess_scanTable(tableName: string): Promise<IDynamoResult> {
        const params = {
            TableName: tableName
        };

        const results: any = await new Promise((resolve, reject) => {
            this.dynamoDb.scan(params, (error, data) => {
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
}