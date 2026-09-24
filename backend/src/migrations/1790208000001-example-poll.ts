import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * The example poll the home page links to, at /polls/example, with ballots
 * already cast so its results have something to show.
 *
 * The ballots are chosen so the two questions show the two ways a count ends.
 * "Where" goes three rounds and is won by the option that came second in the
 * first — Kyoto overtakes Lisbon on transfers, which is the thing ranked
 * choice exists to do. "What" is settled by a first-round majority.
 *
 * Replaces the 2020 seed poll, which was lorem ipsum.
 */

const WHERE = 'Where should the team offsite be?';
const WHAT = 'Which activity should we book?';

const POLL = {
  link: 'example',
  title: 'Team offsite 2026',
  description:
    'An example poll, seeded with 21 ballots. Add yours, then open the results ' +
    'to see how ballots move between rounds.',
  questions: [
    {
      content: WHERE,
      subheading:
        'Rank as many as you like. If your first choice is eliminated, your vote moves to your next.',
      options: [
        ['Lisbon', 'Portugal'],
        ['Kyoto', 'Japan'],
        ['Mexico City', 'Mexico'],
        ['Reykjavík', 'Iceland'],
      ],
    },
    {
      content: WHAT,
      subheading: null,
      options: [
        ['Cooking class', null],
        ['Guided hike', null],
        ['Escape room', null],
        ['Karaoke night', null],
      ],
    },
  ],
} as const;

/** [voters, ranking for WHERE, ranking for WHAT] */
const BALLOTS: [number, string[], string[]][] = [
  [5, ['Lisbon'], ['Cooking class', 'Guided hike']],
  [3, ['Lisbon', 'Mexico City'], ['Guided hike', 'Cooking class']],
  [4, ['Kyoto', 'Reykjavík'], ['Cooking class']],
  [3, ['Kyoto'], ['Escape room', 'Cooking class']],
  [3, ['Mexico City', 'Kyoto', 'Lisbon'], ['Cooking class', 'Karaoke night']],
  [1, ['Mexico City'], ['Karaoke night', 'Escape room']],
  [2, ['Reykjavík', 'Kyoto'], ['Guided hike', 'Escape room', 'Cooking class']],
];

export class ExamplePoll1790208000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await deletePoll(queryRunner, 'morrow');

    const [{ poll_id: pollId }] = (await queryRunner.query(
      `insert into public.polls (title, description, link) values ($1, $2, $3) returning poll_id`,
      [POLL.title, POLL.description, POLL.link],
    )) as [{ poll_id: number }];

    /** question content -> { question id, option label -> option id } */
    const ids = new Map<string, { questionId: number; options: Map<string, number> }>();
    for (const [index, question] of POLL.questions.entries()) {
      const [{ question_id: questionId }] = (await queryRunner.query(
        `insert into public.questions (poll_id, order_id, content, subheading)
         values ($1, $2, $3, $4) returning question_id`,
        [pollId, index + 1, question.content, question.subheading],
      )) as [{ question_id: number }];

      const options = new Map<string, number>();
      for (const [label, sublabel] of question.options) {
        const [{ option_id: optionId }] = (await queryRunner.query(
          `insert into public.options (question_id, label, sublabel) values ($1, $2, $3) returning option_id`,
          [questionId, label, sublabel],
        )) as [{ option_id: number }];
        options.set(label, optionId);
      }
      ids.set(question.content, { questionId, options });
    }

    for (const [voters, where, what] of BALLOTS) {
      for (let voter = 0; voter < voters; voter += 1) {
        const [{ id: submissionId }] = (await queryRunner.query(
          `select nextval('public.ballot_submission_seq')::int as id`,
        )) as [{ id: number }];
        for (const [content, ranking] of [
          [WHERE, where],
          [WHAT, what],
        ] as const) {
          const question = ids.get(content)!;
          for (const [rank, label] of ranking.entries()) {
            await queryRunner.query(
              `insert into public.votes (option_id, question_id, order_id, submission_id)
               values ($1, $2, $3, $4)`,
              [question.options.get(label), question.questionId, rank + 1, submissionId],
            );
          }
        }
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await deletePoll(queryRunner, POLL.link);
  }
}

async function deletePoll(queryRunner: QueryRunner, link: string) {
  const questions = `select question_id from public.questions
                     where poll_id in (select poll_id from public.polls where link = $1)`;
  await queryRunner.query(`delete from public.votes where question_id in (${questions})`, [link]);
  await queryRunner.query(`delete from public.options where question_id in (${questions})`, [link]);
  await queryRunner.query(
    `delete from public.questions where poll_id in (select poll_id from public.polls where link = $1)`,
    [link],
  );
  await queryRunner.query(`delete from public.polls where link = $1`, [link]);
}
