import {
    RawSigner, // use keypair
} from '@mysten/sui.js'
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client'
import { Ed25519Keypair, Ed25519PublicKey } from '@mysten/sui.js/keypairs/ed25519'
import { TransactionBlock } from '@mysten/sui.js/transactions'
import { Keypair, Signer } from '@mysten/sui.js/cryptography'
import { Injectable } from '@nestjs/common'
import { ILeaderboard, ISprint } from './leaderboard/ILeaderboard'
import { getLeaderboardInstance } from './leaderboard/leaderboard'
import { IAuthManager, IAuthRecord, IAuthSession } from './auth/IAuthManager'
import { getAuthManagerInstance } from './auth/auth'
import { Config } from './config'
import { AppLogger } from './app.logger';

export const strToByteArray = (str: string): number[] => {
    const utf8Encode = new TextEncoder()
    return Array.from(utf8Encode.encode(str).values())
}

@Injectable()
export class SuiService {
    signer: RawSigner
    provider: SuiClient
    keypair: Keypair
    packageId: string
    treasuryCap: string
    nftOwnerCap: string
    coinCap: string
    leaderboard: ILeaderboard
    authManager: IAuthManager
    network: string
    logger: AppLogger

    constructor() {
        //derive keypair
        this.keypair = Ed25519Keypair.deriveKeypair(process.env.MNEMONIC_PHRASE);

        this.logger = new AppLogger('sui.service');

        //create connect to the correct environment
        this.network = Config.suiNetwork;
        this.provider = this._createRpcProvider(this.network);
        this.signer = new RawSigner(this.keypair, this.provider);

        //leaderboard
        this.leaderboard = getLeaderboardInstance(this.network);
        this.authManager = getAuthManagerInstance();

        //get initial addresses from config setting 
        this.packageId = Config.packageId;
        this.treasuryCap = Config.treasuryCap;
        this.nftOwnerCap = Config.nftOwnerCap;
        this.coinCap = Config.coinCap;

        this.logger.log('packageId: ' + this.packageId);
        this.logger.log('treasuryCap: ' + this.treasuryCap);
        this.logger.log('nftOwnerCap: ' + this.nftOwnerCap);
        this.logger.log('coinCap: ' + this.coinCap);

        //get admin address 
        const suiAddress = this.keypair.getPublicKey().toSuiAddress();
        this.logger.log('admin address: ' + suiAddress);

        //detect token info from blockchain 
        if (Config.detectPackageInfo) {
            this.logger.log('detecting package data ...');
            this._detectTokenInfo(suiAddress, this.packageId).then(async (response) => {
                this.logger.log('parsing package data ...');
                if (response && response.packageId && response.treasuryCap) {
                    this.packageId = response.packageId;
                    this.treasuryCap = response.treasuryCap;
                    this.nftOwnerCap = response.nftOwnerCap;
                    this.coinCap = response.coinCap

                    this.logger.log('detected packageId: ' + this.packageId);
                    this.logger.log('detected treasuryCap: ' + this.treasuryCap);
                    this.logger.log('detected nftOwnerCap: ' + this.nftOwnerCap);
                    this.logger.log('detected coinCap: ' + this.coinCap);
                }
            });
        }
        
        this.test();
    }
    
    async test(): Promise<void> {
        console.log(await this.startAuthSession("0x112244556677889900112244556677889900"));
    }

    createWallet(): { address: string, privateKey: string } {
        const keypair = new Ed25519Keypair();
        const exported = keypair.export();

        return {
            address: keypair.toSuiAddress(),
            privateKey: exported.privateKey
        }
    }

