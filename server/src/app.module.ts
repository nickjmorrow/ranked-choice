import { Module } from '@nestjs/common';
import { PollResultCalculationModule } from '~/poll-result-calculation/poll-result-calculation.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollingModule } from '~/polling/polling.module';
import ormConfig from '~/ormconfig';

@Module({
    imports: [PollResultCalculationModule, TypeOrmModule.forRoot(ormConfig), PollingModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
