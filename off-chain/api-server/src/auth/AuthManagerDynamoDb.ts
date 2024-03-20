import { Config } from '../config';
import { IAuthRecord, IAuthManager, IAuthSession } from './IAuthManager';
import { IDynamoResult } from '../dataAccess/IDynamoResult';
import { DynamoDbAccess } from '../dataAccess/DynamoDbAccess';

function unixTimestamp(): number {
    return Math.floor(Date.now()/1000);
}

export class AuthManagerDynamoDb implements IAuthManager {
    dynamoDb: DynamoDbAccess;

    constructor() {
        this.dynamoDb = new DynamoDbAccess();
    }

    async register(authId: string, authType: 'evm' | 'sui', suiWallet: string, extraData: any = null): Promise<boolean> {

        //make sure it doesn't already exist
        const existing = await this._dataAccess_getAuthRecord(authId, authType);
        if (existing.success && existing.data) {
            return false;
        }
        
        //if authType is sui, authId is same as suiWallet
        if (authType == 'sui') {
            suiWallet = authId;
        }

        //write it to the database
        const result = await this._dataAccess_putAuthRecord(authId, authType, suiWallet, extraData);

        return result.success;
    }

    async exists(authId: string, authType: 'evm' | 'sui'): Promise<boolean> {
        return await this.getAuthRecord(authId, authType) != null; 
    }

    async getAuthRecord(authId: string, authType: 'evm' | 'sui'): Promise<IAuthRecord> {
        let output: IAuthRecord = null; 
        
        const existing = await this._dataAccess_getAuthRecord(authId, authType); 
        if (existing.success && existing.data) {
            output = {
                authId: existing.data.authId.S,
                authType: existing.data.authType.S,
                extraData: null, 
                suiWallet: existing.data.suiWallet.S
            }
            
            if (existing.data.extraData && existing.data.extraData.S && existing.data.extraData.S.length > 0) {
                output.extraData = JSON.parse(existing.data.extraData.S);
            }
        }
        
        return output;
    }

