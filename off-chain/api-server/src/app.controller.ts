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
    AddLeaderboardResponseDto, 
    GetLeaderboardSprintDto, 
    GetLeaderboardSprintResponseDto, 
    RegisterEvmDto,
    RegisterEvmResponseDto, 
    GetAccountDto, 
    GetAccountResponseDto
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

    // *** NFTS and TOKENS *** 
    
    @ApiOperation({ summary: 'Create NFT' })
    @Post('/api/v1/nfts')
    async mintNft(@Body() body: MintNftDto): Promise<MintNftResponseDto> {
        const logString = `POST /api/v1/nfts ${JSON.stringify(body)}`;
        this.logger.log(logString); 
        try 
        {
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
        const logString = `POST /api/v1/token ${JSON.stringify(body) }`;
        this.logger.log(logString); 
        try 
        {
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
        try 
        {
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

    // *** LEADERBOARD *** 
    
    @ApiOperation({ summary: 'Get a user score from the leaderboard' })
    @Get('/api/v1/leaderboard')
    async getLeaderboardScore(@Query() query: GetLeaderboardDto): Promise<GetLeaderboardResponseDto> {
        const logString = `GET /api/v1/leaderboard ${JSON.stringify(query)}`; 
        this.logger.log(logString);
        try 
        {
            let { wallet, limit, sprint } = query;
            if (!wallet || wallet == '') {
                wallet = null;
            }
            if (!limit ) {
                limit = LEADERBOARD_DEFAULT_LIMIT;
            }
            let output = null;
            if (wallet && wallet.length) {
                output = await this.suiService.getLeaderboardScore(wallet, sprint);
            }
            else {
                output = await this.suiService.getLeaderboardScores(limit, sprint);
            }
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

    @ApiOperation({ summary: 'Add to a user score on the leaderboard' })
    @Get('/api/v1/sprint')
    async getLeaderboardSprint(@Body() query: GetLeaderboardSprintDto): Promise<GetLeaderboardSprintResponseDto> {
        const logString = `GET /api/v1/sprint ${JSON.stringify(query)}`;
        this.logger.log(logString);
        try {
            let { sprint, limit } = query;
            let output = null;
            if (sprint && sprint.length) {
                output = await this.suiService.getLeaderboardSprint(sprint);
            }
            else {
                output = await this.suiService.getLeaderboardSprints(limit);
            }
            this.logger.log(`${logString} returning ${JSON.stringify(output)}`);
            return output;
        }
        catch (e) {
            this.logger.error(`error in ${logString}: ${e}`);
        }
    }
    
    // *** AUTH and REGISTRATION *** 

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

    @ApiOperation({ summary: 'Register a new Sui wallet using an EVM wallet' })
    @Post('/api/v1/register_evm')
    async registerEvm(@Body() body: RegisterEvmDto): Promise<RegisterEvmResponseDto> {
        const logString = `GET /api/v1/register_evm ${JSON.stringify(body)}`;
        this.logger.log(logString);
        try {
            let { evmWallet } = body;
            if (evmWallet == null || evmWallet == '') {
                throw new Error('EVM address cannot be null or empty')
            }
            const output = this.suiService.registerEvm(evmWallet); 
            this.logger.log(`${logString} returning ${JSON.stringify(output)}`);
            return output;
        }
        catch (e) {
            this.logger.error(`error in ${logString}: ${e}`);
        }
    }

    @ApiOperation({ summary: 'Get a SUI address given an associated login' })
    @Get('/api/v1/accounts')
    async getAccountFromLogin(@Query() query: GetAccountDto): Promise<GetAccountResponseDto> {
        const logString = `GET /api/v1/register_evm ${JSON.stringify(query)}`;
        this.logger.log(logString);
        try {
            let { authId, authType } = query;
            if (authId == null || authId == '') {
                throw new Error('Auth Id cannot be null or empty')
            }
            if (authType == null || authType == '') {
                throw new Error('Auth type cannot be null or empty')
            }
            const output = this.suiService.getAccountFromLogin(authId, authType);
            this.logger.log(`${logString} returning ${JSON.stringify(output)}`);
            return output;
        }
        catch (e) {
            this.logger.error(`error in ${logString}: ${e}`);
        }
    }
}
