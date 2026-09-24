import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CastBallotDto, CreatePollDto } from './polls.dto';
import { PollsService } from './polls.service';
import type { CreatedPollView, PollResultsView, PollView } from './polls.views';

@Controller('polls')
export class PollsController {
  constructor(private readonly polls: PollsService) {}

  // Anyone can create a poll or vote — there are no accounts — so the two
  // endpoints that write are held to a pace a person could manage by hand.
  @Post()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  create(@Body() request: CreatePollDto): Promise<CreatedPollView> {
    return this.polls.create(request);
  }

  @Get(':link')
  get(@Param('link') link: string): Promise<PollView> {
    return this.polls.get(link);
  }

  @Post(':link/ballots')
  @HttpCode(204)
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  castBallot(@Param('link') link: string, @Body() request: CastBallotDto): Promise<void> {
    return this.polls.castBallot(link, request);
  }

  @Get(':link/results')
  results(@Param('link') link: string): Promise<PollResultsView> {
    return this.polls.results(link);
  }
}