    async getAuthRecords(): Promise<IAuthRecord[]> {
        const result = await await this.dynamoDb.scanTable(Config.authTableName);
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
    
    async updateAuthRecord(authId: string, authType: 'evm' | 'sui', suiWallet: string): Promise<void> {
        const record: IAuthRecord = await this.getAuthRecord(authId, authType); 
        
        //ensure that record exists
        if (!record) {
            throw new Error(`Auth record ${authId}/${authType} not found.`);
        }
        
        //updatet the database
        await this._dataAccess_putAuthRecord(authId, authType, suiWallet, record.extraData);
    }

    async getAuthSession(sessionId: string): Promise<IAuthSession> {
        const session = await this._dataAccess_getAuthSession(sessionId); 
        return session;
    }
    
    async startAuthSession(evmWallet: string): Promise<{ sessionId: string, messageToSign: string }> {
        //generate a random client token 
        const sessionId: string = this._generatesessionId(); 
        
        //generate a random message
        const message: string = this._generateRandomMessage();
        
        const now: number = unixTimestamp();
        const session: IAuthSession = {
            sessionId, 
            message, 
            evmWallet, 
            suiWallet: '', 
            startTimestamp: now,
            updateTimestamp: now,
            success: false
        };

        //save record to database 
        await this._dataAccess_putAuthSession(session);
        
        return {
            sessionId,
            messageToSign: session.message
        }
    }
    
    async updateAuthSession(sessionId: string, evmWallet: string, suiWallet: string, success: boolean): Promise<void> {
        const session: IAuthSession = await this.getAuthSession(sessionId); 
        if (!session) {
            throw new Error(`Sesssion ${sessionId} not found`);
        }
        
        //update properties 
        session.evmWallet = evmWallet;
        session.suiWallet = suiWallet;
        session.success = success;
        session.updateTimestamp = unixTimestamp();
        
        //save the object 
        await this._dataAccess_putAuthSession(session);
    }

    async setSuiWalletAddress(authId: string, authType: 'evm' | 'sui', suiAddress: string): Promise<boolean> {
        //get the record 
        const record: IAuthRecord = await this.getAuthRecord(authId, authType); 
        if (!record)
            return false;
            
        //remove private key if it exists
        if (record.extraData.privateKey) {
            record.extraData.privateKey = null;
        }
        
        //update the data
        record.authId = suiAddress;
        const response = await this._dataAccess_putAuthRecord(authId, authType, suiAddress); 
        return response.success;
    }

    //private methods 
    
    async _dataAccess_putAuthSession(session: IAuthSession): Promise<IDynamoResult> {
        return await this.dynamoDb.putItem({
            TableName: process.env.DBTABLE_NAME_AUTH_SESSION,
            Item: {
                //TODO: rename to sessionId
                clientToken: { 'S': session.sessionId },
                message: { 'S': session.message ?? ''  },
                success: { 'S': session.success ? "T" : "F"},
                suiWallet: { 'S': session.suiWallet ?? ''  },
                evmWallet: { 'S': session.evmWallet ?? ''  },
                startTimestamp: { 'N': session.startTimestamp.toString() },
                updateTimestamp: { 'N': unixTimestamp().toString() }
            }
        });
    }

    async _dataAccess_getAuthRecord(authId: string, authType: string): Promise<IDynamoResult> {
        return await this.dynamoDb.getItem({
            TableName: process.env.DBTABLE_NAME_AUTH,
            Key: {
                'authId': { S: authId },
                'authType': { S: authType }
            }
        });
    }

    async _dataAccess_getAuthSession(sessionId: string): Promise<IAuthSession> {
        const record = await this.dynamoDb.getItem({
            TableName: process.env.DBTABLE_NAME_AUTH_SESSION,
            Key: {
                "clientToken": { "S": sessionId }
            }
        });
        
        let output: IAuthSession = null;
        
        if (record.success && record.data) {
            output = {
                sessionId : record.data.clientToken.S, //TODO: rename to sessionId
                message : record.data.message.S,
                evmWallet : record.data.evmWallet.S,
                suiWallet: record.data.suiWallet.S,
                startTimestamp: parseInt(record.data.startTimestamp.N ? record.data.startTimestamp.N : 0),
                updateTimestamp: parseInt(record.data.updateTimestamp.N ? record.data.updateTimestamp.N : 0),
                success: record.data.success.S == "T"
            }
        }
        
        return output;
    }

    async _dataAccess_putAuthRecord(authId: string, authType: 'evm' | 'sui', suiWallet: string, extraData: any = null): Promise<IDynamoResult> {
        //get the core data items 
        const data: any = {
            authId: { 'S': authId },
            authType: { 'S': authType },
            suiWallet: { 'S': suiWallet }
        };
        
        //add extra data if any
        if (extraData) {
            data.extraData = { 'S' : JSON.stringify(extraData) }; 
        }
        
        //write to DB & return result
        return await this.dynamoDb.putItem({
            TableName: process.env.DBTABLE_NAME_AUTH,
            Item: data
        });
    }
    
    _generatesessionId() : string {
        return this._bigIntToBase64(this._generateRandomBigInt(256));
    }

    _generateRandomMessage(): string {
        return this._bigIntToBase64(this._generateRandomBigInt(256));
    }
    
    _generateRandomBigInt(bitLength: number): BigInt {
        const byteLength = bitLength / 8;
        const randomBytes = new Uint8Array(byteLength);
        //crypto.getRandomValues(randomBytes); 
        for(let n=0; n<randomBytes.length; n++) {
            randomBytes[n] = Math.random() * 255;
        }
        let hexString = '0x';
        randomBytes.forEach(byte => {
            hexString += byte.toString(16).padStart(2, '0');
        });
        return BigInt(hexString);
    }

    _bigIntToBase64(bigintValue: BigInt): string {
        const hex = bigintValue.toString(16);
        const hexArray = [];
        for (let i = 0; i < hex.length; i += 2) {
            hexArray.push(parseInt(hex.substr(i, 2), 16));
        }
        const byteArray = new Uint8Array(hexArray);
        let binaryString = '';
        byteArray.forEach(byte => {
            binaryString += String.fromCharCode(byte);
        });
        return btoa(binaryString); 
    }
}