import { useMutation, useQueryClient } from '@tanstack/react-query';
import { castBallot } from 'src/api/polls';
import type { BallotRequest } from 'src/api/types';

export default function useCastBallot(link: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ballot: BallotRequest) => castBallot(link, ballot),
    // The results page is where a voter goes next; it should include them.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['results', link] }),
  });
}
