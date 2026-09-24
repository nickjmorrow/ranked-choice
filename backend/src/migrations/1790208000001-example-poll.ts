import type { MigrationInterface, QueryRunner } from 'typeorm';
import { deletePoll, EXAMPLE_LINK, seedExamplePoll } from '../demo/examplePoll';

/**
 * Creates the example poll (see `src/demo/examplePoll.ts`), replacing the 2020
 * seed poll, which was lorem ipsum.
 */
export class ExamplePoll1790208000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await deletePoll(queryRunner, 'morrow');
    await seedExamplePoll(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await deletePoll(queryRunner, EXAMPLE_LINK);
  }
}
