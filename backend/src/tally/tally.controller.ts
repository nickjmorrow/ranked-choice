import { BadRequestException, Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { type Tally, tally, TallyError } from './tally';
import { TallyRequestDto } from './tally.dto';

@Controller('tally')
export class TallyController {
  /**
   * Counts ballots without storing anything. The simulator calls this on every
   * edit, so it gets a far higher rate limit than the endpoints that write.
   */
  @Post()
  @HttpCode(200)
  @Throttle({ default: { limit: 600, ttl: 60_000 } })
  count(@Body() request: TallyRequestDto): Tally {
    try {
      return tally(request.optionIds, request.ballots);
    } catch (caught) {
      if (caught instanceof TallyError) throw new BadRequestException(caught.message);
      throw caught;
    }
  }
}
