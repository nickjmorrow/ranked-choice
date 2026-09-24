import { ConsoleLogger, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { loadConfig } from './config';
import { dataSourceOptions } from './data-source';
import { resetDemo } from './demo/resetDemo';

/**
 * Runs the demo reset once and exits. `scripts/reset-demo.sh` calls it inside
 * the running backend container, nightly, from cron.
 *
 * Refuses unless DEMO_RESET=true: it deletes polls, and on a deployment that
 * is not the public demo those are somebody's real polls.
 */
async function main() {
  const config = loadConfig();
  Logger.overrideLogger(new ConsoleLogger({ json: config.logJson }));
  const logger = new Logger('reset-demo');

  if (!config.demoReset) {
    logger.error('Refusing: DEMO_RESET is not true, so this is not the public demo.');
    process.exitCode = 1;
    return;
  }

  const dataSource = new DataSource(dataSourceOptions(config.databaseUrl));
  await dataSource.initialize();
  try {
    const report = await dataSource.transaction((manager) => resetDemo(manager));
    logger.log(
      `Example poll restored; ${String(report.expired.length)} expired poll(s) deleted` +
        (report.expired.length > 0 ? `: ${report.expired.join(', ')}` : '.'),
    );
  } finally {
    await dataSource.destroy();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
