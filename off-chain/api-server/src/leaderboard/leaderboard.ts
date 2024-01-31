import * as fs from 'fs';
import { ILeaderboard } from './ILeaderboard';
import { LeaderboardMemory } from './LeaderboardMemory';
import { LeaderboardJsonFile } from './LeaderboardJsonFile';
import { LeaderboardDynamoDb } from './LeaderboardDynamoDb'; 

/**
 * Returns an instance of ILeaderboard that will be used for accessing the leaderboard database.
 * 
 * @returns ILeaderboard instance 
 */
export function getLeaderboardInstance(network: string): ILeaderboard {
    return new LeaderboardDynamoDb(network);
}