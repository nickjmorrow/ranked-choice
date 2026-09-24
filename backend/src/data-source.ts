import type { DataSourceOptions } from 'typeorm';
import { createPollingTables1594335418721 } from './migrations/1594335418721-create-polling-tables';
import { initialSeedData1594336147602 } from './migrations/1594336147602-initial-seed-data';
import { createVoteTable1594439623822 } from './migrations/1594439623822-create-vote-table';
import { removeUserFromPoll1594494665716 } from './migrations/1594494665716-remove-user-from-poll';
import { ModernizeSchema1790208000000 } from './migrations/1790208000000-modernize-schema';
import { ExamplePoll1790208000001 } from './migrations/1790208000001-example-poll';
import { Option } from './polls/option.entity';
import { Poll } from './polls/poll.entity';
import { Question } from './polls/question.entity';
import { Vote } from './polls/vote.entity';

/**
 * Entities and migrations as imports rather than globs: a glob resolves
 * against whatever directory the code happens to run from — `src/` under the
 * tests, `dist/` in production — and fails quietly when it matches nothing.
 */
export function dataSourceOptions(databaseUrl: string): DataSourceOptions {
  return {
    type: 'postgres',
    url: databaseUrl,
    entities: [Poll, Question, Option, Vote],
    migrations: [
      createPollingTables1594335418721,
      initialSeedData1594336147602,
      createVoteTable1594439623822,
      removeUserFromPoll1594494665716,
      ModernizeSchema1790208000000,
      ExamplePoll1790208000001,
    ],
    // The schema belongs to the migrations. Nothing infers it from entities.
    synchronize: false,
    migrationsRun: false,
    migrationsTransactionMode: 'each',
  };
}
