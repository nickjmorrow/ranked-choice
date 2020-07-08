import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PollResultCalculationController } from './poll-result-calculation/poll-result-calculation.controller';
import { PollResultCalculationModule } from './poll-result-calculation/poll-result-calculation.module';
import { PollResultCalculationService } from '~/poll-result-calculation/poll-result-calculation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from '~/config/ormconfig';

@Module({
    imports: [PollResultCalculationModule, TypeOrmModule.forRoot(ormConfig)],
    controllers: [AppController, PollResultCalculationController],
    // TODO: Why do I need to include this provider here instead of just on the PRCModule?
    providers: [AppService, PollResultCalculationService],
})
export class AppModule {}
