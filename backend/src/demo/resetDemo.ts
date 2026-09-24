import { deletePoll, EXAMPLE_LINK, type Sql, seedExamplePoll } from './examplePoll';

/** How long a poll someone creates on the public demo is kept. */
export const POLL_RETENTION_DAYS = 30;

export interface ResetReport {
  /** Links of the polls deleted for being older than the retention period. */
  expired: string[];
}

/**
 * The public demo's nightly tidy-up, in one transaction (the caller's):
 *
 * - The example poll goes back to its 21 seeded ballots. Visitors' votes on
 *   it would otherwise pile up until the story it tells — Kyoto overtaking
 *   Lisbon on transfers — stopped being true.
 * - Polls visitors created are kept for POLL_RETENTION_DAYS, then deleted.
 *   Not nightly: creating a poll and sharing the link is the point of the
 *   app, and a link that dies at four in the morning is a broken demo.
 *
 * The example poll is deleted and re-created rather than having its ballots
 * swapped, so it comes back exactly as a fresh database has it.
 */
export async function resetDemo(sql: Sql): Promise<ResetReport> {
  await deletePoll(sql, EXAMPLE_LINK);
  await seedExamplePoll(sql);

  const expired = (await sql.query(
    `select link from public.polls
     where link <> $1 and date_created < current_date - $2::int`,
    [EXAMPLE_LINK, POLL_RETENTION_DAYS],
  )) as { link: string }[];
  for (const { link } of expired) await deletePoll(sql, link);

  return { expired: expired.map(({ link }) => link) };
}