    /**
     * Mints NFTs with the given properties in the given quantity to the specified 
     * recipient wallet address. 
     * 
     * @param recipient 
     * @param name 
     * @param description 
     * @param imageUrl 
     * @param quantity 
     * @returns MintNftResponseDto
     */
    async mintNfts(
        recipient: string,
        name: string,
        description: string,
        imageUrl: string,
        quantity: number,
    ): Promise<{ signature: string; addresses: string[]; network: string }> {

        //mint nft to recipient 
        const tx = new TransactionBlock();
        tx.moveCall({
            target: `${this.packageId}::beats_nft::mint`,
            arguments: [
                tx.pure(this.nftOwnerCap),
                tx.pure(name),
                tx.pure(description),
                tx.pure(imageUrl),
                tx.pure(recipient),
                tx.pure(quantity)
            ],
        });

        //execute tx 
        const result = await this.signer.signAndExecuteTransactionBlock({
            transactionBlock: tx,
            options: {
                showEffects: true,
                showEvents: true,
                showBalanceChanges: true,
                showObjectChanges: true,
                showInput: true
            }
        });

        //check results 
        if (result.effects == null) {
            throw new Error('Fail')
        }

        const signature = result.effects.transactionDigest
        const addresses = result.effects.created?.map((obj) => obj.reference.objectId) ?? []

        return { signature, addresses, network: this.network }
    }

    /**
     * Mints tokens in the given quantity to the specified recipient. 
     * 
     * @param recipient 
     * @param amount 
     * @returns 
     */
    async mintTokens(recipient: string, amount: number): Promise<{ signature: string; network: string }> {

        //mint token to recipient
        const tx = new TransactionBlock();
        tx.moveCall({
            target: `${this.packageId}::beats::mint`,
            arguments: [
                tx.pure(this.treasuryCap),
                tx.pure(amount),
                tx.pure(recipient)
            ],
        });

        //execute tx 
        const result = await this.signer.signAndExecuteTransactionBlock({
            transactionBlock: tx,
            options: {
                showEffects: true,
                showEvents: true,
                showBalanceChanges: true,
                showObjectChanges: true
            }
        });

        //check results 
        if (result.effects == null) {
            throw new Error('Move call Failed');
        }

        const signature = result.effects?.transactionDigest;
        return { signature, network: this.network };
    }

    /**
     * Retrieves the balance of BEATS token from the blockchain, for the given wallet address. 
     * 
     * @param wallet 
     * @returns GetTokenBalanceResponseDto
     */
    async getTokenBalance(wallet: string): Promise<{ balance: number; network: string }> {

        const tokenType = `${this.packageId}::beats::BEATS`;
        const result = await this.provider.getBalance({
            owner: wallet,
            coinType: tokenType
        });
        return {
            balance: parseInt(result.totalBalance), network: this.network
        };
    }

    /**
     * Verifies that the signature of the given message originated from the given wallet. 
     * 
     * @param walletPubKey The wallet public key as a base64 string
     * @param signature The signed message as a base64 string
     * @param message The original message, as a plain string 
     * @returns VerifySignatureResponseDto
     */
    async verifySignature(walletPubKey: string, signature: string, message: string): Promise<{ verified: boolean, failureReason: string, address: string; network: string }> {
        const output = {
            verified: false,
            address: "",
            failureReason: "",
            network: this.network
        };

        try {
            const { address, verified } = await this._verifySuiSignature(walletPubKey, signature, message);
            output.address = address;
            output.verified = verified; 
            
            if (!output.verified) {
                output.failureReason = "unknown";
            }
        }
        catch (e) {
            this.logger.error(e);
            output.failureReason = `${e}`;
        }

        return output;
    }
    
    //TODO: comment 
    async verifySignature2(
        sessionId: string,
        walletType: 'evm' | 'sui', 
        walletPubKey: string,
        action: 'update' | 'verify', 
        signature: string, 
        message: string): Promise<{ 
            success: boolean, failureReason: string, wallet: string; network: string, verified: boolean
        }> {
        
        const output = {
            success: false,
            failureReason: '', 
            wallet: '', 
            network: '', 
            verified: false
        }; 
        
        //first verify session id, if any
        if (sessionId && sessionId.length) {
            if (!(await this._verifySessionId(sessionId))) {
                output.failureReason = 'sessionIdInvalid'; 
                return output;
            }
        }
        
        //SUI verification 
        if (walletType == 'sui') {
            const { verified, address } = await this._verifySuiSignature(walletPubKey, signature, message);
            output.success = verified;
            output.wallet = address;
            output.verified = verified;
            
            if (!verified) {
                output.failureReason = 'unknown'; 
            }
        }

        //EVM verification 
        if (walletType == 'evm') {
            const { verified, address } = await this._verifyEvmSignature(walletPubKey, signature, message);
            output.success = verified;
            output.wallet = address;

            if (!verified) {
                output.failureReason = 'unknown';
            }
        }
        
        //update the auth session record 
        let evmWallet: string = walletType == 'evm' ? output.wallet : null;
        let suiWallet: string = walletType == 'sui' ? output.wallet : null; 
        this.authManager.updateAuthSession(sessionId, evmWallet, suiWallet, true);

        //TODO: update the auth record if the action is 'update'
        if (action == 'update') {
            this.authManager.updateAuthRecord(evmWallet, "evm", suiWallet); 
        }
        
        return output;
    }

