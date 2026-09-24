import { randomBytes } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Client } from 'pg';
import request from 'supertest';
import type { App } from 'supertest/types';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import { dataSourceOptions } from '../src/data-source';
import { resetDemo } from '../src/demo/resetDemo';
import type { PollResultsView, PollView } from '../src/polls/polls.views';

/**
 * The API against a real Postgres: a fresh database per run, migrated from
 * empty, so the migrations — seed included — are under test too.
 *
 * Needs a server at TEST_DATABASE_ADMIN_URL (default: the one
 * `docker compose up db` publishes) with a role that may create databases.
 */
const ADMIN_URL =
  process.env.TEST_DATABASE_ADMIN_URL ?? 'postgresql://app:app@localhost:5435/postgres';
const DATABASE = `ranked_choice_test_${randomBytes(4).toString('hex')}`;

let app: INestApplication<App>;
let baseUrl: string;

async function admin(sql: string) {
  const client = new Client({ connectionString: ADMIN_URL });
  await client.connect();
  try {
    await client.query(sql);
  } finally {
    await client.end();
  }
}

beforeAll(async () => {
  await admin(`create database ${DATABASE}`);
  const url = new URL(ADMIN_URL);
  url.pathname = `/${DATABASE}`;
  process.env.DATABASE_URL = url.toString();

  const dataSource = new DataSource(dataSourceOptions(url.toString()));
  await dataSource.initialize();
  await dataSource.runMigrations();
  await dataSource.destroy();

  const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
  app = moduleRef.createNestApplication();
  configureApp(app);
  // A real port rather than supertest's in-process server, so requests arrive
  // from loopback the way nginx's do, and X-Forwarded-For is honoured.
  await app.listen(0, '127.0.0.1');
  baseUrl = await app.getUrl();
});

afterAll(async () => {
  await app.close();
  await admin(`drop database if exists ${DATABASE} with (force)`);
});

const api = () => request(baseUrl);

/**
 * A different client for every call. Poll creation is rate limited per IP, and
 * this suite creates more polls than one visitor may.
 */
let clientNumber = 0;
const asNewClient = () => `203.0.113.${String((clientNumber += 1) % 250)}`;

const NEW_POLL = {
  title: '  Lunch  ',
  description: '',
  questions: [
    {
      content: 'Where should we eat?',
      subheading: 'Rank any.',
      options: [{ label: 'Tacos' }, { label: 'Ramen', sublabel: 'Downtown' }, { label: 'Pho' }],
    },
  ],
};

async function createPoll(body: object = NEW_POLL): Promise<PollView> {
  const created = await api()
    .post('/api/polls')
    .set('X-Forwarded-For', asNewClient())
    .send(body)
    .expect(201);
  const { link } = created.body as { link: string };
  return (await api().get(`/api/polls/${link}`).expect(200)).body as PollView;
}

function rankingByLabel(poll: PollView, ...labels: string[]) {
  const question = poll.questions[0]!;
  return {
    questionId: question.questionId,
    optionIds: labels.map((label) => question.options.find((o) => o.label === label)!.optionId),
  };
}

describe('health', () => {
  it('reports ok when the database answers', async () => {
    await api().get('/api/health').expect(200, { status: 'ok' });
  });
});

describe('the example poll', () => {
  it('is seeded, with its questions and options in order', async () => {
    const poll = (await api().get('/api/polls/example').expect(200)).body as PollView;

    expect(poll.title).toBe('Team offsite 2026');
    expect(poll.questions.map((q) => q.content)).toEqual([
      'Where should the team offsite be?',
      'Which activity should we book?',
    ]);
    expect(poll.questions[0]!.options.map((o) => o.label)).toEqual([
      'Lisbon',
      'Kyoto',
      'Mexico City',
      'Reykjavík',
    ]);
    expect(poll).not.toHaveProperty('pollId');
  });

  it('has results in which the first-round runner-up wins on transfers', async () => {
    const results = (await api().get('/api/polls/example/results').expect(200))
      .body as PollResultsView;
    const [where, what] = results.questions;
    const label = (questionIndex: number, optionId: number) =>
      results.poll.questions[questionIndex]!.options.find((o) => o.optionId === optionId)!.label;

    expect(results.ballots).toBe(21);

    expect(where!.tally.rounds).toHaveLength(3);
    expect(where!.tally.outcome).toMatchObject({ kind: 'winner', round: 3 });
    expect(label(0, (where!.tally.outcome as { optionId: number }).optionId)).toBe('Kyoto');
    expect(label(0, where!.tally.rounds[0]!.counts[0]!.optionId)).toBe('Lisbon');

    expect(what!.tally.outcome).toMatchObject({ kind: 'winner', round: 1 });
  });
});

