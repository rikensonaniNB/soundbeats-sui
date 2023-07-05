import {
    Ed25519Keypair,
    JsonRpcProvider,
    Keypair,
    RawSigner,
    TransactionBlock,
    localnetConnection,
    devnetConnection,
    testnetConnection,
    mainnetConnection,
    verifyMessage,
    IntentScope,
    fromSerializedSignature
} from '@mysten/sui.js'
import { Injectable } from '@nestjs/common'
import { NftClient } from '@originbyte/js-sdk'
import { ILeaderboard, getLeaderboardInstance } from './leaderboard'

export const strToByteArray = (str: string): number[] => {
    const utf8Encode = new TextEncoder()
    return Array.from(utf8Encode.encode(str).values())
}

//TODO: better exception handling in each method 

@Injectable()
export class SuiService {
    signer: RawSigner
    provider: JsonRpcProvider
    client: NftClient //TODO: not used
    keypair: Keypair
    packageId: string
    treasuryCap: string
    balanceMap: Map<string, number> //TODO: not using balanceMap for anything meaningful?
    leaderboard: ILeaderboard
    network: string

    constructor() {
        this.balanceMap = new Map();

        //derive keypair
        this.keypair = Ed25519Keypair.deriveKeypair(process.env.MNEMONIC_PHRASE);

        //create connect to the correct environment
        this.network = process.env.SUI_NETWORK;
        this.provider = this._createRpcProvider(this.network);

        //signer & client 
        this.signer = new RawSigner(this.keypair, this.provider);
        this.client = new NftClient(this.provider as any);

        //leaderboard
        this.leaderboard = getLeaderboardInstance(this.network);

        //TODO: these can be auto-detected with _detectTokenInfo
        this.packageId = process.env.PACKAGE_ID;
        this.treasuryCap = process.env.TREASURY_CAP;

        const suiAddress = this.keypair.getPublicKey().toSuiAddress();
        console.log('admin address:', suiAddress);

        //detect token info from blockchain 
        this._detectTokenInfo(suiAddress).then((response) => {
            if (response && response.packageId && response.treasuryCap) {
                this.packageId = response.packageId;
                this.treasuryCap = response.treasuryCap;
            }
        });
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
            target: `${this.packageId}::beats_nft::mint_to_recipient`,
            arguments: [
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
        const prevBalance = this.balanceMap.get(recipient) ?? 0
        this.balanceMap.set(recipient, prevBalance + amount);

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
     * Verifies that the signature of the given message originated from the given wallet address. 
     * 
     * @param wallet 
     * @param signature 
     * @param message 
     * @returns VerifySignatureResponseDto
     */
    async verifySignature(wallet: string, signature: string, message: string): Promise<{ verified: boolean, failureReason: string, address: string; network: string }> {
        const output = {
            verified: false,
            address: wallet,
            failureReason: "",
            network: this.network
        };

        try {
            const sig = fromSerializedSignature(signature);

            //signature pubkey should match address given
            if (sig.pubKey.toSuiAddress() == wallet) {
                output.verified = await verifyMessage(
                    new TextEncoder().encode(message),
                    signature,
                    IntentScope.PersonalMessage
                );

                if (!output.verified) {
                    output.failureReason = "unknown";
                }
            }
            else {
                output.failureReason = "address mismatch";
            }
        }
        catch (e) {
            console.error(e);
            output.failureReason = `error: ${e}`;
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
        const response = await this.provider.getOwnedObjects({
            owner: wallet,
            options: {
                showType: true,
                showContent: true
            }
        });

        if (response && response.data && response.data.length) {

            //get objects which are BEATS NFTs
            const beatsNfts = response.data.filter(o => {
                return o.data.type.startsWith(this.packageId) &&
                    o.data?.type?.endsWith("::beats_nft::BeatsNft");
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
     * @returns GetLeaderboardResponseDto
     */
    getLeaderboardScores(wallet: string): { scores: { wallet: string; score: number }[]; network: string } {
        //if (wallet && wallet.length)
        //    this.leaderboard.addLeaderboardScore(wallet, 100);
        return this.leaderboard.getLeaderboardScores(wallet);
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
    async _detectTokenInfo(wallet: string): Promise<{ packageId: string, treasuryCap: string } | null> {
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
                return o.data.type.startsWith("0x2::coin::TreasuryCap<") &&
                    o.data?.type?.endsWith("::beats::BEATS>")
            });

            if (tCaps && tCaps.length) {
                const beatsObj = tCaps[tCaps.length - 1];

                //parse out the type to get the package id
                let packageId = "";
                let parts = beatsObj.data.type.split('::');
                let tCap = parts.filter(p => p.startsWith("TreasuryCap<"));
                if (tCap.length) {
                    packageId = tCap[0].substring("TreasuryCap<".length);
                }

                //get package ID & treasury cap
                if (packageId.length) {
                    output = {
                        packageId: packageId,
                        treasuryCap: beatsObj.data?.objectId
                    };
                }
            }
        }

        return output;
    }

    /**
     * Creates a Json RPC provider for the given environment (default devnet)
     * 
     * NOTE: it's not about what you wear; it's all about where you are
     * 
     * @param environment 
     * @returns JsonRpcProvider
     */
    _createRpcProvider(environment: String): JsonRpcProvider {
        if (!environment)
            environment = "DEVNET";

        switch (environment.toUpperCase()) {
            case "LOCALNET":
                return new JsonRpcProvider(localnetConnection);
            case "DEVNET":
                return new JsonRpcProvider(devnetConnection);
            case "TESTNET":
                return new JsonRpcProvider(testnetConnection);
            case "MAINNET":
                return new JsonRpcProvider(mainnetConnection);
        }

        return new JsonRpcProvider(devnetConnection);
    }
}
