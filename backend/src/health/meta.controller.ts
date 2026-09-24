import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { loadConfig } from '../config';
import { POLL_RETENTION_DAYS } from '../demo/resetDemo';

export interface MetaView {
  /** Set on the public demo, so the share page can say how long a poll lasts. */
  pollRetentionDays: number | null;
}

@Controller('meta')
@SkipThrottle()
export class MetaController {
  @Get()
  meta(): MetaView {
    return { pollRetentionDays: loadConfig().demoReset ? POLL_RETENTION_DAYS : null };
  }
}
