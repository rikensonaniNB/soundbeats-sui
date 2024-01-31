process.env.DBTABLE_NAME_SPRINTS = "leaderboard-sprints-dev";
process.env.DBTABLE_NAME_SCORES = "leaderboard-scores-dev"; 

import { LeaderboardDynamoDb } from "./leaderboard/LeaderboardDynamoDb";
import { config, DynamoDB } from "aws-sdk";
import * as fs from 'fs';

const SCORES_TABLE_NAME = process.env.DBTABLE_NAME_SCORES;
const SPRINTS_TABLE_NAME = process.env.DBTABLE_NAME_SPRINTS;
const GSI_SPRINT_NAME = "GSI_SPRINT";
const GSI_SCORE_NAME = "GSI_SCORE";
const GSI_ACTIVE_NAME = "GSI_ACTIVE";

process.env.AWS_REGION = "ap-northeast-1"
process.env.AWS_ACCESS_KEY = "AKIA3RQQOFZK7U7KTE2R"
process.env.AWS_ACCESS_SECRET = "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";

config.update({
    accessKeyId: "AKIA3RQQOFZK7U7KTE2R",
    secretAccessKey: "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",
    region: "ap-northeast-1"
});

const dynamoDb = new DynamoDB();

async function deleteLeaderboardScores() {
    await deleteTable(SCORES_TABLE_NAME);
}

async function deleteLeaderboardSprints() {
    await deleteTable(SPRINTS_TABLE_NAME);
}

