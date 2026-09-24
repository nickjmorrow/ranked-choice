import { useQuery } from '@tanstack/react-query';
import { getResults } from 'src/api/polls';

/**
 * A poll's results. Refetched every 15 seconds while the page is open, so a
 * results page left on a screen during a vote keeps up without a reload.
 */
export default function usePollResults(link: string) {
  return useQuery({
    queryFn: () => getResults(link),
    queryKey: ['results', link],
    refetchInterval: 15_000,
  });
}
