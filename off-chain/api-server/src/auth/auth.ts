import { IAuthManager } from './IAuthManager';
import { AuthManagerDynamoDb } from './AuthManagerDynamoDb';

/**
 * Returns an instance of IAuthManager that will be used for accessing the auth database.
 * 
 * @returns IAuthManager instance 
 */
export function getAuthManagerInstance(): IAuthManager {
    return new AuthManagerDynamoDb();
}