
export interface ILeaderboard {
    getLeaderboardScore(wallet: string, sprintId: string): Promise<{ wallet: string, score: number, network: string }>;
    getLeaderboardScores(wallet: string, limit: number, sprintId: string): Promise<{ scores: { wallet: string, score: number }[], network: string }>
    addLeaderboardScore(wallet: string, score: number, sprintId: string): Promise<{ score: number, network: string }>
    
    //admin methods 
    createSprint(sprintName: string, startDate: number): Promise<boolean>; 
    endSprint(sprintName: string): Promise<boolean>;
}


/*

leaderboard
pk: wallet (string)
sk: sprint (string)
score (number)

leaderboard-sprintconfig
pk: sprint name (string)
start date (number)
end date (number)
active (bool)
*/ 