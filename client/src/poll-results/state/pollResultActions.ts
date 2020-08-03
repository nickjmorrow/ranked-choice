import { action } from 'typesafe-actions';
import { PollResult } from '~/poll-results/types/PollResult';

export enum PollResultActionTypeKeys {
    GET_POLL_RESULT = 'GET_POLL_RESULT',
    GET_POLL_RESULT_SUCCESS = 'GET_POLL_RESULT_SUCCESS',
    GET_POLL_RESULT_FAILURE = 'GET_POLL_RESULT_FAILURE',
}

const getPollResult = {
    request: (link: string) => action(PollResultActionTypeKeys.GET_POLL_RESULT, link),
    success: (pollResult: PollResult) => action(PollResultActionTypeKeys.GET_POLL_RESULT_SUCCESS, pollResult),
    failure: (error: Error) => action(PollResultActionTypeKeys.GET_POLL_RESULT_FAILURE, error),
};

export const pollResultActions = { getPollResult };
