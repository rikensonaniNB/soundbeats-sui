import * as fs from 'fs';
import { ILeaderboard, ISprint } from './ILeaderboard';

/***
 * Implementation of ILeaderboard that just stores the data in memory (which is wiped out when 
 * the application is restarted; so this is more used for testing)
 */
export class LeaderboardMemory implements ILeaderboard {
    leaderboardMap: Map<string, number>;
    network: string;

    constructor(network: string) {
        this.leaderboardMap = new Map();
        this.network = network;
    }

    async getLeaderboardScore(wallet: string, sprintId: string = ""): Promise<{ wallet: string, score: number, network: string }> {
        const output = { wallet, score: 0, network: this.network };

        if (this.leaderboardMap.has(wallet))
            output.score = this.leaderboardMap.get(wallet);

        return output;
    }

    async getLeaderboardScores(limit: number = 100, sprintId: string = ""): Promise<{ scores: { wallet: string, score: number }[], network: string }> {
        let output = { scores: [], network: this.network };

        this.leaderboardMap.forEach((value: number, key: string) => {
            output.scores.push({ wallet: key, score: value });
        });

        //sort 
        output.scores.sort((a, b) => { return b.score - a.score });

        if (limit > 0 && output.scores.length > limit) {
            output.scores = output.scores.slice(0, limit);
        }

        return output;
    }

    async addLeaderboardScore(wallet: string, score: number, sprintId: string = ""): Promise<{ score: number, network: string }> {
        const output = { score: 0, network: this.network };

        if (this.leaderboardMap.has(wallet))
            output.score = this.leaderboardMap.get(wallet);

        output.score = parseInt(output.score.toString()) + parseInt(score.toString());
        this.leaderboardMap.set(wallet, output.score);

        return output;
    }

    //admin methods 
    async createSprint(sprintName: string): Promise<boolean> {
        throw "Not implemented";
        return false;
    }
    
    async endSprint(sprintName: string): Promise<boolean> {
        throw "Not implemented";
        return false;
    }
    
    async getSprint(sprintId: string): Promise<ISprint> {
        return null;
    }

    async getSprints(limit: number): Promise<ISprint[]> {
        return [];
    }
}
