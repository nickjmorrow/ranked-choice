import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { DataSource } from 'typeorm';

@Controller('health')
@SkipThrottle()
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  /** Up means the database answers, not merely that the process is running. */
  @Get()
  async check(): Promise<{ status: 'ok' }> {
    await this.dataSource.query('select 1');
    return { status: 'ok' };
  }
}
