process.env.DBTABLE_NAME_AUTH = "auth-dev";

import { AuthManagerDynamoDb } from "./auth/AuthManagerDynamoDb";
import { config, DynamoDB } from "aws-sdk";
import { Config } from './config';
import * as fs from 'fs';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519'

const AUTH_TABLE_NAME = process.env.DBTABLE_NAME_AUTH;

process.env.AWS_REGION = "ap-northeast-1"
process.env.AWS_ACCESS_KEY = "AKIA3RQQOFZK7U7KTE2R"
process.env.AWS_ACCESS_SECRET = "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";

config.update({
    accessKeyId: "AKIA3RQQOFZK7U7KTE2R",
    secretAccessKey: "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",
    region: "ap-northeast-1"
});

const dynamoDb = new DynamoDB();



async function deleteAuthTable() {
    await deleteTable(AUTH_TABLE_NAME);
}

async function createAuthTable() {
    const params = {
        TableName: AUTH_TABLE_NAME,
        KeySchema: [
            { AttributeName: "authId", KeyType: "HASH" }, // Partition key
            { AttributeName: "authType", KeyType: "RANGE" } // Sort key
        ],
        AttributeDefinitions: [
            { AttributeName: "authId", AttributeType: "S" },
            { AttributeName: "authType", AttributeType: "S" },
            //{ AttributeName: "extraData", AttributeType: "S" },
            //{ AttributeName: "suiWallet", AttributeType: "S" },
            //{ AttributeName: "sessionKey", AttributeType: "S" }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        }
    };

    return await new Promise((resolve, reject) => {
        dynamoDb.createTable(params, (error, data) => {
            if (error) {
                console.error("Unable to create table. Error JSON:", JSON.stringify(error, null, 2));
                reject(error);
            } else {
                console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
                resolve(true);
            }
        });
    });
}

async function deleteTable(tableName: string) {
    const params = {
        TableName: tableName
    };

    return new Promise((resolve, reject) => {
        dynamoDb.deleteTable(params, (error, data) => {
            if (error) {
                console.error("Unable to delete table. Error JSON:", JSON.stringify(error, null, 2));
                resolve(error);
            } else {
                console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
                resolve(true);
            }
        });
    });
}

function createRandomAddress(len: number = 20): string {
    const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'a', 'b', 'c', 'd', 'e', 'f'];
    let output = "";
    for (let n = 0; n < len; n++) {
        const rand = Math.floor(Math.random() * len + 1);
        output += chars[rand];
    }
    return output;
}

function assert(pred, msg = '') {
    if (!pred) {
        if (msg.length > 0) {
            throw Error("assertion failed");
        } else {
            throw Error("assertion failed: " + msg);
        }
    }
}

function unixDate() {
    return Math.floor(Date.now() / 1000);
}

function readData() {
    const scores = [];
    const root = "/home/acer/Desktop/blockchain/Soundbeats/api-server/data/";
    const files = fs.readdirSync(root);
    for (let i = 0; i < files.length; i++) {
        const score = parseInt(fs.readFileSync(root + files[i]).toString());
        scores.push({
            wallet: files[i].substring(0, files[i].length - 5),
            score: score
        });
    }

    return scores;
}

function getRandomKeypair() {
    const keypair = new Ed25519Keypair();
    const exported = keypair.export();

    return {
        address: keypair.toSuiAddress(),
        privateKey: exported.privateKey
    }
}

async function main() {
    const auth: AuthManagerDynamoDb = new AuthManagerDynamoDb();

    //await deleteAuthTable();

    //await createAuthTable();

    //return;

    /*
    TABLE STRUCTURE: 
    primary key: auth type + identifier
    authType (evm | username | email | oauth)
    authId 
    extraData:  {salt: '', hash: ''}
    suiWallet
    sessionKey
    */
   
    {
        const keypair = getRandomKeypair();
        console.log(keypair);
    }

    //can register without extra data
    {
        const wallet = createRandomAddress();
        const success = await auth.register(wallet, "Sui"); 
        assert(success);
        const login = await auth.getRecord(wallet, "Sui"); 
        assert(login.authId == wallet);
        assert(login.authType == "Sui");
        assert(!login.extraData);
    }

    //can register with extra data
    {
        const wallet = createRandomAddress();
        const success = await auth.register(wallet, "Sui", { username: "username"});
        assert(success);
        const login = await auth.getRecord(wallet, "Sui");
        assert(login.authId == wallet);
        assert(login.authType == "Sui");
        assert(login.extraData && login.extraData.username == "username");
    }

    //if no active sprints, 'current' defaults to 'default'
}

main();