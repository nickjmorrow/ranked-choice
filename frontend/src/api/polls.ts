import { apiFetch } from 'src/api/client';
import type { BallotRequest, NewPoll, Poll, PollResults, Tally, TallyRequest } from 'src/api/types';

export const getPoll = (link: string) => apiFetch<Poll>(`/polls/${encodeURIComponent(link)}`);

export const getResults = (link: string) =>
  apiFetch<PollResults>(`/polls/${encodeURIComponent(link)}/results`);

export const createPoll = (poll: NewPoll) =>
  apiFetch<{ link: string }>('/polls', { body: JSON.stringify(poll), method: 'POST' });

export const castBallot = (link: string, ballot: BallotRequest) =>
  apiFetch<undefined>(`/polls/${encodeURIComponent(link)}/ballots`, {
    body: JSON.stringify(ballot),
    method: 'POST',
  });

export const countBallots = (request: TallyRequest, signal?: AbortSignal) =>
  apiFetch<Tally>('/tally', { body: JSON.stringify(request), method: 'POST', signal });
