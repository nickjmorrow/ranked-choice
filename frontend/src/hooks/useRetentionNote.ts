import { useQuery } from '@tanstack/react-query';
import { getMeta } from 'src/api/polls';

/**
 * On the public demo, a sentence saying how long a new poll is kept; null
 * anywhere else, or until the server has said. A failed request shows nothing
 * rather than an error: the note is a courtesy, not something to retry at.
 */
export default function useRetentionNote(): null | string {
  const meta = useQuery({
    queryFn: getMeta,
    queryKey: ['meta'],
    retry: false,
    staleTime: Infinity,
  });
  const days = meta.data?.pollRetentionDays ?? null;
  return days === null
    ? null
    : `This is a public demo: polls are deleted after ${String(days)} days.`;
}
