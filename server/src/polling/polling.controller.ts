import { Controller, Get, Param } from '@nestjs/common';
import { PollProvider } from '~/polling/poll-provider';

@Controller('polls')
export class PollingController {
    constructor(private readonly pollProvider: PollProvider) {}

    @Get()
    getAllPools() {
        return this.pollProvider.getAllProducts();
    }

    @Get(':link')
    getPollByLink(@Param() params) {
        return this.pollProvider.getOnePoll(params.link);
    }
}