    /**
     * Examines all instances of BEATS NFTs owned by the given wallet address, and returns a list 
     * of the unique NFT types owned by the address.  
     * 
     * @param wallet 
     * @returns GetBeatsNftsResponseDto
     */
    async getUserNFTs(wallet: string): Promise<{ nfts: { name: string, url: string }[]; network: string }> {
        const output: { nfts: { name: string, url: string }[]; network: string } = { nfts: [], network: this.network };

        //get objects owned by user
        let response: any = {
            hasNextPage: true,
            data: [],
            nextCursor: null
        };

        while (response.hasNextPage) {
            //get objects owned by user
            console.log('retrieving...');
            response = await this.provider.getOwnedObjects({
                owner: wallet,
                options: {
                    showType: true,
                    showContent: true,
                },
                limit: 50,
                cursor: response.nextCursor
            });

            console.log(response);

            if (response && response.data && response.data.length) {

                //get objects which are BEATS NFTs
                const beatsNfts = response.data.filter(o => {
                    return o.data.type.startsWith(this.packageId) &&
                        o.data?.type?.endsWith("::beats_nft::BEATS_NFT>");
                });

                //get list of unique names for all BEATS NFTs owned
                for (let i = 0; i < beatsNfts.length; i++) {
                    const nft = beatsNfts[i];
                    if (nft.data.content['fields'] &&
                        nft.data.content['fields']['name'] &&
                        nft.data.content['fields']['url']
                    ) {
                        const nftName = nft.data.content['fields']['name'];
                        const nftUrl = nft.data.content['fields']['url'];

                        //only add if name is unique
                        if (!output.nfts.some(nft => nft.name == nftName)) {
                            output.nfts.push({ name: nftName, url: nftUrl });
                        }
                    }
                }
            }
        }

        console.log('returning output: ', output);
        return output;
    }

    /**
     * Returns the leaderboard score of the given wallet (default 0). 
     * 
     * @param wallet the wallet address to query score
     * @param sprint unique sprint id, or "current", "", or "default"
     * @returns LeaderboardDto
     */
    async getLeaderboardScore(wallet: string, sprint: string | null | "current" | "" = null): Promise<{ wallet: string, score: number; network: string }> {
        return await this.leaderboard.getLeaderboardScore(wallet, sprint);
    }

    /**
     * Returns all leaderboard scores, or the leaderboard score of the given wallet only, 
     * if the wallet parameter is provided (i.e., if 'wallet' is null or undefined, returns ALL scores)
     * 
     * @param limit 0 means 'unlimited'
     * @param sprint unique sprint id, or "current", "", or "default"
     * @returns GetLeaderboardResponseDto
     */
    async getLeaderboardScores(limit: number = 0, sprint: string | null | "current" | "" = null): Promise<{ scores: { wallet: string; score: number }[]; network: string }> {
        return await this.leaderboard.getLeaderboardScores(limit, sprint);
    }

    /**
     * Adds a new leaderboard score for the given wallet address. 
     * 
     * @param wallet the wallet address to add score
     * @param score the score to add for the given wallet
     * @param sprint unique sprint id, or "current", "", or "default"
     * @returns LeaderboardDto
     */
    async addLeaderboardScore(wallet: string, score: number, sprint: string | null | "current" | "" = null): Promise<{ score: number; network: string }> {
        return await this.leaderboard.addLeaderboardScore(wallet, score, sprint);
    }
    
    /**
     * Gets the specified leaderboard sprint configuration, if it exists. 
     * 
     * @param sprintId 
     * @returns The given sprint configuration, if found; otherwise null. 
     */
    async getLeaderboardSprint(sprintId: string): Promise<ISprint> {
        return await this.leaderboard.getSprint(sprintId);
    }

