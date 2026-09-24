import { describe, expect, it } from 'vitest';
import { listJoin, ordinal, percent, plural } from 'src/format';

describe('percent', () => {
  it('rounds to a whole percent', () => {
    expect(percent(12, 20)).toBe('60%');
    expect(percent(1, 3)).toBe('33%');
  });

  it('is 0% of nothing rather than NaN', () => {
    expect(percent(0, 0)).toBe('0%');
  });
});

describe('plural', () => {
  it('uses the singular only for one', () => {
    expect(plural(1, 'ballot')).toBe('1 ballot');
    expect(plural(0, 'ballot')).toBe('0 ballots');
    expect(plural(1200, 'vote')).toBe('1,200 votes');
  });
});

describe('ordinal', () => {
  it.each([
    [1, '1st'],
    [2, '2nd'],
    [3, '3rd'],
    [4, '4th'],
    [11, '11th'],
    [12, '12th'],
    [13, '13th'],
    [21, '21st'],
    [112, '112th'],
  ])('%i is %s', (n, expected) => {
    expect(ordinal(n)).toBe(expected);
  });
});

describe('listJoin', () => {
  it('joins the way a sentence would', () => {
    expect(listJoin([])).toBe('');
    expect(listJoin(['Kyoto'])).toBe('Kyoto');
    expect(listJoin(['Kyoto', 'Lisbon'])).toBe('Kyoto and Lisbon');
    expect(listJoin(['A', 'B', 'C'])).toBe('A, B and C');
  });
});
