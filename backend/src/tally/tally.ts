/**
 * Instant-runoff counting, as a pure function: no Nest, no database.
 *
 * Every round, each ballot counts once — for its highest-ranked option that is
 * still in the race. A ballot whose ranked options have all been eliminated is
 * "exhausted" and stops counting. An option with more than half of the votes
 * still counting wins. Otherwise the option(s) with the fewest votes are
 * eliminated and the next round is counted.
 *
 * Two deliberate simplifications, both visible in the results:
 *
 * - Ties for last place are eliminated together, rather than broken by lot or
 *   by an earlier round's count.
 * - If every option still receiving votes has the same number of them, the
 *   count stops and reports a tie, rather than eliminating everyone.
 */

export interface Ballot {
  /** Option ids, most preferred first. May rank any subset of the options. */
  ranking: readonly number[];
  /** How many voters cast exactly this ballot. */
  count: number;
}

export interface OptionCount {
  optionId: number;
  votes: number;
}

export interface Round {
  round: number;
  /** One entry per option still in the race, most votes first. */
  counts: OptionCount[];
  /** Votes still counting this round: the denominator for a majority. */
  continuingVotes: number;
  /** Ballots with no continuing option left on them. */
  exhausted: number;
  /** Options eliminated at the end of this round. Empty in the final round. */
  eliminated: number[];
}

export type Outcome =
  | { kind: 'winner'; optionId: number; round: number }
  | { kind: 'tie'; optionIds: number[]; round: number }
  | { kind: 'no-votes' };

export interface Tally {
  rounds: Round[];
  outcome: Outcome;
  /** Ballots that ranked at least one option. Blank ballots are not counted. */
  ballots: number;
}

/** The input cannot be counted. The message is safe to show to a user. */
export class TallyError extends Error {}

export function tally(optionIds: readonly number[], ballots: readonly Ballot[]): Tally {
  validate(optionIds, ballots);

  const counted = ballots.filter((ballot) => ballot.ranking.length > 0 && ballot.count > 0);
  const totalBallots = sum(counted.map((ballot) => ballot.count));
  // Ties in a count are listed in the order the options were given, so the
  // same input always renders the same way.
  const position = new Map(optionIds.map((id, index) => [id, index]));
  const continuing = new Set(optionIds);
  const rounds: Round[] = [];

  for (let roundNumber = 1; ; roundNumber += 1) {
    const votes = new Map<number, number>([...continuing].map((id) => [id, 0]));
    let exhausted = 0;

    for (const ballot of counted) {
      const choice = ballot.ranking.find((id) => continuing.has(id));
      if (choice === undefined) {
        exhausted += ballot.count;
      } else {
        votes.set(choice, (votes.get(choice) ?? 0) + ballot.count);
      }
    }

    const counts = [...votes]
      .map(([optionId, count]) => ({ optionId, votes: count }))
      .sort((a, b) => b.votes - a.votes || position.get(a.optionId)! - position.get(b.optionId)!);
    const continuingVotes = sum(counts.map((count) => count.votes));
    const round: Round = { round: roundNumber, counts, continuingVotes, exhausted, eliminated: [] };
    rounds.push(round);

    if (continuingVotes === 0) {
      return { rounds, outcome: { kind: 'no-votes' }, ballots: totalBallots };
    }

    const leader = counts[0]!;
    if (leader.votes * 2 > continuingVotes) {
      return {
        rounds,
        outcome: { kind: 'winner', optionId: leader.optionId, round: roundNumber },
        ballots: totalBallots,
      };
    }

    const withVotes = counts.filter((count) => count.votes > 0);
    if (withVotes.every((count) => count.votes === leader.votes)) {
      return {
        rounds,
        outcome: {
          kind: 'tie',
          optionIds: withVotes.map((count) => count.optionId),
          round: roundNumber,
        },
        ballots: totalBallots,
      };
    }

    // Not everyone is tied, so this never eliminates every continuing option,
    // and each round removes at least one: the loop ends within
    // `optionIds.length` rounds.
    const fewest = Math.min(...counts.map((count) => count.votes));
    round.eliminated = counts
      .filter((count) => count.votes === fewest)
      .map((count) => count.optionId);
    for (const id of round.eliminated) continuing.delete(id);
  }
}

function validate(optionIds: readonly number[], ballots: readonly Ballot[]) {
  if (optionIds.length < 2) {
    throw new TallyError(`A count needs at least two options, but got ${optionIds.length}.`);
  }

  const known = new Set(optionIds);
  if (known.size !== optionIds.length) {
    const duplicates = optionIds.filter((id, index) => optionIds.indexOf(id) !== index);
    throw new TallyError(
      `Option ids must be distinct; repeated: ${unique(duplicates).join(', ')}.`,
    );
  }

  for (const ballot of ballots) {
    const unknown = ballot.ranking.filter((id) => !known.has(id));
    if (unknown.length > 0) {
      throw new TallyError(
        `A ballot ranks options that do not exist: ${unique(unknown).join(', ')}.`,
      );
    }
    if (new Set(ballot.ranking).size !== ballot.ranking.length) {
      throw new TallyError('A ballot ranks the same option more than once.');
    }
    if (!Number.isInteger(ballot.count) || ballot.count < 0) {
      throw new TallyError('A ballot count must be a whole number, zero or more.');
    }
  }
}

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);
const unique = (values: number[]) => [...new Set(values)].sort((a, b) => a - b);
