import type { TallyRequest } from 'src/api/types';

/**
 * The simulator's model: some candidates, and groups of voters who all cast
 * the same ranking — "4 voters ranked Maroon, then Cerulean" — which is much
 * quicker to edit than one ballot per voter.
 */

export interface Candidate {
  id: number;
  name: string;
}

export interface BallotGroup {
  id: number;
  voters: number;
  /** Candidate ids, most preferred first. */
  ranking: number[];
}

export interface Simulation {
  candidates: Candidate[];
  groups: BallotGroup[];
}

export interface Scenario extends Simulation {
  key: string;
  name: string;
  /** What to look for, in a sentence. */
  lesson: string;
}

export const MIN_CANDIDATES = 2;
export const MAX_CANDIDATES = 8;
export const MAX_GROUPS = 20;
export const MAX_VOTERS_PER_GROUP = 999;

const candidates = (...names: string[]): Candidate[] =>
  names.map((name, index) => ({ id: index + 1, name }));

const groups = (...entries: [number, number[]][]): BallotGroup[] =>
  entries.map(([voters, ranking], index) => ({ id: index + 1, ranking, voters }));

/** The one the simulator opens on: the reason ranked choice exists. */
export const DEFAULT_SCENARIO: Scenario = {
  candidates: candidates('Maroon', 'Cerulean', 'Violet'),
  groups: groups([4, [1]], [3, [2]], [2, [3, 2]]),
  key: 'comeback',
  lesson:
    'Maroon leads on first choices but has no majority. Violet is eliminated, its voters’ ' +
    'second choice is Cerulean, and Cerulean overtakes.',
  name: 'A comeback on transfers',
};

export const SCENARIOS: Scenario[] = [
  DEFAULT_SCENARIO,
  {
    candidates: candidates('Maroon', 'Cerulean', 'Violet'),
    groups: groups([5, [1]], [3, [2, 1]], [1, [3]]),
    key: 'majority',
    lesson: 'More than half of first choices is a win outright; second choices never come into it.',
    name: 'Settled in round one',
  },
  {
    candidates: candidates('Oak', 'Maple', 'Birch'),
    groups: groups([4, [1]], [3, [2]], [2, [3]]),
    key: 'exhausted',
    lesson:
      'Birch voters ranked nothing else, so their ballots stop counting when Birch is out. ' +
      'Oak wins with a majority of the votes still counting — not of every voter.',
    name: 'Ballots that run out',
  },
  {
    candidates: candidates('Reuben', 'BLT', 'Caprese'),
    groups: groups([2, [1]], [2, [2]], [1, [3]]),
    key: 'tie',
    lesson:
      'After Caprese is eliminated, the two left are level and nobody has a next choice to ' +
      'give. The count ends in a tie.',
    name: 'A dead heat',
  },
];

/** The next unused id in a list, for a newly added candidate or group. */
export function nextId(items: readonly { id: number }[]): number {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

/** The label a candidate shows under, even before it is named. */
export function candidateName(candidate: Candidate | undefined): string {
  const name = candidate?.name.trim() ?? '';
  return name === '' ? 'Unnamed candidate' : name;
}

/** Removes a candidate and every ranking of it, keeping the rest in order. */
export function removeCandidate(simulation: Simulation, id: number): Simulation {
  return {
    candidates: simulation.candidates.filter((candidate) => candidate.id !== id),
    groups: simulation.groups.map((group) => ({
      ...group,
      ranking: group.ranking.filter((ranked) => ranked !== id),
    })),
  };
}

/**
 * The simulation as a count request, or the reason it cannot be counted yet.
 * Groups that rank nobody, or have no voters, are left out rather than
 * treated as an error: they are usually a group halfway through being edited.
 */
export function toTallyRequest(
  simulation: Simulation,
): { error: string; request?: never } | { error?: never; request: TallyRequest } {
  if (simulation.candidates.length < MIN_CANDIDATES) {
    return { error: 'Add at least two candidates to run a count.' };
  }
  const ballots = simulation.groups
    .filter((group) => group.ranking.length > 0 && group.voters > 0)
    .map((group) => ({ count: group.voters, ranking: group.ranking }));
  if (ballots.length === 0) {
    return { error: 'Add a ballot group that ranks at least one candidate.' };
  }
  return {
    request: {
      ballots,
      optionIds: simulation.candidates.map((candidate) => candidate.id),
    },
  };
}
