import { Test, TestingModule } from '@nestjs/testing';
import { PollResultCalculationController } from './poll-result-calculation.controller';
import { PollResultCalculationService } from '~/poll-result-calculation/poll-result-calculation.service';

describe('PollResultCalculation Controller', () => {
    let controller: PollResultCalculationController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PollResultCalculationController],
            providers: [PollResultCalculationService],
        }).compile();

        controller = module.get<PollResultCalculationController>(PollResultCalculationController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
