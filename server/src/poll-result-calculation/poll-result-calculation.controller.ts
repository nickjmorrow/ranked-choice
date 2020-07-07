import { Controller, Req, Post } from '@nestjs/common';
import { Request } from 'express';
import {
    PollResultCalculationService,
    CalculatePollResultRequest,
} from '~/poll-result-calculation/poll-result-calculation.service';
import { PollResult } from '~/poll-result-calculation/types/PollResult';

@Controller('poll-result-calculation')
export class PollResultCalculationController {
    constructor(private readonly pollResultCalculationService: PollResultCalculationService) {}

    @Post()
    calculatePollResults(@Req() request: Request): PollResult {
        return this.pollResultCalculationService.calculatePollResult(request.body as CalculatePollResultRequest);
    }
}
