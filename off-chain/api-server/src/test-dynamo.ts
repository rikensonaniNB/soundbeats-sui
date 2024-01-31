import * as AWS from "aws-sdk";

process.env.DBTABLE_NAME_SPRINTS = "leaderboard-sprints-dev";
process.env.DBTABLE_NAME_SCORES = "leaderboard-scores-dev";

async function main() {
    const n = process.env.AWS_ACCESS_KEY;

    AWS.config.update({
        accessKeyId: "AKIA3RQQOFZK7U7KTE2R",
        secretAccessKey: "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",
        region: "ap-northeast-1"
    });
    const dynamoDb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

    await new Promise((resolve, reject) => {
        dynamoDb.putItem({
            TableName: process.env.DBTABLE_NAME_SCORES,
            Item: {
                wallet: { 'S': "0x01" },
                sprintId: { 'S': "default" },
                score: { 'N': "1" }
            }
        }, (err, data) => {
            if (err) {
                console.error(err);
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });

    await new Promise((resolve, reject) => {
        dynamoDb.getItem({
            TableName: process.env.DBTABLE_NAME_SCORES,
            Key: {
                wallet: { 'S': "0x01" },
                sprintId: { 'S': "default" }
            }
        }, (err, data) => {
            if (err) {
                console.error(err);
                resolve(false);
            } else {
                console.log(data.Item);
                resolve(true);
            }
        });
    });
}

main();