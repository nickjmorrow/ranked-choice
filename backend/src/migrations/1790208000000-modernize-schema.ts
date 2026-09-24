import type { MigrationInterface, QueryRunner } from 'typeorm';

const IDENTITY_COLUMNS = [
  ['polls', 'poll_id'],
  ['questions', 'question_id'],
  ['options', 'option_id'],
  ['votes', 'vote_id'],
] as const;

/**
 * The 2026 pass over the 2020 schema.
 *
 * - Identity sequences move past the seeded rows. The seed migration inserts
 *   with explicit ids (`OVERRIDING SYSTEM VALUE`), which does not advance a
 *   sequence, so on a fresh database the first poll anyone created collided
 *   with seeded poll 1.
 * - Ballot ids come from a sequence. They were `max(submission_id) + 1`, read
 *   and written in separate statements, so two ballots cast together could
 *   share an id and be counted as one.
 * - `users` goes: nothing has referred to it since polls lost `user_id`.
 * - Poll links are unique, and every foreign key a query filters on is indexed.
 */
export class ModernizeSchema1790208000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const [table, column] of IDENTITY_COLUMNS) {
      await queryRunner.query(
        `select setval(pg_get_serial_sequence('public.${table}', '${column}'),
                       coalesce((select max(${column}) from public.${table}), 0) + 1, false)`,
      );
    }

    await queryRunner.query(`create sequence public.ballot_submission_seq`);
    await queryRunner.query(
      `select setval('public.ballot_submission_seq',
                     coalesce((select max(submission_id) from public.votes), 0) + 1, false)`,
    );

    await queryRunner.query(`drop table public.users`);

    await queryRunner.query(`create unique index polls_link_key on public.polls (link)`);
    await queryRunner.query(`create index questions_poll_id_idx on public.questions (poll_id)`);
    await queryRunner.query(`create index options_question_id_idx on public.options (question_id)`);
    await queryRunner.query(`create index votes_question_id_idx on public.votes (question_id)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`drop index public.votes_question_id_idx`);
    await queryRunner.query(`drop index public.options_question_id_idx`);
    await queryRunner.query(`drop index public.questions_poll_id_idx`);
    await queryRunner.query(`drop index public.polls_link_key`);
    await queryRunner.query(`
      create table public.users (
        user_id int not null primary key generated always as identity
        , name varchar not null
        , email varchar not null
        , hashed_password varchar null
        , date_created date not null default current_timestamp
        , date_deleted date null
      )
    `);
    await queryRunner.query(`drop sequence public.ballot_submission_seq`);
  }
}
