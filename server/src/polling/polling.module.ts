import { Module } from '@nestjs/common';
import { PollingController } from './polling.controller';
import { PollProvider } from '~/polling/pollProvider.service';
import { PollVoter } from '~/polling/pollVoter.service';
import { PollCreator } from '~/polling/pollCreator.service';
import { UniqueLinkProvider } from '~/polling/uniqueLinkProvider.service';
import { PollResultProvider } from '~/polling/pollResultProvider.service';
import { PollResultCalculationService } from '~/poll-result-calculation/poll-result-calculation.service';

@Module({
    controllers: [PollingController],
    providers: [
        PollProvider,
        PollVoter,
        PollCreator,
        UniqueLinkProvider,
        PollResultProvider,
        PollResultCalculationService,
    ],
})
export class PollingModule {}
