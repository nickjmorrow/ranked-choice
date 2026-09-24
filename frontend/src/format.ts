/** Small, pure text helpers. English only. */

export function percent(part: number, whole: number): string {
  if (whole === 0) return '0%';
  return `${String(Math.round((part / whole) * 100))}%`;
}

export function plural(count: number, singular: string, pluralForm = `${singular}s`): string {
  return `${count.toLocaleString('en-US')} ${count === 1 ? singular : pluralForm}`;
}

export function ordinal(n: number): string {
  const lastTwo = n % 100;
  if (lastTwo >= 11 && lastTwo <= 13) return `${n}th`;
  switch (n % 10) {
    case 1: {
      return `${n}st`;
    }
    case 2: {
      return `${n}nd`;
    }
    case 3: {
      return `${n}rd`;
    }
    default: {
      return `${n}th`;
    }
  }
}

/** "A", "A and B", "A, B and C". */
export function listJoin(items: readonly string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items.at(-1) ?? ''}`;
}
