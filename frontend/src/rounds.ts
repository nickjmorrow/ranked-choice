import type { Option, Tally } from 'src/api/types';
import { listJoin, percent, plural } from 'src/format';

/**
 * What the results chart shows for one round of a count: a row per option,
 * split into the votes it had from the start and the votes it has gained by
 * transfer, with its standing in that round.
 */

export type RowStatus =
  /** Out of the race before this round. */
  | 'eliminated-earlier'
  /** In this round, and eliminated at its end. */
  | 'eliminated-now'
  | 'continuing'
  | 'tied'
  | 'winner';

export interface OptionRow {
  optionId: number;
  label: string;
  sublabel: string | null;
  status: RowStatus;
  /** Votes this round; 0 once eliminated. */
  votes: number;
  /** The share of the round's continuing votes, 0–1. */
  share: number;
  /** Of `votes`, how many were first choices in round one. */
  firstChoice: number;
  /** Of `votes`, how many arrived from eliminated options since. */
  transferred: number;
  /** Votes gained since the previous round; null in round one or once out. */
  change: number | null;
  /** The round at whose end this option was eliminated, if it has been by now. */
  eliminatedIn: number | null;
}

export interface RoundView {
  round: number;
  isFinal: boolean;
  continuingVotes: number;
  /** Votes needed for a majority this round. */
  majority: number;
  exhausted: number;
  /** Ballots that ran out of choices during the previous round's transfers. */
  newlyExhausted: number;
  /** Options in the race, most votes first, then those already out, latest first. */
  rows: OptionRow[];
}

export function roundView(options: readonly Option[], tally: Tally, index: number): RoundView {
  const round = tally.rounds[index];
  if (round === undefined) throw new RangeError(`No round ${String(index + 1)}.`);
  const first = tally.rounds[0] ?? round;
  const previous = index > 0 ? tally.rounds[index - 1] : undefined;
  const isFinal = index === tally.rounds.length - 1;

  const eliminatedIn = new Map<number, number>();
  const soFar = tally.rounds.slice(0, index + 1);
  for (const earlier of soFar) {
    for (const id of earlier.eliminated) eliminatedIn.set(id, earlier.round);
  }

  const byId = new Map(options.map((option) => [option.optionId, option]));
  const votesIn = (r: typeof round | undefined, id: number) =>
    r?.counts.find((count) => count.optionId === id)?.votes;

  const statusOf = (id: number): RowStatus => {
    if (round.eliminated.includes(id)) return 'eliminated-now';
    if (isFinal && tally.outcome.kind === 'winner' && tally.outcome.optionId === id) {
      return 'winner';
    }
    if (isFinal && tally.outcome.kind === 'tie' && tally.outcome.optionIds.includes(id)) {
      return 'tied';
    }
    return 'continuing';
  };

  const inRace: OptionRow[] = round.counts.map(({ optionId, votes }) => {
    const option = byId.get(optionId);
    const firstChoice = Math.min(votesIn(first, optionId) ?? 0, votes);
    const before = votesIn(previous, optionId);
    return {
      optionId,
      label: option?.label ?? 'Unknown option',
      sublabel: option?.sublabel ?? null,
      status: statusOf(optionId),
      votes,
      share: round.continuingVotes === 0 ? 0 : votes / round.continuingVotes,
      firstChoice,
      transferred: votes - firstChoice,
      change: before === undefined ? null : votes - before,
      eliminatedIn: eliminatedIn.get(optionId) ?? null,
    };
  });

  const out: OptionRow[] = options
    .filter((option) => round.counts.every((count) => count.optionId !== option.optionId))
    .map((option) => ({
      optionId: option.optionId,
      label: option.label,
      sublabel: option.sublabel,
      status: 'eliminated-earlier' as const,
      votes: 0,
      share: 0,
      firstChoice: 0,
      transferred: 0,
      change: null,
      eliminatedIn: eliminatedIn.get(option.optionId) ?? null,
    }))
    .toSorted((a, b) => (b.eliminatedIn ?? 0) - (a.eliminatedIn ?? 0));

  return {
    round: round.round,
    isFinal,
    continuingVotes: round.continuingVotes,
    majority: Math.floor(round.continuingVotes / 2) + 1,
    exhausted: round.exhausted,
    newlyExhausted: round.exhausted - (previous?.exhausted ?? 0),
    rows: [...inRace, ...out],
  };
}

export interface OutcomeText {
  headline: string;
  detail: string;
}

/** The count's result in a sentence, for the top of a question's results. */
export function describeOutcome(options: readonly Option[], tally: Tally): OutcomeText {
  const label = labeller(options);
  const { outcome } = tally;
  const rounds = tally.rounds.length;

  switch (outcome.kind) {
    case 'no-votes': {
      return { headline: 'No ballots yet', detail: 'Results appear once someone votes.' };
    }
    case 'tie': {
      const round = roundAt(tally, outcome.round - 1);
      const each = round.counts.find((count) => count.optionId === outcome.optionIds[0])?.votes;
      return {
        headline: `Tie between ${listJoin(outcome.optionIds.map((id) => label(id)))}`,
        detail:
          `${plural(each ?? 0, 'vote')} each in ${roundName(outcome.round, rounds)}. ` +
          'Eliminating the last place would eliminate them all, so the count stops here.',
      };
    }
    case 'winner': {
      const round = roundAt(tally, outcome.round - 1);
      const votes = round.counts.find((count) => count.optionId === outcome.optionId)?.votes ?? 0;
      const share = `${String(votes)} of ${String(round.continuingVotes)}`;
      return {
        headline: `${label(outcome.optionId)} wins`,
        detail:
          outcome.round === 1
            ? `A majority of first choices: ${share} votes (${percent(votes, round.continuingVotes)}).`
            : `${share} votes still counting (${percent(votes, round.continuingVotes)}) ` +
              `after ${plural(outcome.round - 1, 'round')} of eliminations.`,
      };
    }
  }
}

/** What happened in one round, as sentences, for beneath the chart. */
export function describeRound(options: readonly Option[], tally: Tally, index: number): string[] {
  const view = roundView(options, tally, index);
  const label = labeller(options);
  const round = roundAt(tally, index);
  const lines =
    view.newlyExhausted > 0
      ? [`${plural(view.newlyExhausted, 'ballot')} had no choices left and stopped counting.`]
      : [];

  lines.push(
    `${plural(view.continuingVotes, 'vote')} counting; ${String(view.majority)} is a majority.`,
  );

  if (round.eliminated.length > 0) {
    const names = listJoin(round.eliminated.map((id) => label(id)));
    lines.push(
      round.eliminated.length === 1
        ? `No majority, so ${names} — fewest votes — is eliminated. Its ballots move to their next choice.`
        : `No majority, so ${names} — tied for fewest votes — are all eliminated. Their ballots move to their next choice.`,
    );
  } else if (tally.outcome.kind === 'winner') {
    lines.push(`${label(tally.outcome.optionId)} has a majority.`);
  } else if (tally.outcome.kind === 'tie') {
    lines.push('Every option left has the same number of votes.');
  }

  return lines;
}

function roundAt(tally: Tally, index: number) {
  const round = tally.rounds[index];
  if (round === undefined) throw new RangeError(`No round ${String(index + 1)}.`);
  return round;
}

function labeller(options: readonly Option[]) {
  const labels = new Map(options.map((option) => [option.optionId, option.label]));
  return (id: number) => labels.get(id) ?? 'Unknown option';
}

function roundName(round: number, total: number): string {
  return total === 1 ? 'the first round' : `round ${String(round)}`;
}
