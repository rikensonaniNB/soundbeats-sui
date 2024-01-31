
export interface IAuthRecord {
    authId: string;
    authType: string;
    extraData: any;
}

export interface IAuthManager {
    /**
     * Adds a new auth record to the database, if it doesn't already exist.
     * 
     * @param authId 
     * @param authType 
     * @param extraData 
     */
    register(authId: string, authType: string, extraData: any): Promise<boolean>;

    /**
     * Returns true if an auth record with the given id and type are in the database.
     * 
     * @param authId 
     * @param authType 
     */
    exists(authId: string, authType: string) : Promise<boolean>; 

    /**
     * Gets the record identified by the auth id and auth type. 
     * 
     * @param authId 
     * @param authType 
     */
    getRecord(authId: string, authType: string): Promise<IAuthRecord>;

    /**
     * Gets all auth records in the database. 
     */
    getAuthRecords(): Promise<IAuthRecord[]>;
    
    /**
     * Sets the SUI wallet address associated with the identified auth record, identified
     * by auth id and auth type. 
     * 
     * @param authId 
     * @param authType 
     * @param suiAddress 
     */
    setSuiWalletAddress(authId: string, authType: string, suiAddress: string) : Promise<boolean>;
}