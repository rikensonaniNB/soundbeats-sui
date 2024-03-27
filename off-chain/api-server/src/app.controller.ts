import {
    Body, Controller, Get, Post, Put, Query, HttpCode,
    BadRequestException, 
    UnauthorizedException,
    InternalServerErrorException, 
    } from '@nestjs/common'
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
    StartAuthSessionDto,
    StartAuthSessionResponseDto,
    AuthVerifyDto,
    AuthVerifyResponseDto,
    GetLeaderboardDto,
    GetLeaderboardResponseDto,
    AddLeaderboardDto,
    AddLeaderboardResponseDto,
    GetLeaderboardSprintDto,
    GetLeaderboardSprintResponseDto,
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
    @HttpCode(200)
    async mintNft(@Body() body: MintNftDto): Promise<MintNftResponseDto> {
        const logString = `POST /api/v1/nfts ${JSON.stringify(body)}`;
        this.logger.log(logString);
        const { name, recipient, imageUrl, quantity } = body;
        if (body.name == null || body.name == '') {
            throw new BadRequestException('name cannot be null or empty');
        }
        if (imageUrl == null || imageUrl == '') {
            throw new BadRequestException('imageUrl cannot be null or empty');
        }
        
        try {
            const output = await this.suiService.mintNfts(recipient, name, "Soundbeats NFT", imageUrl, quantity ?? 1);
            this.logger.log(`${logString} returning ${JSON.stringify(output)}`);
            return output;
        }
        catch (e) {
            this.logger.error(`error in ${logString}: ${e}`);
            throw new InternalServerErrorException();
        }
    }

    @ApiOperation({ summary: 'Request private token' })
    @Post('/api/v1/token')
    @HttpCode(200)
    async mintToken(@Body() body: MintTokenDto): Promise<MintTokenResponseDto> {
        const logString = `POST /api/v1/token ${JSON.stringify(body)}`;
        this.logger.log(logString);
        const { amount, recipient } = body;
        if (amount == null || amount <= 0) {
            throw new BadRequestException('amount cannot be null, zero or negative');
        }
        if (recipient == null || recipient == '') {
            throw new BadRequestException('recipient cannot be null or empty');
        }
        
        try {
            const output = await this.suiService.mintTokens(recipient, amount);
            this.logger.log(`${logString} returning ${JSON.stringify(output)}`);
            return output;
        }
        catch (e) {
            this.logger.error(`error in ${logString}: ${e}`);
            throw new InternalServerErrorException();
        }
    }

    @ApiOperation({ summary: 'Get private token balance' })
    @Get('/api/v1/token')
    async getTokenBalance(@Query() query: GetTokenBalanceDto): Promise<GetTokenBalanceResponseDto> {
        const logString = `GET /api/v1/token ${JSON.stringify(query)}`;
        this.logger.log(logString);
        const { wallet } = query;
        if (wallet == null || wallet == '') {
            throw new BadRequestException('wallet cannot be null or empty');
        }
        
        try {
            const output = await this.suiService.getTokenBalance(wallet);
            this.logger.log(`${logString} returning ${JSON.stringify(output)}`);
            return output;
        }
        catch (e) {
            this.logger.error(`error in ${logString}: ${e}`);
            throw new InternalServerErrorException();
        }
    }

    @ApiOperation({ summary: 'Get list of user-owned NFTs' })
    @Get('/api/v1/nfts')
    async getBeatsNfts(@Query() query: GetBeatsNftsDto): Promise<GetBeatsNftsResponseDto> {
        const logString = `GET /api/v1/nfts ${JSON.stringify(query)}`;
        this.logger.log(logString);
        const { wallet } = query;
        if (wallet == null || wallet == '') {
            throw new BadRequestException('wallet cannot be null or empty');
        }
        
        try {
            const output = await this.suiService.getUserNFTs(wallet);
            this.logger.log(`${logString} returning ${JSON.stringify(output)}`);
            return output;
        }
        catch (e) {
            this.logger.error(`error in ${logString}: ${e}`);
            throw new InternalServerErrorException();
        }
    }

    @ApiOperation({ summary: 'Verify a signed message' })
    @Get('/api/v1/verify')
    async verifySignature(@Query() query: VerifySignatureDto): Promise<VerifySignatureResponseDto> {
        const logString = `GET /api/v1/verify ${JSON.stringify(query)}`;
        this.logger.log(logString);
        let { address, signature, message } = query;
        if (address == null || address == '') {
            throw new BadRequestException('address cannot be null or empty')
        }
        if (signature == null || signature == '') {
            throw new BadRequestException('signature cannot be null or empty')
        }
        if (message == null || message == '') {
            throw new BadRequestException('message cannot be null or empty')
        }
        
        try {
            const output = await this.suiService.verifySignature(address, signature, message);
            this.logger.log(`${logString} returning ${JSON.stringify(output)}`);
            return output;
        }
        catch (e) {
            this.logger.error(`error in ${logString}: ${e}`);
            throw new InternalServerErrorException();
        }
    }

    // *** LEADERBOARD *** 

    @ApiOperation({ summary: 'Get a user score from the leaderboard' })
    @Get('/api/v1/leaderboard')
    async getLeaderboardScore(@Query() query: GetLeaderboardDto): Promise<GetLeaderboardResponseDto> {
        const logString = `GET /api/v1/leaderboard ${JSON.stringify(query)}`;
        this.logger.log(logString);
        try {
            let { wallet, limit, sprint } = query;
            if (!wallet || wallet == '') {
                wallet = null;
            }
            if (!limit) {
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
            throw new InternalServerErrorException();
        }
    }

    @ApiOperation({ summary: 'Add to a user score on the leaderboard' })
    @Post('/api/v1/leaderboard')
    @HttpCode(200)
    async addLeaderboardScore(@Body() body: AddLeaderboardDto): Promise<AddLeaderboardResponseDto> {
        const logString = `POST /api/v1/leaderboard ${JSON.stringify(body)}`;
        this.logger.log(logString);
        const { score, wallet } = body;
        if (score == null || score <= 0) {
            throw new BadRequestException('score cannot be null, zero or negative');
        }
        if (wallet == null || wallet == '') {
            throw new BadRequestException('wallet cannot be null or empty');
        }
        try {
            const output = await this.suiService.addLeaderboardScore(wallet, score);
            this.logger.log(`${logString} returning ${JSON.stringify(output)}`);
            return output;
        }
        catch (e) {
            this.logger.error(`error in ${logString}: ${e}`);
            throw new InternalServerErrorException();
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
            throw new InternalServerErrorException();
        }
    }

    // *** AUTH and REGISTRATION *** 

    @ApiOperation({ summary: 'Start an auth session' })
    @Post('/api/v1/auth')
    @HttpCode(200)
    async startAuthSession(@Body() body: StartAuthSessionDto): Promise<StartAuthSessionResponseDto> {
        const logString = `POST /api/v1/auth ${JSON.stringify(body)}`;
        this.logger.log(logString);
        let { evmWallet } = body;
        if (evmWallet == null || evmWallet == '') {
            throw new BadRequestException('evmWallet cannot be null or empty');
        }

        try {
            return await this.suiService.startAuthSession(evmWallet);
        }
        catch (e) {
            this.logger.error(`error in ${logString}: ${e}`);
            throw new InternalServerErrorException();
        }
    }

    //TODO: (HIGH) enforce max lengths for input params 
    @ApiOperation({ summary: 'Verify a signed message' })
    @Post('/api/v1/verify')
    @HttpCode(200)
    async verifyAuthSession(@Body() body: AuthVerifyDto): Promise<AuthVerifyResponseDto> {
        const logString = `POST /api/v1/verify ${JSON.stringify(body)}`;
        this.logger.log(logString);
        let status = '';
        
        let { wallet, walletType, sessionId, messageToSign, action, signature, username } = body;
        if (wallet == null || wallet == '') {
            throw new BadRequestException('wallet cannot be null or empty');
        }
        if (walletType == null) {
            throw new BadRequestException('walletType cannot be null or empty');
        }
        if (sessionId == null) {
            throw new BadRequestException('sessionId cannot be null or empty');
        }
        if (messageToSign == null) {
            throw new BadRequestException('messageToSign cannot be null or empty');
        }
        if (signature == null || signature == '') {
            throw new BadRequestException('signature cannot be null or empty');
        }
        try {
            if (username == null) {
                username = '';
            }
            if (action == null) {
                action = 'verify';
            }

            const output = await this.suiService.verifySignature2(sessionId, walletType, wallet, action, signature, messageToSign, username);
            this.logger.log(`${logString} returning ${JSON.stringify(output)}`);
            
            status = output.failureReason;
            if (output.verified) {
                return output; 
            }
        }
        catch (e) {
            this.logger.error(`error in ${logString}: ${e}`);
            throw new InternalServerErrorException();
        }

        console.log(status); 
        console.log(['sessionInvalid', 'sessionIdInvalid', 'sessionComplete', 'sessionExpired', 'walletMismatch', 'messageMismatch'].indexOf(status))
        if (['sessionInvalid', 'sessionIdInvalid', 'sessionComplete', 'sessionExpired', 'walletMismatch', 'messageMismatch'].indexOf(status) >= 0) {
            throw new UnauthorizedException(status);
        }
        
        throw new BadRequestException(status);
    }

    @ApiOperation({ summary: 'Get a SUI address given an associated login' })
    @Get('/api/v1/accounts')
    async getAccountFromLogin(@Query() query: GetAccountDto): Promise<GetAccountResponseDto> {
        const logString = `GET /api/v1/accounts ${JSON.stringify(query)}`;
        let output = { suiWallet: '', status: '' };
        this.logger.log(logString);
        let { authId, authType } = query;
        if (authId == null || authId == '') {
            throw new BadRequestException('Auth Id cannot be null or empty')
        }
        if (authType == null) {
            throw new BadRequestException('Auth type cannot be null or empty')
        }
        try {
            output = await this.suiService.getAccountFromLogin(authId, authType);
            this.logger.log(`${logString} returning ${JSON.stringify(output)}`);
            if (output.status === "success") {
                return output;
            }
        }
        catch (e) {
            this.logger.error(`error in ${logString}: ${e}`);
            throw new InternalServerErrorException();
        }
        
        throw new BadRequestException(output.status);
    }
}
