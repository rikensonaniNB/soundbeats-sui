import {
    Ed25519Keypair,
    JsonRpcProvider,
    Keypair,
    RawSigner,
    TransactionBlock,
    devnetConnection,
    verifyMessage,
    IntentScope,
    fromSerializedSignature
} from '@mysten/sui.js'
import { Injectable } from '@nestjs/common'
import { NftClient } from '@originbyte/js-sdk'
import { table } from 'console'
import { sign } from 'crypto'

export const strToByteArray = (str: string): number[] => {
    const utf8Encode = new TextEncoder()
    return Array.from(utf8Encode.encode(str).values())
}

@Injectable()
export class SuiService {
    signer: RawSigner
    provider: JsonRpcProvider
    client: NftClient
    keypair: Keypair
    packageId: string
    treasuryCap: string
    balanceMap: Map<string, number>

    constructor() {
        this.balanceMap = new Map()

        //derive keypair
        this.keypair = Ed25519Keypair.deriveKeypair(process.env.MNEMONIC_PHRASE);

        //TODO: should be not hard-coded to devnet this.provider = new JsonRpcProvider(rpc);
        this.provider = new JsonRpcProvider(devnetConnection);

        //signer & client 
        this.signer = new RawSigner(this.keypair, this.provider);
        this.client = new NftClient(this.provider as any);

        //TODO: these can be auto-detected with _detectTokenInfo
        this.packageId = process.env.PACKAGE_ID;
        this.treasuryCap = process.env.TREASURY_CAP;

        const suiAddress = this.keypair.getPublicKey().toSuiAddress();
        console.log('admin address:', suiAddress);
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
}
