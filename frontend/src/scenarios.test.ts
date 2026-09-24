import { describe, expect, it } from 'vitest';
import {
  candidateName,
  nextId,
  removeCandidate,
  SCENARIOS,
  type Simulation,
  toTallyRequest,
} from 'src/scenarios';

const SIMULATION: Simulation = {
  candidates: [
    { id: 1, name: 'Maroon' },
    { id: 2, name: 'Cerulean' },
    { id: 3, name: 'Violet' },
  ],
  groups: [
    { id: 1, ranking: [1, 3], voters: 4 },
    { id: 2, ranking: [3, 2], voters: 2 },
    { id: 3, ranking: [], voters: 5 },
    { id: 4, ranking: [2], voters: 0 },
  ],
};

describe('toTallyRequest', () => {
  it('sends only the groups that rank someone and have voters', () => {
    expect(toTallyRequest(SIMULATION)).toEqual({
      request: {
        ballots: [
          { count: 4, ranking: [1, 3] },
          { count: 2, ranking: [3, 2] },
        ],
        optionIds: [1, 2, 3],
      },
    });
  });

  it('explains what is missing instead of sending an uncountable request', () => {
    expect(
      toTallyRequest({ ...SIMULATION, candidates: SIMULATION.candidates.slice(0, 1) }),
    ).toEqual({ error: 'Add at least two candidates to run a count.' });
    expect(toTallyRequest({ ...SIMULATION, groups: [] })).toEqual({
      error: 'Add a ballot group that ranks at least one candidate.',
    });
  });
});

describe('removeCandidate', () => {
  it('removes the candidate from every ranking, closing the gap', () => {
    const next = removeCandidate(SIMULATION, 3);
    expect(next.candidates.map((candidate) => candidate.id)).toEqual([1, 2]);
    expect(next.groups.map((group) => group.ranking)).toEqual([[1], [2], [], [2]]);
  });
});

describe('nextId', () => {
  it('is one past the largest id in use', () => {
    expect(nextId([{ id: 1 }, { id: 7 }, { id: 3 }])).toBe(8);
    expect(nextId([])).toBe(1);
  });
});

describe('candidateName', () => {
  it('stands in for a blank name', () => {
    expect(candidateName({ id: 1, name: '  ' })).toBe('Unnamed candidate');
    expect(candidateName({ id: 1, name: ' Oak ' })).toBe('Oak');
  });
});

describe('the preset scenarios', () => {
  it.each(SCENARIOS.map((scenario) => [scenario.key, scenario]))(
    '%s only ranks its own candidates, and can be counted',
    (_key, scenario) => {
      const ids = new Set(scenario.candidates.map((candidate) => candidate.id));
      for (const group of scenario.groups) {
        expect(group.ranking.every((id) => ids.has(id))).toBe(true);
      }
      expect(toTallyRequest(scenario).request).toBeDefined();
    },
  );

  it('have distinct keys', () => {
    const keys = SCENARIOS.map((scenario) => scenario.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