async function createLeaderboardScores() {
    const params = {
        TableName: SCORES_TABLE_NAME,
        KeySchema: [
            { AttributeName: "wallet", KeyType: "HASH" }, // Partition key
            { AttributeName: "sprintId", KeyType: "RANGE" } // Sort key
        ],
        AttributeDefinitions: [
            { AttributeName: "wallet", AttributeType: "S" }, // 'S' for string type
            { AttributeName: "sprintId", AttributeType: "S" }, // 'S' for string type
            //{ AttributeName: "score", AttributeType: "N" } // 'N' for numeric type
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

async function createLeaderboardSprints() {
    const params = {
        TableName: SPRINTS_TABLE_NAME,
        KeySchema: [
            { AttributeName: "sprintId", KeyType: "HASH" }, // Partition key
        ],
        AttributeDefinitions: [
            { AttributeName: "sprintId", AttributeType: "S" }, // 'S' for string type
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

async function createSprintGSI() {
    const params = {
        TableName: SCORES_TABLE_NAME,
        AttributeDefinitions: [
            // This definition is for the new GSI's partition key.
            {
                AttributeName: 'sprintId',
                AttributeType: 'S' // N for Number
            },
            // Include any other attribute definitions for attributes used as keys in your GSI.
        ],
        GlobalSecondaryIndexUpdates: [
            {
                Create: {
                    IndexName: GSI_SPRINT_NAME,
                    KeySchema: [
                        {
                            AttributeName: 'sprintId',
                            KeyType: 'HASH' // Partition key for the GSI
                        },
                        // If you have a sort key for your GSI, add it here.
                    ],
                    Projection: {
                        // Defines which attributes will be copied from the table to the index.
                        ProjectionType: 'ALL' // Options are: 'ALL', 'KEYS_ONLY', 'INCLUDE'
                    },
                    ProvisionedThroughput: {
                        // Set the read and write capacity for the GSI.
                        ReadCapacityUnits: 5,
                        WriteCapacityUnits: 5
                    }
                }
            }
        ]
    };

    return await new Promise((resolve, reject) => {
        dynamoDb.updateTable(params, function (error, data) {
            if (error) {
                console.error('Unable to update table. Error JSON:', JSON.stringify(error, null, 2));
                reject(error);
            } else {
                console.log('Updated table. Description JSON:', JSON.stringify(data, null, 2));
                resolve(true);
            }
        });
    });
}

async function createScoreGSI() {
    const params = {
        TableName: SCORES_TABLE_NAME,
        AttributeDefinitions: [
            // This definition is for the new GSI's partition key.
            {
                AttributeName: 'score',
                AttributeType: 'N' // N for Number
            },
            // Include any other attribute definitions for attributes used as keys in your GSI.
        ],
        GlobalSecondaryIndexUpdates: [
            {
                Create: {
                    IndexName: GSI_SCORE_NAME,
                    KeySchema: [
                        {
                            AttributeName: 'score',
                            KeyType: 'HASH' // Partition key for the GSI
                        },
                        // If you have a sort key for your GSI, add it here.
                    ],
                    Projection: {
                        // Defines which attributes will be copied from the table to the index.
                        ProjectionType: 'ALL' // Options are: 'ALL', 'KEYS_ONLY', 'INCLUDE'
                    },
                    ProvisionedThroughput: {
                        // Set the read and write capacity for the GSI.
                        ReadCapacityUnits: 5,
                        WriteCapacityUnits: 5
                    }
                }
            }
        ]
    };

    return await new Promise((resolve, reject) => {
        dynamoDb.updateTable(params, function (error, data) {
            if (error) {
                console.error('Unable to update table. Error JSON:', JSON.stringify(error, null, 2));
                reject(error);
            } else {
                console.log('Updated table. Description JSON:', JSON.stringify(data, null, 2));
                resolve(true);
            }
        });
    });
}

async function createActiveGSI() {
    const params = {
        TableName: SPRINTS_TABLE_NAME,
        AttributeDefinitions: [
            // This definition is for the new GSI's partition key.
            {
                AttributeName: 'active',
                AttributeType: 'N'
            },
            // Include any other attribute definitions for attributes used as keys in your GSI.
        ],
        GlobalSecondaryIndexUpdates: [
            {
                Create: {
                    IndexName: GSI_ACTIVE_NAME,
                    KeySchema: [
                        {
                            AttributeName: 'active',
                            KeyType: 'HASH' // Partition key for the GSI
                        },
                        // If you have a sort key for your GSI, add it here.
                    ],
                    Projection: {
                        // Defines which attributes will be copied from the table to the index.
                        ProjectionType: 'ALL' // Options are: 'ALL', 'KEYS_ONLY', 'INCLUDE'
                    },
                    ProvisionedThroughput: {
                        // Set the read and write capacity for the GSI.
                        ReadCapacityUnits: 5,
                        WriteCapacityUnits: 5
                    }
                }
            }
        ]
    };

    return await new Promise((resolve, reject) => {
        dynamoDb.updateTable(params, function (error, data) {
            if (error) {
                console.error('Unable to update table. Error JSON:', JSON.stringify(error, null, 2));
                reject(error);
            } else {
                console.log('Updated table. Description JSON:', JSON.stringify(data, null, 2));
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

async function createActiveSprint(lb: LeaderboardDynamoDb, sprintId: string) {

    let exists = false;

    exists = await lb._sprintExists(sprintId);

    //make sure active 
    if (exists)
        await lb.setActiveSprint(sprintId);
    else {
        await lb.createSprint(sprintId, unixDate());
    }

    let sprint = await lb.getSprint(sprintId);
    assert(sprint && sprint.active);
}

async function createInactiveSprint(lb: LeaderboardDynamoDb, sprintId: string) {

    let exists = false;

    exists = await lb._sprintExists(sprintId);

    await lb.createSprint(sprintId, unixDate() + 10000);

    let sprint = await lb.getSprint(sprintId);
    assert(sprint && !sprint.active);
}

function assert(pred) {
    if (!pred) throw Error("assertion failed");
}

function unixDate() {
    return Math.floor(Date.now() / 1000);
}

function readData() 
{
    const scores = [];
    const root = "/home/acer/Desktop/blockchain/Soundbeats/api-server/data/";
    const files = fs.readdirSync(root); 
    for(let i=0; i < files.length; i++) {
        const score = parseInt(fs.readFileSync(root + files[i]).toString()); 
        scores.push({
            wallet: files[i].substring(0, files[i].length-5), 
            score: score
        }); 
    }
    
    return scores;
}

async function main() {
    const lb: LeaderboardDynamoDb = new LeaderboardDynamoDb("testnet");

    //await deleteLeaderboardScores(); 
    //await deleteLeaderboardSprints();

    //await createLeaderboardScores();
    //await createLeaderboardSprints();

    //await createScoreGSI();
    //await createActiveGSI();
    //await createSprintGSI();
    
    //await lb.createSprint("test-sprint", unixDate());
    //const oldscores = await lb.getLeaderboardScores();
    
    /*{
        const scores = readData(); 
        for(let i=0; i<scores.length; i++) {
            await lb.addLeaderboardScore(scores[i].wallet, scores[i].score); 
        }
    }*/
    
    //return;
    
    //can get all sprints 
    {
        await lb.createSprint(createRandomAddress());
        const sprints = await lb.getSprints(0); 
        assert(sprints.length > 0);
    }

    //can add & get a score 
    //PASS
    {
        const address = createRandomAddress();
        await lb.addLeaderboardScore(address, 100);
        const score = await lb.getLeaderboardScore(address);
        assert(score.wallet == address);
        assert(score.score == 100);
    }

    //get nonexistent score
    //PASS
    {
        const address = createRandomAddress();
        const score = await lb.getLeaderboardScore(address);

        assert(score.score == 0);
    }

    //scores accumulate
    //PASS
    {
        const address = createRandomAddress();

        await lb.addLeaderboardScore(address, 400);
        const score1 = await lb.getLeaderboardScore(address);
        assert(score1.score == 400);

        await lb.addLeaderboardScore(address, 200);
        const score2 = await lb.getLeaderboardScore(address);
        assert(score2.score == 600);
    }

    //can get all scores
    //PASS
    {
        const scores = await lb.getLeaderboardScores(3);
        assert(scores.scores.length == 3);
    }

    //allscores are sorted by score
    //PASS
    {
        const scores = await lb.getLeaderboardScores(3);
        let val = Number.MAX_VALUE;
        for (let i = 0; i < scores.scores.length; i++) {
            const newval = scores.scores[i].score;
            assert(newval <= val);
            val = newval;
        }
    }

    //scores are served from cache 
    //PASS
    {
        const scores1 = await lb.getLeaderboardScores(3);
        const scores2 = await lb.getLeaderboardScores(3);
        //assert(!scores1.fromCache);
        assert(scores2.fromCache);
    }

    //cache is updated by adding 
    //PASS
    {
        const scores1 = await lb.getLeaderboardScores(3);
        const address = createRandomAddress();
        await lb.addLeaderboardScore(address, 100);
        const scores2 = await lb.getLeaderboardScores(100);
        assert(scores2.fromCache == true);

        const filtered = scores2.scores.filter(s => s.wallet == address);
        assert(filtered.length == 1);
        assert(filtered[0].score == 100);
    }

    //can set default/current sprint 
    //PASS
    {
        const sprintId = "stang";
        await createActiveSprint(lb, sprintId);

        await lb.setActiveSprint(sprintId);
        const result2 = await lb.getSprint(sprintId);
        assert(result2.active);
    }

    //can create an inactive sprint 
    //PASS
    {
        const sprintId = "inactive2";
        await createInactiveSprint(lb, sprintId);

        const sprint = await lb.getSprint(sprintId);
        assert(sprint && !sprint.active);
        assert(sprint.sprintId == sprintId);
    }

    //can create an active sprint
    //PASS
    {
        const sprintId = "stang2";
        await createActiveSprint(lb, sprintId);

        const sprint = await lb.getSprint(sprintId);
        assert(sprint.sprintId == sprintId);
        assert(sprint && sprint.active);
    }

    //can delete sprint 
    //PASS
    {
        const sprintId = "stang";
        let exists = false;

        exists = await lb._sprintExists(sprintId);
        if (!exists) {
            await lb.createSprint(sprintId, unixDate() + 1000);
            exists = await lb._sprintExists(sprintId);
        }

        assert(exists);
        await lb._dataAccess_deleteSprint(sprintId);

        exists = await lb._sprintExists(sprintId);
        assert(!exists);
    }

    //can end a sprint 
    //PASS
    {
        const sprintId = "stang";
        await createActiveSprint(lb, sprintId);

        //end the sprint 
        await lb.endSprint(sprintId);
        const sprint = await lb.getSprint(sprintId);
        assert(!sprint.active);
        assert(!(await lb._isCurrentSprint(sprintId)));
    }

    //setting a sprint to active deactivates other active sprints 
    //PASS
    {
        const sprintId1 = "stang";
        const sprintId2 = "soda";
        let exists = false;
        let sprint1, sprint2;

        exists = await lb._sprintExists(sprintId1);

        //make sure active 
        if (exists)
            await lb.setActiveSprint(sprintId1);
        else {
            await lb.createSprint(sprintId1, unixDate());
        }

        sprint1 = await lb.getSprint(sprintId1);
        assert(sprint1 && sprint1.active);

        //create a new active sprint 

        exists = await lb._sprintExists(sprintId2);

        //make sure active 
        if (exists)
            await lb.setActiveSprint(sprintId2);
        else {
            await lb.createSprint(sprintId2, unixDate());
        }

        sprint1 = await lb.getSprint(sprintId1);
        sprint2 = await lb.getSprint(sprintId2);

        assert(!sprint1.active);
        assert(sprint2.active);
    }

    //can add a score for sprint 
    //PASS
    {
        const sprintId = "stang";
        const walletId = "0x11";
        await createActiveSprint(lb, sprintId);

        const startScore_default = (await lb.getLeaderboardScore(walletId)).score;
        const startScore_sprint = (await lb.getLeaderboardScore(walletId, sprintId)).score;

        await lb.addLeaderboardScore(walletId, 100);
        await lb.addLeaderboardScore(walletId, 100, sprintId);

        const endScore_default = (await lb.getLeaderboardScore(walletId)).score;
        const endScore_sprint = (await lb.getLeaderboardScore(walletId, sprintId)).score;

        assert(endScore_default == startScore_default + 100 + 100);
        assert(endScore_sprint == startScore_sprint + 100);
    }

    //get get a single score for a sprint
    {
        //TODO: finish this test
        const lbsprint = await lb.getLeaderboardScore("0x01", "mysprint");
    }

    //sprint scores accumulate 
    {
        const sprintId = "stang";
        await createActiveSprint(lb, sprintId);

        await lb.addLeaderboardScore("0x12", 100, sprintId);
        await lb.addLeaderboardScore("0x12", 100, sprintId);
    }

    //sprint scores are separate 
    {
        //TODO: finish this test
        const sprintscores = await lb.getLeaderboardScores(100, "mysprint");
    }

    //can get all scores for sprint 
    {
        //create a sprint 
        const sprintId = "newton";
        await createActiveSprint(lb, sprintId);

        //add a bunch of scores 
        await Promise.all([
            lb.addLeaderboardScore("0x11", 100, sprintId),
            lb.addLeaderboardScore("0x13", 300, sprintId),
            lb.addLeaderboardScore("0x12", 200, sprintId),
            lb.addLeaderboardScore("0x15", 500, sprintId),
            lb.addLeaderboardScore("0x14", 400, sprintId)
        ]);

        const scores = await lb.getLeaderboardScores(3, sprintId);
        assert(scores.scores.length == 3);

        //sprint scores are sorted by score 
        let val = Number.MAX_VALUE;
        for (let i = 0; i < scores.scores.length; i++) {
            const newval = scores.scores[i].score;
            assert(newval <= val);
            val = newval;
        }
    }

    //sprint scores are served from cache 
    {
        //TODO: finish this test
    }

    //sprint scores obey the limit 
    {
        const sprintscores = await lb.getLeaderboardScores(1, "mysprint");
    }
    
    //sprint scores are ok with a limit that's too big
    {
        const sprintId = "stang";
        await createActiveSprint(lb, sprintId); 
        
        //TODO: finish this test
        const sprintscores = await lb.getLeaderboardScores(1000000, sprintId);
        assert(sprintscores.scores.length < 10000000); 
    }

    //sprint score cache is updated by adding 
    {
        //TODO: finish this test
    }

    //get score for nonexistent wallet 
    {
        const sprintId = "stang";
        await createActiveSprint(lb, sprintId);

        const wallet = createRandomAddress(); 
        const score = await lb.getLeaderboardScore(wallet, sprintId);
        assert(score.score == 0);
        assert(score.wallet == wallet);
    }

    //get score for nonexistent sprint 
    {
        const sprintId = createRandomAddress();

        const wallet = createRandomAddress();
        const score = await lb.getLeaderboardScore(wallet, sprintId);
        assert(score.score == 0);
        assert(score.wallet == wallet);
    }

    //get scores for nonexistent sprint 
    {
        const sprintId = createRandomAddress();

        const wallet = createRandomAddress();
        const score = await lb.getLeaderboardScores(10, sprintId);
        assert(score.scores.length == 0);
    }

    //put score to 'current' sprint 
    {
        const sprintId = "Marcotte";
        const wallet = createRandomAddress();
        await createActiveSprint(lb, sprintId);
        
        const score1 = await lb.getLeaderboardScore(wallet, sprintId);
        assert(score1.wallet == wallet);
        
        await lb.addLeaderboardScore(wallet, 10, "current");
        
        const score2 = await lb.getLeaderboardScore(wallet, sprintId);
        assert(score2.score > score1.score);
        assert(score2.score >= 10);
        assert(score2.wallet == wallet);

        const score3 = await lb.getLeaderboardScore(wallet, "current");
        assert(score3.score == score2.score);
        assert(score3.wallet == score2.wallet);
    }

    //get scores from 'current' sprint 
    {
        const sprintId = "Marcotte";
        const wallet = createRandomAddress();
        await createActiveSprint(lb, sprintId);

        const scores1 = await lb.getLeaderboardScores(1000, sprintId);
        await lb.addLeaderboardScore(wallet, 10, sprintId);

        const scores2 = await lb.getLeaderboardScores(1000, "current");
        assert(scores2.scores.length == scores1.scores.length + 1);

        const scores3 = await lb.getLeaderboardScores(1000, sprintId);
        assert(scores3.scores.length == scores2.scores.length);
    }
    
    //end active sprint
    
    //if no active sprints, 'current' defaults to 'default'
    const wallet = createRandomAddress();
}

main();