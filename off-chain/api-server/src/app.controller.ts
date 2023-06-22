import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { AppService } from './app.service'
import {
    MintNftDto,
    MintNftResponseDto,
    GetTokenBalanceDto,
    GetTokenBalanceResponseDto,
    GetBeatsNftsDto,
    GetBeatsNftsResponseDto,
    MintTokenDto,
    MintTokenResponseDto,
    VerifySignatureDto,
    VerifySignatureResponseDto,
} from './entity/req.entity'
import { SuiService } from './sui.service'

@Controller()
export class AppController {
    constructor(private readonly appService: AppService, private readonly suiService: SuiService) { }

    @Get('/')
    healthcheck() {
        return 'ok'
    }

    @ApiOperation({ summary: 'Create NFT' })
    @Post('/api/v1/nfts')
    async mintNft(@Body() body: MintNftDto): Promise<MintNftResponseDto> {
        const { name, recipient, imageUrl, quantity } = body
        if (body.name == null || body.name == '') {
            throw new Error('name cannot be null or empty')
        }
        if (imageUrl == null || imageUrl == '') {
            throw new Error('imageUrl cannot be null or empty')
        }
        return await this.suiService.mintNfts(recipient, name, "Soundbeats NFT", imageUrl, quantity ?? 1)
    }

    @ApiOperation({ summary: 'Request private token' })
    @Post('/api/v1/token')
    async mintToken(@Body() body: MintTokenDto): Promise<MintTokenResponseDto> {
        const { amount, recipient } = body
        if (amount == null || amount <= 0) {
            throw new Error('amount cannot be null, zero or negative')
        }
        if (recipient == null || recipient == '') {
            throw new Error('recipient cannot be null or empty')
        }
        return await this.suiService.mintTokens(recipient, amount)
    }

    @ApiOperation({ summary: 'Get private token balance' })
    @Get('/api/v1/token')
    async getTokenBalance(@Query() query: GetTokenBalanceDto): Promise<GetTokenBalanceResponseDto> {
        const { wallet } = query
        if (wallet == null || wallet == '') {
            throw new Error('wallet cannot be null or empty')
        }
        return await this.suiService.getTokenBalance(wallet)
    }

    @ApiOperation({ summary: 'Get list of user-owned NFTs' })
    @Get('/api/v1/nfts')
    async getBeatsNfts(@Query() query: GetBeatsNftsDto): Promise<GetBeatsNftsResponseDto> {
        const { wallet } = query
        if (wallet == null || wallet == '') {
            throw new Error('wallet cannot be null or empty')
        }
        return await this.suiService.getUserNFTs(wallet)
    }

    @ApiOperation({ summary: 'Verify a signed message' })
    @Get('/api/v1/verify')
    async verifySignature(@Query() query: VerifySignatureDto): Promise<VerifySignatureResponseDto> {
        const { address, signature, message } = query
        if (address == null || address == '') {
            throw new Error('address cannot be null or empty')
        }
        if (signature == null || signature == '') {
            throw new Error('signature cannot be null or empty')
        }
        if (message == null || message == '') {
            throw new Error('message cannot be null or empty')
        }
        return await this.suiService.verifySignature(address, signature, message)
    }
}
