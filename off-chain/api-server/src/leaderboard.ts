import * as fs from 'fs';

export interface ILeaderboard {
    getLeaderboardScore(wallet: string): { wallet: string, score: number };
    getLeaderboardScores(wallet: string): { scores: { wallet: string, score: number }[] }
    addLeaderboardScore(wallet: string, score: number): { score: number }
}

/***
 * Implementation of ILeaderboard that just stores the data in memory (which is wiped out when 
 * the application is restarted; so this is more used for testing)
 */
class LeaderboardMemory implements ILeaderboard {
    leaderboardMap: Map<string, number>;
    network: string;

    constructor(network: string) {
        this.leaderboardMap = new Map();
        this.network = network;
    }

    getLeaderboardScore(wallet: string): { wallet: string, score: number, network: string } {
        const output = { wallet, score: 0, network: this.network };

        if (this.leaderboardMap.has(wallet))
            output.score = this.leaderboardMap.get(wallet);

        return output;
    }

    getLeaderboardScores(wallet: string): { scores: { wallet: string, score: number }[], network: string } {
        let output = { scores: [], network: this.network };

        if (wallet && wallet.length > 0) {
            output.scores.push(this.getLeaderboardScore(wallet));
        }
        else {
            this.leaderboardMap.forEach((value: number, key: string) => {
                output.scores.push({ wallet: key, score: value });
            });
        }

        return output;
    }

    addLeaderboardScore(wallet: string, score: number): { score: number, network: string } {
        const output = { score: 0, network: this.network };

        if (this.leaderboardMap.has(wallet))
            output.score = this.leaderboardMap.get(wallet);

        output.score = parseInt(output.score.toString()) + parseInt(score.toString());
        this.leaderboardMap.set(wallet, output.score);

        return output;
    }
}

/**
 * Implementation of ILeaderboard that stores data in local JSON files. 
 * While this is still used for testing, it's a step beyond LeaderboardMemory, as it persists 
 * the data. 
 */
class LeaderboardJsonFile extends LeaderboardMemory {

    constructor(network: string) {
        super(network);
        this._readFromFiles();
    }

    addLeaderboardScore(wallet: string, score: number): { score: number, network: string } {
        const output = super.addLeaderboardScore(wallet, score);

        this._writeToFile(wallet);
        return output;
    }

    _writeToFile(wallet: string) {
        if (this.leaderboardMap.has(wallet)) {
            const path = `data/${wallet}.json`;
            fs.writeFileSync(path, this.leaderboardMap.get(wallet).toString());
        }
    }

    _readFromFiles() {
        const path = `data/`;
        const files = fs.readdirSync(path);

        files.forEach(filename => {
            const wallet = filename.split('.')[0];
            fs.readFile(`data/${filename}`, (err, data) => {
                try {
                    this.leaderboardMap.set(wallet, parseInt(data.toString()));
                }
                catch (e) {
                    console.error(e);
                }
            });
        });
    }
}

/**
 * Returns an instance of ILeaderboard that will be used for accessing the leaderboard database.
 * 
 * @returns ILeaderboard instance 
 */
export function getLeaderboardInstance(): ILeaderboard {
    return new LeaderboardJsonFile();
}