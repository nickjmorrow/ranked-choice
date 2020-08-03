import { action } from 'typesafe-actions';
import { Poll } from '~/polling/types/Poll';
import { QuestionWithVote, OrderedOption, FilledOrderedOption } from '~/poll-voting/types/QuestionWithVote';
import { Option } from '~/polling/types/Option';
import { PollVoteRequest } from '~/poll-voting/types/PollVoteRequest';
import { Question } from '~/polling/types/Question';

export enum PollVotingActionTypeKeys {
    GET_POLL = 'GET_POLL',
    GET_POLL_SUCCESS = 'GET_POLL_SUCCESS',
    GET_POLL_FAILURE = 'GET_POLL_FAILURE',
    SELECT_OPTION = 'SELECT_OPTION',
    VOTE_ON_POLL = 'VOTE_ON_POLL',
    VOTE_ON_POLL_SUCCESS = 'VOTE_ON_POLL_SUCCESS',
    VOTE_ON_POLL_FAILURE = 'VOTE_ON_POLL_FAILURE',
    REORDER_OPTION = 'REORDER_OPTION',
}

const getPoll = {
    request: (link: string) => action(PollVotingActionTypeKeys.GET_POLL, link),
    success: (poll: Poll) => action(PollVotingActionTypeKeys.GET_POLL_SUCCESS, poll),
    failure: (error: Error) => action(PollVotingActionTypeKeys.GET_POLL_FAILURE, error),
};

const selectOption = (payload: { question: QuestionWithVote; option: Option }) =>
    action(PollVotingActionTypeKeys.SELECT_OPTION, payload);

const voteOnPoll = {
    request: (pollVoteRequest: PollVoteRequest) => action(PollVotingActionTypeKeys.VOTE_ON_POLL, pollVoteRequest),
    success: () => action(PollVotingActionTypeKeys.VOTE_ON_POLL_SUCCESS),
    failure: (error: Error) => action(PollVotingActionTypeKeys.VOTE_ON_POLL_FAILURE, error),
};

const reorderOption = ({
    question,
    option,
    newOrderId,
}: {
    question: QuestionWithVote;
    option: FilledOrderedOption;
    newOrderId: number;
}) => action(PollVotingActionTypeKeys.REORDER_OPTION, { question, option, newOrderId });

export const pollVotingActions = {
    getPoll,
    selectOption,
    voteOnPoll,
    reorderOption,
};
