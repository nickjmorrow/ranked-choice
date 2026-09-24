import { describe, expect, it } from 'vitest';
import { addToRanking, moveInRanking, removeFromRanking, unranked } from 'src/ranking';

describe('addToRanking', () => {
  it('appends as the next choice', () => {
    expect(addToRanking([3, 1], 2)).toEqual([3, 1, 2]);
  });

  it('ignores an option already ranked', () => {
    expect(addToRanking([3, 1], 3)).toEqual([3, 1]);
  });
});

describe('removeFromRanking', () => {
  it('closes the gap it leaves', () => {
    expect(removeFromRanking([3, 1, 2], 1)).toEqual([3, 2]);
  });
});

describe('moveInRanking', () => {
  it('moves up and down', () => {
    expect(moveInRanking([1, 2, 3], 3, 0)).toEqual([3, 1, 2]);
    expect(moveInRanking([1, 2, 3], 1, 2)).toEqual([2, 3, 1]);
  });

  it('clamps to the ends of the list', () => {
    expect(moveInRanking([1, 2, 3], 2, -1)).toEqual([2, 1, 3]);
    expect(moveInRanking([1, 2, 3], 2, 99)).toEqual([1, 3, 2]);
  });

  it('leaves the ranking alone for an option not in it', () => {
    expect(moveInRanking([1, 2], 9, 0)).toEqual([1, 2]);
  });
});

describe('unranked', () => {
  it('keeps the poll’s own order', () => {
    const options = [{ optionId: 1 }, { optionId: 2 }, { optionId: 3 }, { optionId: 4 }];
    expect(unranked(options, [3, 1]).map((option) => option.optionId)).toEqual([2, 4]);
  });
});
