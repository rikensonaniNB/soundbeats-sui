export class Config {
    static get aProp(): string { return "no:" }
    static aMethod(): string { return "no:" }
    static get useTls(): boolean {
        return Config.getBooleanSetting(process.env.USE_TLS);
    }
    static get useCors(): boolean {
        return Config.getBooleanSetting(process.env.USE_CORS);
    }
    static get detectPackageInfo(): boolean {
        return Config.getBooleanSetting(process.env.DETECT_PACKAGE_INFO);
    }
    static get mnemonicPhrase(): string {
        return process.env.MNEMONIC_PHRASE;
    }
    static get packageId(): string {
        return process.env.PACKAGE_ID;
    }
    static get treasuryCap(): string {
        return process.env.TREASURY_CAP;
    }
    static get nftOwnerCap(): string {
        return process.env.NFT_OWNER_CAP;
    }
    static get coinCap(): string {
        return process.env.COIN_CAP;
    }
    static get sprintsTableName(): string {
        return process.env.DBTABLE_NAME_SPRINTS;
    }
    static get scoresTableName(): string {
        return process.env.DBTABLE_NAME_SCORES;
    }
    static get authTableName(): string {
        return process.env.DBTABLE_NAME_AUTH || "auth-dev";
    }
    static get allowedCorsOrigin(): string {
        return `${process.env.GAME_SERVER_DOMAIN}`;
    }
    static get listenPort(): number {
        return Config.useTls ? Config.httpsPort : Config.httpPort;
    }
    
    static getBooleanSetting(value: string) : boolean {
        if (value) {
            value = value.trim().toLowerCase();
            return (value == "true" || value == "1" || value == "t" || value == "y" || value == "yes");
        }
        
        return false;
    }

    static get suiNetwork(): string {
        return process.env.SUI_NETWORK;
    }
    static get certFilePath(): string {
        return process.env.CERT_FILE_PATH;
    }
    static get keyFilePath(): string {
        return process.env.KEY_FILE_PATH;
    }
    static get httpPort(): number {
        return parseInt(process.env.HTTP_PORT);
    }
    static get httpsPort(): number {
        return parseInt(process.env.HTTPS_PORT);
    }
}