describe('creating a poll', () => {
  it('trims text, stores blanks as null, and starts with no votes', async () => {
    const poll = await createPoll();

    expect(poll.link).toMatch(/^[a-z2-9]{10}$/);
    expect(poll.title).toBe('Lunch');
    expect(poll.description).toBeNull();
    expect(poll.questions[0]!.options[1]).toMatchObject({ label: 'Ramen', sublabel: 'Downtown' });

    const results = (await api().get(`/api/polls/${poll.link}/results`).expect(200))
      .body as PollResultsView;
    expect(results.ballots).toBe(0);
    expect(results.questions[0]!.tally.outcome).toEqual({ kind: 'no-votes' });
  });

  it.each([
    [{ ...NEW_POLL, title: '   ' }, 'The poll needs a title.'],
    [{ ...NEW_POLL, questions: [] }, 'The poll needs at least one question.'],
    [
      { ...NEW_POLL, questions: [{ content: 'Q', options: [{ label: 'Only one' }] }] },
      'Every question needs at least two options.',
    ],
    [{ ...NEW_POLL, owner: 'someone' }, 'property owner should not exist'],
  ])('rejects %j', async (body, message) => {
    const response = await api()
      .post('/api/polls')
      .set('X-Forwarded-For', asNewClient())
      .send(body)
      .expect(400);
    expect(JSON.stringify(response.body)).toContain(message);
  });

  it('rejects a question that repeats an option', async () => {
    const body = {
      ...NEW_POLL,
      questions: [{ content: 'Q', options: [{ label: 'Tacos' }, { label: 'tacos ' }] }],
    };
    const response = await api()
      .post('/api/polls')
      .set('X-Forwarded-For', asNewClient())
      .send(body)
      .expect(400);
    expect((response.body as { message: string }).message).toContain('repeats one');
  });

  it('limits how many polls one client may create per minute', async () => {
    const client = '198.51.100.7';
    const statuses: number[] = [];
    for (let attempt = 0; attempt < 11; attempt += 1) {
      const response = await api().post('/api/polls').set('X-Forwarded-For', client).send(NEW_POLL);
      statuses.push(response.status);
    }

    expect(statuses.slice(0, 10).every((status) => status === 201)).toBe(true);
    expect(statuses[10]).toBe(429);
    // Someone else is unaffected.
    await api().post('/api/polls').set('X-Forwarded-For', asNewClient()).send(NEW_POLL).expect(201);
  });
});

