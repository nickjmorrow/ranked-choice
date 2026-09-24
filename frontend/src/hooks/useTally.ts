import { keepPreviousData, skipToken, useQuery } from '@tanstack/react-query';
import { countBallots } from 'src/api/polls';
import type { TallyRequest } from 'src/api/types';
import useDebouncedValue from 'src/hooks/useDebouncedValue';

/**
 * The simulator's live count. The request is debounced so typing a candidate's
 * name is one request, not one per keystroke, and the previous result stays on
 * screen while the next is on its way — the chart updates rather than flashes.
 *
 * Debounced as JSON rather than as the object: the caller builds a new request
 * object on every render, and an identity that always changes would restart
 * the timer on every render and never settle.
 *
 * The count runs on the server, so the simulator and a real poll's results can
 * never disagree about the rules.
 */
export default function useTally(request: null | TallyRequest) {
  const settled = useDebouncedValue(request === null ? null : JSON.stringify(request), 200);
  return useQuery({
    placeholderData: keepPreviousData,
    queryFn:
      settled === null
        ? skipToken
        : ({ signal }) => countBallots(JSON.parse(settled) as TallyRequest, signal),
    queryKey: ['tally', settled],
    staleTime: Infinity,
  });
}
