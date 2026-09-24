import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { loadConfig } from './config';
import { dataSourceOptions } from './data-source';
import { HealthController } from './health/health.controller';
import { PollsController } from './polls/polls.controller';
import { PollsService } from './polls/polls.service';
import { TallyController } from './tally/tally.controller';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useFactory: () => dataSourceOptions(loadConfig().databaseUrl) }),
    // Per client IP, per minute. Endpoints set their own limits; this is the
    // ceiling for anything that does not.
    ThrottlerModule.forRoot([{ name: 'default', ttl: 60_000, limit: 120 }]),
  ],
  controllers: [HealthController, PollsController, TallyController],
  providers: [PollsService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
