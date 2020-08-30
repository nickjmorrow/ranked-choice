import { Module } from '@nestjs/common';
import { PollResultCalculationModule } from './poll-result-calculation/poll-result-calculation.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollingModule } from './polling/polling.module';
import ormConfig from '~/ormconfig';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        PollResultCalculationModule,
        TypeOrmModule.forRoot(ormConfig),
        PollingModule,
        ConfigModule.forRoot({ envFilePath: ['.env.development', '.env'] }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
