import { Poll } from '~/polling/types/Poll';

export interface CreatePollRequest {
    poll: Omit<Poll, 'pollId' | 'link'>;
}
