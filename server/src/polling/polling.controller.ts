import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { PollProvider } from '~/polling/pollProvider.service';
import { PollVoter } from '~/polling/pollVoter.service';
import { PollCreator } from '~/polling/pollCreator.service';
import { PollResultProvider } from '~/polling/pollResultProvider.service';

@Controller('polls')
export class PollingController {
    constructor(
        private readonly pollProvider: PollProvider,
        private readonly pollVoter: PollVoter,
        private readonly pollCreator: PollCreator,
        private readonly pollResultsProvider: PollResultProvider,
    ) {}

    @Get(':link')
    async getPollByLink(@Param() params) {
        return await this.pollProvider.getOnePoll(params.link);
    }

    @Get('/results/:link')
    async getPollResultsByLink(@Param() params) {
        return await this.pollResultsProvider.getPollResult(params.link);
    }

    @Post('/vote')
    async voteOnPoll(@Body() body) {
        await this.pollVoter.voteOnPoll(body);
    }

    @Post('/')
    async createPoll(@Body() body) {
        await this.pollCreator.createPoll(body);
    }
}
