import { Test, TestingModule } from '@nestjs/testing';
import { PollResultCalculationController } from './poll-result-calculation.controller';

describe('PollResultCalculation Controller', () => {
    let controller: PollResultCalculationController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PollResultCalculationController],
        }).compile();

        controller = module.get<PollResultCalculationController>(PollResultCalculationController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
