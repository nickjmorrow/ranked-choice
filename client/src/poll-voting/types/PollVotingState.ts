import { PollWithVotes } from '~/poll-voting/types/PollWithVotes';

export interface PollVotingState {
    poll: PollWithVotes | null;
}
