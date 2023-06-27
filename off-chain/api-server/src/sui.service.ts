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

//TODO: add comment headers to methods 

export const strToByteArray = (str: string): number[] => {
    const utf8Encode = new TextEncoder()
    return Array.from(utf8Encode.encode(str).values())
}

//TODO: better exception handling in each method 

@Injectable()
export class SuiService {
    signer: RawSigner
    provider: JsonRpcProvider
    client: NftClient
    keypair: Keypair
    packageId: string
    treasuryCap: string
    balanceMap: Map<string, number> //TODO: not using balanceMap for anything meaningful?
    leaderboardMap: Map<string, number>

    constructor() {
        this.balanceMap = new Map(); 
        this.leaderboardMap = new Map();

        //derive keypair
        this.keypair = Ed25519Keypair.deriveKeypair(process.env.MNEMONIC_PHRASE);

        //create connect to the correct environment
        this.provider = this._createRpcProvider(process.env.SUI_ENVIRONMENT)

        //signer & client 
        this.signer = new RawSigner(this.keypair, this.provider);
        this.client = new NftClient(this.provider as any);

        //TODO: these can be auto-detected with _detectTokenInfo
        this.packageId = process.env.PACKAGE_ID;
        this.treasuryCap = process.env.TREASURY_CAP;

        const suiAddress = this.keypair.getPublicKey().toSuiAddress();
        console.log('admin address:', suiAddress);

        this._detectTokenInfo(suiAddress).then((response) => {
            if (response && response.packageId && response.treasuryCap) {
                this.packageId = response.packageId;
                this.treasuryCap = response.treasuryCap;
            }
        });
    }

    async mintNfts(
        recipient: string,
        name: string,
        description: string,
        imageUrl: string,
        quantity: number,
    ): Promise<{ signature: string; addresses: string[] }> {

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

        return { signature, addresses }
    }

    async mintTokens(recipient: string, amount: number): Promise<{ signature: string }> {
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
        return { signature };
    }

    async getTokenBalance(address: string): Promise<{ balance: number }> {

        //await this.mintTokens("0x94e666c0de3a5e3e2e730d40030d9ae5c5843c468ee23e49f4717a5cb8e57bfb", 100);
        console.log(address);
        const tokenType = `${this.packageId}::beats::BEATS`;
        const result = await this.provider.getBalance({
            owner: address,
            coinType: tokenType
        });
        return { balance: parseInt(result.totalBalance) };
    }

    async verifySignature(address: string, signature: string, message: string): Promise<{ verified: boolean, failureReason: string, address: string }> {
        const output = {
            verified: false,
            address: address,
            failureReason: ""
        };

        try {
            const sig = fromSerializedSignature(signature);

            //signature pubkey should match address given
            if (sig.pubKey.toSuiAddress() == address) {
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

    async getUserNFTs(address: string): Promise<{ nfts: { name: string, url: string }[] }> {
        const output: { nfts: { name: string, url: string }[] } = { nfts: [] };

        //get objects owned by user
        const response = await this.provider.getOwnedObjects({
            owner: address,
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

    getLeaderboardScore(address: string): { score: number } {
        const output = { score: 0 };

        if (this.leaderboardMap.has(address))
            output.score = this.leaderboardMap.get(address); 

        return output; 
    }

    addLeaderboardScore(address: string, score: number): { score: number }  {
        const output = { score: 0 };

        if (this.leaderboardMap.has(address))
            output.score = this.leaderboardMap.get(address); 
            output.score += score;
            this.leaderboardMap.set(address, output.score);

        return output; 
    }

    async _detectTokenInfo(address: string): Promise<{ packageId: string, treasuryCap: string } | null> {
        let output = null;

        //get owned objects
        const objects = await this.provider.getOwnedObjects({
            owner: address,
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
        
    _createRpcProvider(environment: String): JsonRpcProvider {
        switch(environment.toUpperCase()) {
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
