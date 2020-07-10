import { Module } from '@nestjs/common';
import { PollingController } from './polling.controller';
import { PollProvider } from '~/polling/poll-provider';

@Module({
    controllers: [PollingController],
    providers: [PollProvider],
})
export class PollingModule {}
