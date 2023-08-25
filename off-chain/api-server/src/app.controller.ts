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
    GetLeaderboardDto,
    GetLeaderboardResponseDto,
    AddLeaderboardDto,
    AddLeaderboardResponseDto
} from './entity/req.entity'
import { SuiService } from './sui.service'
import { AppLogger } from './app.logger';

const LEADERBOARD_DEFAULT_LIMIT: number = 100;

@Controller()
export class AppController {
    logger: AppLogger

    constructor(private readonly appService: AppService, private readonly suiService: SuiService) {
        this.logger = new AppLogger('app.controller');
    }

    @Get('/')
    healthcheck() {
        return 'ok';
    }

    @ApiOperation({ summary: 'Create NFT' })
    @Post('/api/v1/nfts')
    async mintNft(@Body() body: MintNftDto): Promise<MintNftResponseDto> {
        const logString = `POST /api/v1/nfts ${JSON.stringify(body)}`;
        this.logger.log(logString);
        try {
            const { name, recipient, imageUrl, quantity } = body;
            if (body.name == null || body.name == '') {
                throw new Error('name cannot be null or empty');
            }
            if (imageUrl == null || imageUrl == '') {
                throw new Error('imageUrl cannot be null or empty');
            }
            const output = await this.suiService.mintNfts(recipient, name, "Soundbeats NFT", imageUrl, quantity ?? 1);
            this.logger.log(`${logString} returning ${JSON.stringify(output)}`);
            return output;
        }
        catch (e) {
            this.logger.error(`error in ${logString}: ${e}`);
        }
    }

    @ApiOperation({ summary: 'Request private token' })
    @Post('/api/v1/token')
    async mintToken(@Body() body: MintTokenDto): Promise<MintTokenResponseDto> {
        const logString = `POST /api/v1/token ${JSON.stringify(body)}`;
        this.logger.log(logString);
        try {
            const { amount, recipient } = body;
            if (amount == null || amount <= 0) {
                throw new Error('amount cannot be null, zero or negative');
            }
            if (recipient == null || recipient == '') {
                throw new Error('recipient cannot be null or empty');
            }
            const output = await this.suiService.mintTokens(recipient, amount);
            this.logger.log(`${logString} returning ${JSON.stringify(output)}`);
            return output;
        }
        catch (e) {
            this.logger.error(`error in ${logString}: ${e}`);
        }
    }

    @ApiOperation({ summary: 'Get private token balance' })
    @Get('/api/v1/token')
    async getTokenBalance(@Query() query: GetTokenBalanceDto): Promise<GetTokenBalanceResponseDto> {
        const logString = `GET /api/v1/token ${JSON.stringify(query)}`;
        this.logger.log(logString);
        try {
            const { wallet } = query;
            if (wallet == null || wallet == '') {
                throw new Error('wallet cannot be null or empty');
            }
            const output = await this.suiService.getTokenBalance(wallet);
            this.logger.log(`${logString} returning ${JSON.stringify(output)}`);
            return output;
        }
        catch (e) {
            this.logger.error(`error in ${logString}: ${e}`);
        }
    }

    @ApiOperation({ summary: 'Get list of user-owned NFTs' })
    @Get('/api/v1/nfts')
    async getBeatsNfts(@Query() query: GetBeatsNftsDto): Promise<GetBeatsNftsResponseDto> {
        const logString = `GET /api/v1/nfts ${JSON.stringify(query)}`;
        this.logger.log(logString);
        try {
            const { wallet } = query;
            if (wallet == null || wallet == '') {
                throw new Error('wallet cannot be null or empty');
            }
            const output = await this.suiService.getUserNFTs(wallet);
            this.logger.log(`${logString} returning ${JSON.stringify(output)}`);
            return output;
        }
        catch (e) {
            this.logger.error(`error in ${logString}: ${e}`);
        }
    }

    @ApiOperation({ summary: 'Verify a signed message' })
    @Get('/api/v1/verify')
    async verifySignature(@Query() query: VerifySignatureDto): Promise<VerifySignatureResponseDto> {
        const logString = `GET /api/v1/verify ${JSON.stringify(query)}`;
        this.logger.log(logString);
        try {
            let { address, signature, message } = query;
            if (address == null || address == '') {
                throw new Error('address cannot be null or empty')
            }
            if (signature == null || signature == '') {
                throw new Error('signature cannot be null or empty')
            }
            if (message == null || message == '') {
                throw new Error('message cannot be null or empty')
            }
            const output = await this.suiService.verifySignature(address, signature, message);
            this.logger.log(`${logString} returning ${JSON.stringify(output)}`);
            return output;
        }
        catch (e) {
            this.logger.error(`error in ${logString}: ${e}`);
        }
    }

    @ApiOperation({ summary: 'Get a user score from the leaderboard' })
    @Get('/api/v1/leaderboard')
    async getLeaderboardScore(@Query() query: GetLeaderboardDto): Promise<GetLeaderboardResponseDto> {
        const logString = `GET /api/v1/leaderboard ${JSON.stringify(query)}`;
        this.logger.log(logString);
        try {
            let { wallet, limit } = query;
            if (!wallet || wallet == '') {
                wallet = null;
            }
            if (!limit) {
                limit = LEADERBOARD_DEFAULT_LIMIT;
            }
            const output = this.suiService.getLeaderboardScores(wallet, limit);
            this.logger.log(`${logString} returning ${JSON.stringify(output)}`);
            return output;
        }
        catch (e) {
            this.logger.error(`error in ${logString}: ${e}`);
        }
    }

    @ApiOperation({ summary: 'Add to a user score on the leaderboard' })
    @Post('/api/v1/leaderboard')
    async addLeaderboardScore(@Body() body: AddLeaderboardDto): Promise<AddLeaderboardResponseDto> {
        const logString = `POST /api/v1/leaderboard ${JSON.stringify(body)}`;
        this.logger.log(logString);
        try {
            const { score, wallet } = body;
            if (score == null || score <= 0) {
                throw new Error('score cannot be null, zero or negative');
            }
            if (wallet == null || wallet == '') {
                throw new Error('wallet cannot be null or empty');
            }
            const output = await this.suiService.addLeaderboardScore(wallet, score);
            this.logger.log(`${logString} returning ${JSON.stringify(output)}`);
            return output;
        }
        catch (e) {
            this.logger.error(`error in ${logString}: ${e}`);
        }
    }
}
