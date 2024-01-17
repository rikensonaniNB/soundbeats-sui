
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
     * 
     * 
     * @param authId 
     * @param authType 
     */
    exists(authId: string, authType: string) : Promise<boolean>; 

    /**
     * 
     * 
     * @param authId 
     * @param authType 
     */
    getRecord(authId: string, authType: string): Promise<IAuthRecord>;
}