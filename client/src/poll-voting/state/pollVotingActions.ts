import { action } from 'typesafe-actions';
import { Poll } from '~/polling/types/Poll';
import { QuestionWithVote } from '~/poll-voting/types/QuestionWithVote';
import { Option } from '~/polling/types/Option';

export enum PollVotingActionTypeKeys {
    GET_POLL = 'GET_POLL',
    GET_POLL_SUCCESS = 'GET_POLL_SUCCESS',
    GET_POLL_FAILURE = 'GET_POLL_FAILURE',
    SELECT_OPTION = 'SELECT_OPTION',
}

const getPoll = {
    request: (link: string) => action(PollVotingActionTypeKeys.GET_POLL, link),
    success: (poll: Poll) => action(PollVotingActionTypeKeys.GET_POLL_SUCCESS, poll),
    failure: (error: Error) => action(PollVotingActionTypeKeys.GET_POLL_FAILURE, error),
};

const selectOption = (payload: { question: QuestionWithVote; option: Option }) =>
    action(PollVotingActionTypeKeys.SELECT_OPTION, payload);

export const pollVotingActions = {
    getPoll,
    selectOption,
};
