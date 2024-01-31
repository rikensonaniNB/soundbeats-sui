import {
    RawSigner, // use keypair
} from '@mysten/sui.js'
import { Ed25519Keypair, Ed25519PublicKey } from '@mysten/sui.js/keypairs/ed25519'

export const strToByteArray = (str: string): number[] => {
    const utf8Encode = new TextEncoder()
    return Array.from(utf8Encode.encode(str).values())
}


async function verifySignature(walletPubKey: string, signature: string, message: string): Promise < { verified: boolean, failureReason: string, address: string; network: string } > {
    const output = {
        verified: false,
        address: "",
        failureReason: "",
        network: "testnet"
    };

    try {
        console.log(walletPubKey);
        console.log(signature);

        console.log(walletPubKey);
        console.log(signature);

        const publicKey = new Ed25519PublicKey(walletPubKey)
        const msgBytes = new TextEncoder().encode(message);

        output.address = publicKey.toSuiAddress();
        output.verified = await publicKey.verifyPersonalMessage(msgBytes, signature);

        if(!output.verified) {
            output.failureReason = "unknown";
        }
    }
    catch (e) {
        output.failureReason = `${e}`;
    }

    return output;
}

verifySignature(
    "LWX2kcO9DlXMfM/EpAQHMeTVI9DHevhiV1OtdVGZ9Zg=", 
    "AJk2O6it2CgcnYd2yEHolfY7oscyg6KpJoJjYyiu5gENqekKF6eWqzQUj%2B0%2FL2Kk1Guu1bWZSLvpxVHTxgw%2BMAgtZfaRw70OVcx8z8SkBAcx5NUj0Md6%2BGJXU611UZn1mA%3D%3D", 
    "O5SIisSBB4UrLo7uLuflXtZHgJQma78t"
); 

/*

{"address":"LWX2kcO9DlXMfM/EpAQHMeTVI9DHevhiV1OtdVGZ9Zg=","signature":"AJk2O6it2CgcnYd2yEHolfY7oscyg6KpJoJjYyiu5gENqekKF6eWqzQUj
%2B0%2FL2Kk1Guu1bWZSLvpxVHTxgw%2BMAgtZfaRw70OVcx8z8SkBAcx5NUj0Md6%2BGJXU611UZn1mA%3D%3D","message":"8e4TsCB1FVy7S7w9XmXGDOQDC22bFhaE"}
[ERROR][08:35:42 GMT+0000] Error: Signature does not match public key 


{"address":"QMpJI1qDZlZgZKirBSqT9iV1z1GCsigm4R7ChIpVdvA=","signature":"AEscX9eSrk5jMbplaHFZXrhT%2BdufsI4RR5uKe%2F3Bggz5pVH6zJRxOG31LPCeESsZ48wQmuVk
TpfQu4cB6TWKTwtAykkjWoNmVmBkqKsFKpP2JXXPUYKyKCbhHsKEilV28A%3D%3D","message":"O5SIisSBB4UrLo7uLuflXtZHgJQma78t"}

*/