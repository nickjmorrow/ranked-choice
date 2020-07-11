import { Module } from '@nestjs/common';
import { PollingController } from './polling.controller';
import { PollProvider } from '~/polling/poll-provider';
import { PollVoter } from '~/polling/poll-voter';
import { PollCreator } from '~/polling/poll-creator';
import { UniqueLinkProvider } from '~/polling/unique-link-provider';

@Module({
    controllers: [PollingController],
    providers: [PollProvider, PollVoter, PollCreator, UniqueLinkProvider],
})
export class PollingModule {}
