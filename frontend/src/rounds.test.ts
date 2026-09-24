import { describe, expect, it } from 'vitest';
import type { Option, Tally } from 'src/api/types';
import { describeOutcome, describeRound, roundView } from 'src/rounds';

const OPTIONS: Option[] = [
  { label: 'Lisbon', optionId: 1, sublabel: 'Portugal' },
  { label: 'Kyoto', optionId: 2, sublabel: 'Japan' },
  { label: 'Mexico City', optionId: 3, sublabel: null },
  { label: 'Reykjavík', optionId: 4, sublabel: null },
];

/** The example poll's first question: Kyoto overtakes Lisbon in round three. */
const COMEBACK: Tally = {
  ballots: 21,
  outcome: { kind: 'winner', optionId: 2, round: 3 },
  rounds: [
    {
      continuingVotes: 21,
      counts: [
        { optionId: 1, votes: 8 },
        { optionId: 2, votes: 7 },
        { optionId: 3, votes: 4 },
        { optionId: 4, votes: 2 },
      ],
      eliminated: [4],
      exhausted: 0,
      round: 1,
    },
    {
      continuingVotes: 21,
      counts: [
        { optionId: 2, votes: 9 },
        { optionId: 1, votes: 8 },
        { optionId: 3, votes: 4 },
      ],
      eliminated: [3],
      exhausted: 0,
      round: 2,
    },
    {
      continuingVotes: 20,
      counts: [
        { optionId: 2, votes: 12 },
        { optionId: 1, votes: 8 },
      ],
      eliminated: [],
      exhausted: 1,
      round: 3,
    },
  ],
};

const rowFor = (index: number, label: string) =>
  roundView(OPTIONS, COMEBACK, index).rows.find((row) => row.label === label)!;

describe('roundView', () => {
  it('splits a vote count into first choices and transfers', () => {
    expect(rowFor(2, 'Kyoto')).toMatchObject({
      change: 3,
      firstChoice: 7,
      status: 'winner',
      transferred: 5,
      votes: 12,
    });
    expect(rowFor(2, 'Kyoto').share).toBeCloseTo(0.6);
  });

  it('marks the options eliminated at the end of a round, and those out before it', () => {
    expect(rowFor(0, 'Reykjavík')).toMatchObject({ eliminatedIn: 1, status: 'eliminated-now' });
    expect(rowFor(1, 'Reykjavík')).toMatchObject({
      eliminatedIn: 1,
      status: 'eliminated-earlier',
      votes: 0,
    });
    expect(rowFor(1, 'Mexico City').status).toBe('eliminated-now');
  });

  it('lists the race first, then the eliminated, most recently out first', () => {
    const rows = roundView(OPTIONS, COMEBACK, 2).rows.map((row) => row.label);
    expect(rows).toEqual(['Kyoto', 'Lisbon', 'Mexico City', 'Reykjavík']);
  });

  it('has no change to report in round one', () => {
    expect(rowFor(0, 'Lisbon').change).toBeNull();
  });

  it('counts the ballots that ran out between rounds', () => {
    const view = roundView(OPTIONS, COMEBACK, 2);
    expect(view).toMatchObject({ exhausted: 1, isFinal: true, majority: 11, newlyExhausted: 1 });
  });

  it('refuses a round that does not exist', () => {
    expect(() => roundView(OPTIONS, COMEBACK, 3)).toThrow(RangeError);
  });
});

describe('describeOutcome', () => {
  it('names a winner and how far it came', () => {
    expect(describeOutcome(OPTIONS, COMEBACK)).toEqual({
      detail: '12 of 20 votes still counting (60%) after 2 rounds of eliminations.',
      headline: 'Kyoto wins',
    });
  });

  it('calls a first-round win a majority of first choices', () => {
    const tally: Tally = {
      ballots: 3,
      outcome: { kind: 'winner', optionId: 1, round: 1 },
      rounds: [
        {
          continuingVotes: 3,
          counts: [
            { optionId: 1, votes: 2 },
            { optionId: 2, votes: 1 },
          ],
          eliminated: [],
          exhausted: 0,
          round: 1,
        },
      ],
    };
    expect(describeOutcome(OPTIONS, tally).detail).toBe(
      'A majority of first choices: 2 of 3 votes (67%).',
    );
  });

  it('names every option in a tie', () => {
    const tally: Tally = {
      ballots: 4,
      outcome: { kind: 'tie', optionIds: [1, 2], round: 1 },
      rounds: [
        {
          continuingVotes: 4,
          counts: [
            { optionId: 1, votes: 2 },
            { optionId: 2, votes: 2 },
          ],
          eliminated: [],
          exhausted: 0,
          round: 1,
        },
      ],
    };
    expect(describeOutcome(OPTIONS, tally).headline).toBe('Tie between Lisbon and Kyoto');
    expect(describeOutcome(OPTIONS, tally).detail).toMatch(/^2 votes each in the first round\./);
  });
});

describe('describeRound', () => {
  it('explains an elimination', () => {
    expect(describeRound(OPTIONS, COMEBACK, 0)).toEqual([
      '21 votes counting; 11 is a majority.',
      'No majority, so Reykjavík — fewest votes — is eliminated. Its ballots move to their next choice.',
    ]);
  });

  it('explains exhausted ballots and the win', () => {
    expect(describeRound(OPTIONS, COMEBACK, 2)).toEqual([
      '1 ballot had no choices left and stopped counting.',
      '20 votes counting; 11 is a majority.',
      'Kyoto has a majority.',
    ]);
  });
});
