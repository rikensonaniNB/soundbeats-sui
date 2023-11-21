
export interface ILeaderboard {
    getLeaderboardScore(wallet: string, sprintId: string): Promise<{ wallet: string, score: number, network: string }>;
    getLeaderboardScores(wallet: string, limit: number, sprintId: string): Promise<{ scores: { wallet: string, score: number }[], network: string }>
    addLeaderboardScore(wallet: string, score: number, sprintId: string): Promise<{ score: number, network: string }>
}
