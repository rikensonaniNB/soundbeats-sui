import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { getLeaderboardInstance } from './leaderboard'

describe('AppController', () => {
    let appController: AppController

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService],
        }).compile()

        appController = app.get<AppController>(AppController)
    });

    /*
    describe('Tokens', () => {
        it('get empty wallet balance', async () => {
            const request = {
                wallet: "0x5b6b984e9325541535b189efc78b3df9e08c1b964255d7a96fa2f1801e60554e"
            }
            const response = await appController.getTokenBalance(request);
            expect(response.balance).toEqual(0);
        })
    });*/

    describe('Leaderboard', () => {
        it('get empty leaderboard', async () => {
            const leaderboard = getLeaderboardInstance("testnet");
            expect(leaderboard.getLeaderboardScores.length).toEqual(0);
        });

        it('add to leaderboard', async () => {
            const leaderboard = getLeaderboardInstance("testnet");
            expect(leaderboard.getLeaderboardScores.length).toEqual(0);
        });
    });
})
