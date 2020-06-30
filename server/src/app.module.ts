import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CalculationModule } from './calculation/calculation.module';
import { PollResultCalcualtionModule } from './poll-result-calcualtion/poll-result-calcualtion.module';
import { PollResultCalculationController } from './poll-result-calculation/poll-result-calculation.controller';
import { PollResultCalculationModule } from './poll-result-calculation/poll-result-calculation.module';

@Module({
  imports: [CalculationModule, PollResultCalcualtionModule, PollResultCalculationModule],
  controllers: [AppController, PollResultCalculationController],
  providers: [AppService],
})
export class AppModule {}
