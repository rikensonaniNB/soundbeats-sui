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
}