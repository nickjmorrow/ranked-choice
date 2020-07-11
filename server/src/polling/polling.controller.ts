import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { PollProvider } from '~/polling/poll-provider';
import { PollVoter } from '~/polling/poll-voter';
import { PollCreator } from '~/polling/poll-creator';

@Controller('polls')
export class PollingController {
    constructor(
        private readonly pollProvider: PollProvider,
        private readonly pollVoter: PollVoter,
        private readonly pollCreator: PollCreator,
    ) {}

    @Get(':link')
    async getPollByLink(@Param() params) {
        return await this.pollProvider.getOnePoll(params.link);
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
