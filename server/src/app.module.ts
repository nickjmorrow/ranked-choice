import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PollResultCalculationController } from './poll-result-calculation/poll-result-calculation.controller';
import { PollResultCalculationModule } from './poll-result-calculation/poll-result-calculation.module';

@Module({
    imports: [PollResultCalculationModule],
    controllers: [AppController, PollResultCalculationController],
    providers: [AppService],
})
export class AppModule {}
