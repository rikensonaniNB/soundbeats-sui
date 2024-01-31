import { ApiProperty } from '@nestjs/swagger'

class ResponseDtoBase {
    @ApiProperty({ description: 'The current network (e.g. devnet)' })
    network: string
}

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

export class GetBeatsNftsDto {
    @ApiProperty({ description: 'The address of the wallet' })
    wallet: string
}

export class MintNftResponseDto extends ResponseDtoBase {
    @ApiProperty({ description: 'The signature of the transaction' })
    signature: string
    @ApiProperty({ description: 'The list of NFT addresses minted' })
    addresses: string[]
}

export class RequestNFTResponseDto extends ResponseDtoBase {
    @ApiProperty({ description: 'The signature of the transaction' })
    signature: string
}

export class MintTokenResponseDto extends ResponseDtoBase {
    @ApiProperty({ description: 'The signature of the transaction' })
    signature: string
}

export class GetTokenBalanceResponseDto extends ResponseDtoBase {
    @ApiProperty({ description: 'The balance of the wallet' })
    balance: number
}

export class BeatsNftDto {
    name: string
    url: string
}

export class GetBeatsNftsResponseDto extends ResponseDtoBase {
    @ApiProperty({ description: 'The unique names of NFTs owned' })
    nfts: BeatsNftDto[]
}

export class VerifySignatureDto {
    @ApiProperty({ description: 'The address of the wallet that signed the transaction' })
    address: string
    @ApiProperty({ description: 'The expected signature' })
    signature: string
    @ApiProperty({ description: 'The original message that was signed' })
    message: string
}

export class VerifySignatureResponseDto extends ResponseDtoBase {
    @ApiProperty({ description: 'Whether or not the signature was verified' })
    verified: boolean
    @ApiProperty({ description: 'The address of the wallet that signed the transaction' })
    address: string
    @ApiProperty({ description: 'General reason for failure to verify (if not verified)' })
    failureReason: string   
}

export class GetLeaderboardDto {
    @ApiProperty({ description: 'The address of the wallet of the user' })
    wallet: string
    @ApiProperty({ description: 'The max number of records to include in the response' })
    limit: number
    @ApiProperty({ description: 'Optional unique id of sprint' })
    sprint: string
}

export class LeaderboardDto {
    @ApiProperty({ description: 'The address of the wallet of the user' })
    wallet: string
    @ApiProperty({ description: 'The total score of the users' })
    score: number
    @ApiProperty({ description: 'Optional unique id of sprint' })
    sprint: string
}

export class GetLeaderboardResponseDto extends ResponseDtoBase {
    @ApiProperty({ description: 'The total score of each user' })
    scores: LeaderboardDto[]
}

export class AddLeaderboardDto {
    @ApiProperty({ description: 'The address of the wallet of the user' })
    wallet: string
    @ApiProperty({ description: 'The score to add' })
    score: number
}

export class AddLeaderboardResponseDto extends ResponseDtoBase {
    @ApiProperty({ description: 'The total score of the user' })
    score: number
}

export class GetLeaderboardSprintDto {
    @ApiProperty({ description: 'Optional unique id of sprint' })
    sprint: string
    @ApiProperty({ description: 'Optional max number of records to return' })
    limit: number
}

export class GetLeaderboardSprintResponseDto {
    @ApiProperty({ description: 'Unique id of sprint' })
    sprintId: string
    @ApiProperty({ description: 'Whether or not sprint is currently active' })
    active: boolean
    @ApiProperty({ description: 'Sprint start date' })
    startDate: number
    @ApiProperty({ description: 'Sprint end date' })
    endDate: number
}

//TODO: make type-agnostic (i.e. not EVM-specific)
export class RegisterAccountDto {
    @ApiProperty({ description: 'Auth ID, e.g. EVM wallet address or username' })
    authId: string
    @ApiProperty({ description: 'Auth type, e.g. "evm"' })
    authType: string
}

//TODO: make type-agnostic (i.e. not EVM-specific)
export class RegisterAccountResponseDto {
    @ApiProperty({ description: 'Auth ID, e.g. EVM wallet address or username' })
    authId: string
    @ApiProperty({ description: 'Auth type, e.g. "evm"' })
    authType: string
    @ApiProperty({ description: 'SUI wallet address' })
    suiWallet: string
    @ApiProperty({ description: 'Success or failure of the operation' })
    status: string
}

export class GetAccountDto {
    @ApiProperty({ description: 'Auth ID, e.g. EVM wallet address or username' })
    authId: string
    @ApiProperty({ description: 'Auth type, e.g. "evm"' })
    authType: string
}

export class GetAccountResponseDto {
    @ApiProperty({ description: 'SUI wallet address' })
    suiWallet: string
    @ApiProperty({ description: 'Success or failure of the operation' })
    status: string
}

export class PutAccountDto {
    @ApiProperty({ description: 'Auth ID, e.g. EVM wallet address or username' })
    authId: string
    @ApiProperty({ description: 'Auth type, e.g. "evm"' })
    authType: string
    @ApiProperty({ description: 'SUI wallet address' })
    suiWallet: string
    @ApiProperty({ description: 'Success or failure of the operation' })
    status: string
}

export class PutAccountResponseDto {
    @ApiProperty({ description: 'Success or failure of the operation' })
    status: string
}