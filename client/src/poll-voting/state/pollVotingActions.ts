import { action } from 'typesafe-actions';
import { Poll } from '~/polling/types/Poll';

export enum PollVotingActionTypeKeys {
    GET_POLL = 'GET_POLL',
    GET_POLL_SUCCESS = 'GET_POLL_SUCCESS',
    GET_POLL_FAILURE = 'GET_POLL_FAILURE',
}

const getPoll = {
    request: (link: string) => action(PollVotingActionTypeKeys.GET_POLL, link),
    success: (poll: Poll) => action(PollVotingActionTypeKeys.GET_POLL_SUCCESS, poll),
    failure: (error: Error) => action(PollVotingActionTypeKeys.GET_POLL_FAILURE, error),
};

export const pollVotingActions = {
    getPoll,
};
