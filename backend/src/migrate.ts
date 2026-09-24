import { ConsoleLogger, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { loadConfig } from './config';
import { dataSourceOptions } from './data-source';

/**
 * Brings the schema up to date, then exits. Compose runs it as a one-shot
 * container before the API starts, so a failed migration stops a deploy
 * instead of leaving the API running against a schema it does not expect.
 */
async function migrate() {
  const config = loadConfig();
  Logger.overrideLogger(new ConsoleLogger({ json: config.logJson }));
  const logger = new Logger('migrate');
  const dataSource = new DataSource(dataSourceOptions(config.databaseUrl));
  await dataSource.initialize();
  try {
    const applied = await dataSource.runMigrations();
    logger.log(
      applied.length === 0
        ? 'Schema is up to date.'
        : `Applied ${applied.length}: ${applied.map((migration) => migration.name).join(', ')}`,
    );
  } finally {
    await dataSource.destroy();
  }
}

migrate().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
