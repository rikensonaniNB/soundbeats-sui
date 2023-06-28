import * as fs from 'fs';

export interface ILeaderboard {
    getLeaderboardScore(wallet: string): { wallet: string, score: number };
    getLeaderboardScores(wallet: string): { scores: { wallet: string, score: number }[] }
    addLeaderboardScore(wallet: string, score: number): { score: number }
}

class LeaderboardMemory implements ILeaderboard {
    leaderboardMap: Map<string, number>

    constructor() {
        this.leaderboardMap = new Map();
    }

    getLeaderboardScore(wallet: string): { wallet: string, score: number } {
        const output = { wallet, score: 0 };

        if (this.leaderboardMap.has(wallet))
            output.score = this.leaderboardMap.get(wallet);

        return output;
    }

    getLeaderboardScores(wallet: string): { scores: { wallet: string, score: number }[] } {
        let output = { scores: [] };

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

    addLeaderboardScore(wallet: string, score: number): { score: number } {
        const output = { score: 0 };

        if (this.leaderboardMap.has(wallet))
            output.score = this.leaderboardMap.get(wallet);

        output.score += score;
        this.leaderboardMap.set(wallet, output.score);

        return output;
    }
}

class LeaderboardJsonFile extends LeaderboardMemory {

    constructor() {
        super();
        this._readFromFiles();
    }

    addLeaderboardScore(wallet: string, score: number): { score: number } {
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

export function getLeaderboardInstance(): ILeaderboard {
    return new LeaderboardJsonFile();
}