    /**
     * Gets all leaderboard sprints. 
     * 
     * @param limit Max number of records to return; <=0 for unlimited.
     * @returns An array of leaderboard sprints that exist.
     */
    async getLeaderboardSprints(limit: number = 0): Promise<ISprint[]> {
        return await this.leaderboard.getSprints(limit);
    }
    
    //TODO: comment header
    //TODO: http status codes would be good 
    /**
     * 
     * @param evmWallet 
     * @returns 
     */
    //TODO: make more genereic
    async registerAccountEvm(evmWallet: string): Promise<{ authId: string, authType: string, suiWallet: string, status: string } > {
        const output = {
            authId: evmWallet,
            authType: "evm",
            suiWallet: "",
            status: ""
        }; 
        
        //make sure first that the login doesn't already exist
        const authRecord = await this.authManager.getAuthRecord(evmWallet, "evm"); 
        if (authRecord != null) {
            output.status = "duplicate"; 
            output.suiWallet = authRecord.authId; 
        }
        else {
            //create a new wallet 
            const suiWallet = this.createWallet();
            output.suiWallet = suiWallet.address;

            //store the info in the database
            const success = await this.authManager.register(evmWallet, "evm", suiWallet.address, {
                privateKey: suiWallet.privateKey
            });

            if (success) {
                output.status = "success";
            }
        }
        
        return output; 
    }

    /**
     * Tries to retrieve an existing SUI wallet address given the login information. 
     * 
     * @param authId 
     * @param authType 
     * @returns The status of the search and SUI wallet address (if found)
     */
    async getAccountFromLogin(authId: string, authType: 'evm' | 'sui'): Promise<{suiWallet: string, status: string }> {
        const output = { suiWallet: "", status: "" }
        const authRecord = await this.authManager.getAuthRecord(authId, authType); 
        if (authRecord == null) {
            output.status = "notfound"; 
        }
        else {
            output.suiWallet = authRecord.authId;
            output.status = "success"; 
        }
        
        return output; 
    }

    //TODO: comment header
    /**
     * 
     * @param authId 
     * @param authType 
     * @param newSuiWallet 
     * @returns 
     */
    async changeSuiWalletAddress(authId: string, authType: 'evm' | 'sui', newSuiWallet: string) : Promise<{status: string}> {
        const output = { status: "" }
        
        //get existing auth record
        const authRecord = await this.authManager.getAuthRecord(authId, authType);
        if (authRecord == null) {
            output.status = "notfound";
        }
        else {
            newSuiWallet = newSuiWallet.trim();
            
            //check that the new wallet doesn't match the old 
            if (newSuiWallet != authRecord.authId.trim()) {
                output.status = "duplicate";
            }
            else {
                //move assets from old wallet to new one 
                if (authRecord.extraData && authRecord.extraData.privateKey) {
                    await this._moveAssets(authRecord, newSuiWallet);
                }
                
                //update the database 
                this.authManager.setSuiWalletAddress(authRecord.authId, authRecord.authType, newSuiWallet);
                
                output.status = "success";
            }
        }

        return output; 
    }

    //TODO: comment header
    async startAuthSession(evmWallet: string): Promise<{messageToSign: string, sessionId: string }> {
        return await this.authManager.startAuthSession(evmWallet); 
    }
    
    //TODO: comment header 
    /**
     * 
     * @param source 
     * @param dest 
     */
    async _moveAssets(source: IAuthRecord, dest: string) {
        const privateKey = source.extraData.privateKey;
        const walletAddr = source.authId;
        const keypair: Ed25519Keypair = Ed25519Keypair.fromSecretKey(privateKey);
        
        //TODO: check that the address of the keypair matches the stored address
        
        const tokenType = `${this.packageId}::beats::BEATS`;
        const tokenBalance = await this.getTokenBalance(walletAddr);
        const nftBalances = await this.getUserNFTs(walletAddr);
        
        //mint equal number of token to new address
        await this.mintTokens(dest, tokenBalance.balance);
        
        //for each NFT owned
        nftBalances.nfts.forEach(async nft => {
            await this.mintNfts(dest, nft.name, "Soundbeats NFT", nft.url, 1);
        });
    }

