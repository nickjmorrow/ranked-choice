/**
 * A ballot's ranking for one question: option ids, most preferred first. Every
 * change returns a new array, so it can be React state as it is.
 */

export function addToRanking(ranking: readonly number[], optionId: number): number[] {
  return ranking.includes(optionId) ? [...ranking] : [...ranking, optionId];
}

export function removeFromRanking(ranking: readonly number[], optionId: number): number[] {
  return ranking.filter((id) => id !== optionId);
}

/** Moves an option to `toIndex`, clamped to the list. Unknown ids change nothing. */
export function moveInRanking(
  ranking: readonly number[],
  optionId: number,
  toIndex: number,
): number[] {
  const from = ranking.indexOf(optionId);
  if (from === -1) return [...ranking];
  const next = ranking.filter((id) => id !== optionId);
  const to = Math.max(0, Math.min(toIndex, next.length));
  next.splice(to, 0, optionId);
  return next;
}

/** The options not yet ranked, in the order the poll lists them. */
export function unranked<T extends { optionId: number }>(
  options: readonly T[],
  ranking: readonly number[],
): T[] {
  return options.filter((option) => !ranking.includes(option.optionId));
}
