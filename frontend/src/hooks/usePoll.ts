import { useQuery } from '@tanstack/react-query';
import { getPoll } from 'src/api/polls';

/** A poll's questions and options. They never change once created. */
export default function usePoll(link: string) {
  return useQuery({
    queryFn: () => getPoll(link),
    queryKey: ['poll', link],
    staleTime: Infinity,
  });
}
