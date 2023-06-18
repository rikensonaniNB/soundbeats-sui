import { ApiProperty } from '@nestjs/swagger'

export class MintNftDto {
    @ApiProperty({ description: 'Name of the NFT' })
    name: string
    @ApiProperty({ description: 'The address of the recipient' })
    recipient: string
    @ApiProperty({ description: 'URL of the NFT image' })
    imageUrl: string
    @ApiProperty({ description: 'Number of NFT to be minted' })
    quantity?: number = 1
}

export class MintTokenDto {
    @ApiProperty({ description: 'The amount of the token' })
    amount: number
    @ApiProperty({ description: 'The address of the recipient' })
    recipient: string
}

export class GetTokenBalanceDto {
    @ApiProperty({ description: 'The address of the wallet' })
    wallet: string
}

export class MintNftResponseDto {
    @ApiProperty({ description: 'The signature of the transaction' })
    signature: string
    @ApiProperty({ description: 'The list of NFT addresses minted' })
    addresses: string[]
}

export class RequestNFTResponseDto {
    @ApiProperty({ description: 'The signature of the transaction' })
    signature: string
}

export class MintTokenResponseDto {
    @ApiProperty({ description: 'The signature of the transaction' })
    signature: string
}

export class GetTokenBalanceResponseDto {
    @ApiProperty({ description: 'The balance of the wallet' })
    balance: number
}

export class VerifySignatureDto {
    @ApiProperty({ description: 'The address of the wallet that signed the transaction' })
    address: string
    @ApiProperty({ description: 'The expected signature' })
    signature: string
    @ApiProperty({ description: 'The original message that was signed' })
    message: string
}

export class VerifySignatureResponseDto {
    @ApiProperty({ description: 'Whether or not the signature was verified' })
    verified: boolean
    @ApiProperty({ description: 'General reason for failure to verify (if not verified)' })
    failureReason: string
}
