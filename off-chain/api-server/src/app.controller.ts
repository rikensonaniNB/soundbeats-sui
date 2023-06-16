import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { AppService } from './app.service'
import {
    CreateNFTDto,
    CreateNFTResponseDto,
    GetTokenBalanceDto,
    GetTokenBalanceResponseDto,
    RequestNFTDto,
    RequestNFTResponseDto,
    RequestTokenDto,
    RequestTokenResponseDto,
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
    async createNFT(@Body() body: CreateNFTDto): Promise<CreateNFTResponseDto> {
        const { name, recipient, imageUrl, quantity } = body
        if (body.name == null || body.name == '') {
            throw new Error('name cannot be null or empty')
        }
        if (imageUrl == null || imageUrl == '') {
            throw new Error('imageUrl cannot be null or empty')
        }
        return await this.suiService.mintNfts(recipient, name, "Soundbeats NFT", imageUrl, quantity ?? 1)
    }

    /*
      @ApiOperation({ summary: 'Request NFT' })
      @Post('/api/v1/nfts/request')
      async requestNFT(@Body() body: RequestNFTDto): Promise<RequestNFTResponseDto> {
        const { nftAddress, recipient } = body
        if (nftAddress == null || nftAddress == '') {
          throw new Error('nftAddress cannot be null or empty')
        }
        if (recipient == null || recipient == '') {
          throw new Error('recipient cannot be null or empty')
        }
        return await this.suiService.requestNft(nftAddress, recipient)
      }
      */

    @ApiOperation({ summary: 'Request private token' })
    @Post('/api/v1/token')
    async requestToken(@Body() body: RequestTokenDto): Promise<RequestTokenResponseDto> {
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
}
