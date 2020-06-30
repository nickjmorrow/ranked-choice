import { Module } from '@nestjs/common';
import { PollResultCalculationController } from './poll-result-calculation.controller';
import { PollResultCalculationService } from './poll-result-calculation.service';

@Module({
  controllers: [PollResultCalculationController],
  providers: [PollResultCalculationService]
})
export class PollResultCalculationModule {}
