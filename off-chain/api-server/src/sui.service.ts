import {
    Ed25519Keypair,
    JsonRpcProvider,
    Keypair,
    RawSigner,
    TransactionBlock,
    devnetConnection
} from '@mysten/sui.js'
import { Injectable } from '@nestjs/common'
import { NftClient } from '@originbyte/js-sdk'

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
        this.balanceMap.set(recipient, prevBalance + amount)

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

        const tokenType = `${this.packageId}::beats::BEATS`;
        const result = await this.provider.getBalance({
            owner: address,
            coinType: tokenType
        });
        return { balance: parseInt(result.totalBalance) }
    }
}
