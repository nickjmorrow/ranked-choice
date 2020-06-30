import { Test, TestingModule } from '@nestjs/testing';
import { PollResultCalculationService } from './poll-result-calculation.service';

describe('PollResultCalculationService', () => {
  let service: PollResultCalculationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PollResultCalculationService],
    }).compile();

    service = module.get<PollResultCalculationService>(PollResultCalculationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