describe('voting', () => {
  it('counts a ballot in the results', async () => {
    const poll = await createPoll();

    await api()
      .post(`/api/polls/${poll.link}/ballots`)
      .send({ rankings: [rankingByLabel(poll, 'Pho', 'Tacos')] })
      .expect(204);

    const results = (await api().get(`/api/polls/${poll.link}/results`).expect(200))
      .body as PollResultsView;
    expect(results.ballots).toBe(1);
    expect(results.questions[0]!.tally.outcome).toMatchObject({
      kind: 'winner',
      optionId: rankingByLabel(poll, 'Pho').optionIds[0],
    });
  });

  it('gives ballots cast at the same moment distinct ids', async () => {
    const poll = await createPoll();
    const ballot = { rankings: [rankingByLabel(poll, 'Ramen')] };

    await Promise.all(
      Array.from({ length: 10 }, () =>
        api()
          .post(`/api/polls/${poll.link}/ballots`)
          .set('X-Forwarded-For', asNewClient())
          .send(ballot)
          .expect(204),
      ),
    );

    const results = (await api().get(`/api/polls/${poll.link}/results`).expect(200))
      .body as PollResultsView;
    expect(results.ballots).toBe(10);
    expect(results.questions[0]!.tally.rounds[0]!.counts[0]!.votes).toBe(10);
  });

  it('rejects an option that belongs to another poll', async () => {
    const poll = await createPoll();
    const other = (await api().get('/api/polls/example').expect(200)).body as PollView;

    const response = await api()
      .post(`/api/polls/${poll.link}/ballots`)
      .send({
        rankings: [
          {
            questionId: poll.questions[0]!.questionId,
            optionIds: [other.questions[0]!.options[0]!.optionId],
          },
        ],
      })
      .expect(400);
    expect((response.body as { message: string }).message).toContain(
      'not on “Where should we eat?”',
    );
  });

  it('rejects a ballot that skips a required question', async () => {
    const poll = await createPoll();
    const response = await api()
      .post(`/api/polls/${poll.link}/ballots`)
      .send({ rankings: [{ questionId: poll.questions[0]!.questionId, optionIds: [] }] })
      .expect(400);
    expect((response.body as { message: string }).message).toBe(
      'Rank at least one option for “Where should we eat?”.',
    );
  });

  it('rejects ranking the same option twice', async () => {
    const poll = await createPoll();
    await api()
      .post(`/api/polls/${poll.link}/ballots`)
      .send({ rankings: [rankingByLabel(poll, 'Pho', 'Pho')] })
      .expect(400);
  });

  it('404s for a link no poll has', async () => {
    await api().get('/api/polls/nope').expect(404);
    await api().get('/api/polls/nope/results').expect(404);
    await api().post('/api/polls/nope/ballots').send({ rankings: [] }).expect(404);
  });
});

describe('the simulator’s tally endpoint', () => {
  it('counts hypothetical ballots without storing them', async () => {
    const response = await api()
      .post('/api/tally')
      .send({
        optionIds: [1, 2, 3],
        ballots: [
          { ranking: [1], count: 4 },
          { ranking: [2], count: 3 },
          { ranking: [3, 2], count: 2 },
        ],
      })
      .expect(200);

    expect((response.body as { outcome: unknown }).outcome).toEqual({
      kind: 'winner',
      optionId: 2,
      round: 2,
    });
  });

  it('turns an uncountable request into a 400 with the reason', async () => {
    const response = await api()
      .post('/api/tally')
      .send({ optionIds: [1], ballots: [] })
      .expect(400);
    expect((response.body as { message: string }).message).toBe(
      'A count needs at least two options, but got 1.',
    );
  });
});

describe('the nightly demo reset', () => {
  const ballots = async (link: string) =>
    ((await api().get(`/api/polls/${link}/results`).expect(200)).body as PollResultsView).ballots;

  it('restores the example poll and expires only old polls', async () => {
    const example = (await api().get('/api/polls/example').expect(200)).body as PollView;
    await api()
      .post('/api/polls/example/ballots')
      .set('X-Forwarded-For', asNewClient())
      .send({
        rankings: example.questions.map((q) => ({
          optionIds: [q.options[0]!.optionId],
          questionId: q.questionId,
        })),
      })
      .expect(204);
    expect(await ballots('example')).toBeGreaterThan(21);

    const fresh = await createPoll();
    const old = await createPoll();
    const dataSource = app.get(DataSource);
    await dataSource.query(`update polls set date_created = current_date - 31 where link = $1`, [
      old.link,
    ]);

    const report = await dataSource.transaction((manager) => resetDemo(manager));

    expect(report.expired).toEqual([old.link]);
    expect(await ballots('example')).toBe(21);
    await api().get(`/api/polls/${fresh.link}`).expect(200);
    await api().get(`/api/polls/${old.link}`).expect(404);
  });

  it('reports no retention limit outside the demo', async () => {
    await api().get('/api/meta').expect(200, { pollRetentionDays: null });
  });
});
