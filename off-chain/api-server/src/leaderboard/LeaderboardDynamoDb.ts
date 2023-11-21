import { ILeaderboard } from './ILeaderboard';
import AWS from 'aws-sdk';


export class LeaderboardDynamoDb implements ILeaderboard {
    network: string;
    dynamoDb: any;

    constructor(network: string) {
        this.network = network;
        AWS.config.update({ region: process.env.AWS_REGION });
        this.dynamoDb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
    }

    async getLeaderboardScore(wallet: string, sprintId: string = ""): Promise<{ wallet: string, score: number, network: string }> {
        const params: any = {
            TableName: 'leaderboard',
            Key: {
                'KEY_NAME': { wallet }
            }
        }; 
        
        const output = {
            wallet: wallet, 
            score: 0, 
            network: this.network
        };
        
        const result: any = await new Promise((resolve, reject) => {
            this.dynamoDb.getItem(params, (err, data) => {
                if (err) {
                    resolve({
                        success: false,
                        data: err
                    });
                } else {
                    resolve({
                        success: true,
                        data: data.Item
                    });
                }
            });
        }); 
        
        if (result.success) {
            output.score = result.score;
        }
        
        return output;
    }

    async getLeaderboardScores(wallet: string, limit: number = 100, sprintId: string = ""): Promise<{ scores: { wallet: string, score: number }[], network: string }> {
        let output = { scores: [], network: this.network };

        return output;
    }

    async addLeaderboardScore(wallet: string, score: number, sprintId: string = ""): Promise<{ score: number, network: string }> {
        const output = { score: 0, network: this.network };
        const params: any = {
            TableName: 'leaderboard',
            Item: {
                wallet,
                score,
                network: this.network
            }
        }; 
        
        const result: any = await new Promise((resolve, reject) => {
            this.dynamoDb.put(params, (err, data) => {
                if (err) {
                    resolve({
                        success: false,
                        data: err
                    });
                } else {
                    resolve({
                        success: true,
                        data: data
                    });
                }
            });
        });
        
        if (result.success) {
            output.score = score
        }
        
        return output; 
    }
}