    /**
     * From objects owned by the admin wallet, extracts the package id and object id of the 
     * BEATS token and NFT library. 
     * 
     * @param wallet 
     * @returns A package id and treasury cap id
     */
    async _detectTokenInfo(wallet: string, packageId: string = null)
        : Promise<{ packageId: string, treasuryCap: string, nftOwnerCap: string, coinCap: string } | null> {
        let output = null;

        //get owned objects
        const objects = await this.provider.getOwnedObjects({
            owner: wallet,
            options: {
                showType: true,
                showContent: true,
                showOwner: true
            }
        });

        for (let i in objects.data) {
            const obj = objects.data[i]
            console.log(obj)
        }
        console.log(objects.data.length);

        //parse the objects
        if (objects && objects.data && objects.data.length) {
            const tCaps = objects.data.filter(o => {
                return o.data.type.startsWith(`0x2::coin::TreasuryCap<${packageId ? packageId : ""}`) &&
                    o.data?.type?.endsWith("::beats::BEATS>")
            });

            if (tCaps && tCaps.length) {
                const beatsObj = tCaps[0];

                //parse out the type to get the package id
                if (!packageId) {
                    let parts = beatsObj.data.type.split('::');
                    let tCap = parts.filter(p => p.startsWith("TreasuryCap<"));
                    if (tCap.length) {
                        packageId = tCap[tCap.length - 1].substring("TreasuryCap<".length);
                    }
                }

                if (packageId && packageId.length) {

                    //get nft owner object
                    let nftObj = null;
                    const nftOwners = objects.data.filter(o => {
                        return o.data.type == `${packageId}::beats_nft::BeatsOwnerCap<${packageId}::beats_nft::BEATS_NFT>`;
                    });
                    if (nftOwners && nftOwners.length) {
                        nftObj = nftOwners[nftOwners.length - 1];
                    }

                    //get coin cap object 
                    let coinObj = null;
                    const coinCaps = objects.data.filter(o => {
                        return o.data.type == `0x2::coin::CoinMetadata<${packageId}::beats::BEATS>`
                    });
                    if (coinCaps && coinCaps.length) {
                        coinObj = coinCaps[coinCaps.length - 1];
                    }

                    //get package ID & treasury cap
                    if (packageId && packageId.length) {
                        output = {
                            packageId: packageId,
                            treasuryCap: beatsObj.data?.objectId,
                            nftOwnerCap: nftObj?.data?.objectId,
                            coinCap: coinObj?.data?.objectId
                        };
                    }
                }
            }
        }

        return output;
    }

    /**
     * Creates a Json RPC provider for the given environment (default devnet)
     * 
     * NOTE: it's not about what you wear; it's all about where you are
     * @param environment 
     * @returns JsonRpcProvider
     */
    _createRpcProvider(environment: string): SuiClient {
        if (!environment)
            environment = "DEVNET";

        this.logger.log(`creating RPC provider for ${environment}`);

        switch (environment.toUpperCase()) {
            case "LOCALNET":
                return new SuiClient({
                    url: getFullnodeUrl("localnet")
                });
            case "DEVNET":
                return new SuiClient({
                    url: getFullnodeUrl("devnet")
                });
            case "TESTNET":
                return new SuiClient({
                    url: getFullnodeUrl("testnet")
                });
            case "MAINNET":
                return new SuiClient({
                    url: getFullnodeUrl("mainnet")
                });
        }

        return new SuiClient({
            url: getFullnodeUrl("devnet")
        });
    }

    async _verifySuiSignature(walletPubKey: string, signature: string, message: string): Promise<{ address: string, verified: boolean }> {

        console.log(walletPubKey);
        console.log(signature);

        console.log(walletPubKey);
        console.log(signature);

        const publicKey = new Ed25519PublicKey(walletPubKey)
        const msgBytes = new TextEncoder().encode(message);

        const address = publicKey.toSuiAddress();
        const verified = await publicKey.verifyPersonalMessage(msgBytes, signature);

        return { address, verified };
    }

    async _verifyEvmSignature(walletPubKey: string, signature: string, message: string): Promise<{ address: string, verified: boolean }> {
        return { address: '', verified: true };
    }

    async _verifySessionId(sessionId: string): Promise<boolean> {
        const session: IAuthSession = await this.authManager.getAuthSession(sessionId);
        return (session != null);
    }
}
