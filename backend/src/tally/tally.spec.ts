import { type Ballot, tally, TallyError } from './tally';

/** `ballots(['1', 4], ['3 1', 2])`: four voters ranked 1 only; two ranked 3 then 1. */
function ballots(...groups: [string, number][]): Ballot[] {
  return groups.map(([ranking, count]) => ({
    ranking: ranking === '' ? [] : ranking.split(' ').map(Number),
    count,
  }));
}

/** Each round as `{ optionId: votes }`, which reads better than the arrays. */
function countsByRound(result: ReturnType<typeof tally>) {
  return result.rounds.map((round) =>
    Object.fromEntries(round.counts.map((count) => [count.optionId, count.votes])),
  );
}

describe('tally', () => {
  it('declares a first-round majority without further rounds', () => {
    const result = tally([1, 2], ballots(['1', 1], ['2', 2]));

    expect(countsByRound(result)).toEqual([{ 1: 1, 2: 2 }]);
    expect(result.outcome).toEqual({ kind: 'winner', optionId: 2, round: 1 });
    expect(result.rounds[0]!.eliminated).toEqual([]);
  });

  it('transfers an eliminated option’s ballots to their next choice', () => {
    const result = tally([1, 2, 3], ballots(['1', 4], ['2', 3], ['3 2', 2]));

    expect(countsByRound(result)).toEqual([
      { 1: 4, 2: 3, 3: 2 },
      { 1: 4, 2: 5 },
    ]);
    expect(result.rounds[0]!.eliminated).toEqual([3]);
    // The first-round leader loses: the point of ranked choice.
    expect(result.outcome).toEqual({ kind: 'winner', optionId: 2, round: 2 });
  });

  it('needs a majority, not a plurality', () => {
    const result = tally([1, 2, 3], ballots(['1', 3], ['2', 2], ['3', 1]));

    expect(countsByRound(result)).toEqual([
      { 1: 3, 2: 2, 3: 1 },
      { 1: 3, 2: 2 },
    ]);
    // 3 of 6 is not a majority; 3 of the 5 still counting is.
    expect(result.rounds[1]!.exhausted).toBe(1);
    expect(result.outcome).toEqual({ kind: 'winner', optionId: 1, round: 2 });
  });

  it('measures the majority against ballots still counting, not all ballots', () => {
    const result = tally(
      [1, 2, 3, 4],
      ballots(['1', 8], ['2', 7], ['3 2', 2], ['4 3', 4], ['4', 1]),
    );

    expect(countsByRound(result)).toEqual([
      { 1: 8, 2: 7, 4: 5, 3: 2 },
      { 1: 8, 2: 9, 4: 5 },
      { 1: 8, 2: 9 },
    ]);
    // Round three: 5 ballots for option 4 go nowhere, so 17 are still counting.
    expect(result.rounds[2]).toMatchObject({ continuingVotes: 17, exhausted: 5 });
    expect(result.outcome).toEqual({ kind: 'winner', optionId: 2, round: 3 });
  });

  it('reports a tie when every option still receiving votes has the same count', () => {
    const result = tally([1, 2, 3], ballots(['1', 2], ['2', 2], ['3', 1]));

    expect(countsByRound(result)).toEqual([
      { 1: 2, 2: 2, 3: 1 },
      { 1: 2, 2: 2 },
    ]);
    expect(result.outcome).toEqual({ kind: 'tie', optionIds: [1, 2], round: 2 });
  });

  it('eliminates every option tied for last place at once', () => {
    const result = tally([1, 2, 3, 4], ballots(['1', 4], ['2', 3], ['3 2', 1], ['4 1', 1]));

    expect(result.rounds[0]!.eliminated).toEqual([3, 4]);
    expect(countsByRound(result)[1]).toEqual({ 1: 5, 2: 4 });
  });

  it('eliminates options nobody ranked first', () => {
    const result = tally([1, 2, 3], ballots(['1', 2], ['2', 1]));

    expect(result.outcome).toEqual({ kind: 'winner', optionId: 1, round: 1 });

    const three = tally([1, 2, 3, 4], ballots(['1', 2], ['2', 2], ['3', 1]));
    expect(three.rounds[0]!.eliminated).toEqual([4]);
  });

  it('reports no votes when nothing was ranked', () => {
    const result = tally([1, 2], ballots(['', 3]));

    expect(result.outcome).toEqual({ kind: 'no-votes' });
    expect(result.ballots).toBe(0);
    expect(result.rounds).toHaveLength(1);
  });

  it('counts a ballot group once per voter', () => {
    const result = tally([1, 2], ballots(['1', 1], ['2', 1], ['2 1', 0]));

    expect(result.ballots).toBe(2);
    expect(result.outcome).toEqual({ kind: 'tie', optionIds: [1, 2], round: 1 });
  });

  it('lists tied counts in the order the options were given', () => {
    const result = tally([7, 3, 5], ballots(['5', 1], ['3', 1], ['7', 1]));

    expect(result.rounds[0]!.counts.map((count) => count.optionId)).toEqual([7, 3, 5]);
  });

  describe('rejects input it cannot count', () => {
    it.each([
      [[], [], 'A count needs at least two options, but got 0.'],
      [[1], [], 'A count needs at least two options, but got 1.'],
      [[1, 2, 2, 3, 3], [], 'Option ids must be distinct; repeated: 2, 3.'],
      [[7, 8], ballots(['4 3', 1]), 'A ballot ranks options that do not exist: 3, 4.'],
      [[1, 2], ballots(['1 1', 1]), 'A ballot ranks the same option more than once.'],
      [[1, 2], ballots(['1', -1]), 'A ballot count must be a whole number, zero or more.'],
    ])('%j with %j', (optionIds, input, message) => {
      expect(() => tally(optionIds, input)).toThrow(new TallyError(message));
    });
  });
});
