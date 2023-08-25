import {
    RawSigner, // use keypair
} from '@mysten/sui.js'
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client'
import { Ed25519Keypair, Ed25519PublicKey } from '@mysten/sui.js/keypairs/ed25519'
import { TransactionBlock } from '@mysten/sui.js/transactions'
import { Keypair } from '@mysten/sui.js/cryptography'
import { Injectable } from '@nestjs/common'
import { ILeaderboard, getLeaderboardInstance } from './leaderboard'
import { Config } from './config'
import { AppLogger } from './app.logger';

const LEADERBOARD_DEFAULT_LIMIT: number = 100;

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
    network: string
    logger: AppLogger

    constructor() {
        //derive keypair
        this.keypair = Ed25519Keypair.deriveKeypair(Config.mnemonicPhrase);

        this.logger = new AppLogger('sui.service');

        //create connect to the correct environment
        this.network = Config.suiNetwork;
        this.provider = this._createRpcProvider(this.network);
        this.signer = new RawSigner(this.keypair, this.provider);

        //leaderboard
        this.leaderboard = getLeaderboardInstance(this.network);

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
            const publicKey = new Ed25519PublicKey(walletPubKey)
            const msgBytes = new TextEncoder().encode(message);

            output.address = publicKey.toSuiAddress();
            output.verified = await publicKey.verifyPersonalMessage(msgBytes, signature);

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
            response = await this.provider.getOwnedObjects({
                owner: wallet,
                options: {
                    showType: true,
                    showContent: true,
                },
                limit: 50,
                cursor: response.nextCursor
            });

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

        return output;
    }

    /**
     * Returns the leaderboard score of the given wallet (default 0). 
     * 
     * @param wallet 
     * @returns LeaderboardDto
     */
    getLeaderboardScore(wallet: string): { wallet: string, score: number; network: string } {
        return this.leaderboard.getLeaderboardScore(wallet);
    }

    /**
     * Returns all leaderboard scores, or the leaderboard score of the given wallet only, 
     * if the wallet parameter is provided (i.e., if 'wallet' is null or undefined, returns ALL scores)
     * 
     * @param wallet 
     * @param limit 0 means 'unlimited'
     * @returns GetLeaderboardResponseDto
     */
    getLeaderboardScores(wallet: string = null, limit: number = 0): { scores: { wallet: string; score: number }[]; network: string } {
        return this.leaderboard.getLeaderboardScores(wallet, limit);
    }

    /**
     * Adds a new leaderboard score for the given wallet address. 
     * 
     * @param wallet 
     * @param score 
     * @returns LeaderboardDto
     */
    addLeaderboardScore(wallet: string, score: number): { score: number; network: string } {
        return this.leaderboard.addLeaderboardScore(wallet, score);
    }

    /**
     * From objects owned by the admin wallet, extracts the package id and object id of the 
     * BEATS token and NFT library. 
     * 
     * NOTE: 20 nights in the ice is a long time, when there's hostiles on the hill
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
}
