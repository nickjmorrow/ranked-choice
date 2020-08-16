import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { PollProvider } from '~/polling/pollProvider.service';
import { PollVoter } from '~/polling/pollVoter.service';
import { PollCreator } from '~/polling/pollCreator.service';
import { PollResultProvider } from '~/polling/pollResultProvider.service';
import { CreatePollResponse } from '~/polling/types/CreatePollResponse';
import { PollResult } from '~/polling/pollResult.dto';
import { Poll } from '~/polling/poll.entity';

@Controller('polls')
export class PollingController {
    constructor(
        private readonly pollProvider: PollProvider,
        private readonly pollVoter: PollVoter,
        private readonly pollCreator: PollCreator,
        private readonly pollResultsProvider: PollResultProvider,
    ) {}

    @Get(':link')
    async getPollByLink(@Param() params): Promise<Poll> {
        return await this.pollProvider.getOnePoll(params.link);
    }

    @Get('/results/:link')
    async getPollResultsByLink(@Param() params): Promise<PollResult> {
        return await this.pollResultsProvider.getPollResult(params.link);
    }

    @Post('/vote')
    async voteOnPoll(@Body() body): Promise<void> {
        await this.pollVoter.voteOnPoll(body);
    }

    @Post('/create')
    async createPoll(@Body() body): Promise<CreatePollResponse> {
        return await this.pollCreator.createPoll(body);
    }
}
