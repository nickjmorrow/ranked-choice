import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PollResultCalculationController } from './poll-result-calculation/poll-result-calculation.controller';
import { PollResultCalculationModule } from './poll-result-calculation/poll-result-calculation.module';
import { PollResultCalculationService } from '~/poll-result-calculation/poll-result-calculation.service';
<<<<<<< HEAD
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
=======

@Module({
    imports: [PollResultCalculationModule],
>>>>>>> master
    controllers: [AppController, PollResultCalculationController],
    // TODO: Why do I need to include this provider here instead of just on the PRCModule?
    providers: [AppService, PollResultCalculationService],
})
export class AppModule {}
