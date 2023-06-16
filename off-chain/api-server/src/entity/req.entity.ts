import { ApiProperty } from '@nestjs/swagger'

export class CreateNFTDto {
  @ApiProperty({ description: 'Name of the NFT' })
  name: string
  @ApiProperty({ description: 'URL of the NFT image' })
  imageUrl: string
  @ApiProperty({ description: 'Number of NFT to be minted' })
  quantity?: number = 1
  @ApiProperty({ description: 'The address of the recipient' })
  recipient: string
}

/*
export class RequestNFTDto {
  @ApiProperty({ description: 'The address of the NFT' })
  nftAddress: string
  @ApiProperty({ description: 'The address of the recipient' })
  recipient: string
}*/

export class RequestTokenDto {
  @ApiProperty({ description: 'The amount of the token' })
  amount: number
  @ApiProperty({ description: 'The address of the recipient' })
  recipient: string
}

export class GetTokenBalanceDto {
  @ApiProperty({ description: 'The address of the wallet' })
  wallet: string
}

export class CreateNFTResponseDto {
  @ApiProperty({ description: 'The signature of the transaction' })
  signature: string
  @ApiProperty({ description: 'The list of NFT addresses minted' })
  addresses: string[]
}

export class RequestNFTResponseDto {
  @ApiProperty({ description: 'The signature of the transaction' })
  signature: string
}

export class RequestTokenResponseDto {
  @ApiProperty({ description: 'The signature of the transaction' })
  signature: string
}

export class GetTokenBalanceResponseDto {
  @ApiProperty({ description: 'The balance of the wallet' })
  balance: number
}
