import { ActionType } from 'typesafe-actions';
import { produce } from 'immer';
import { PollVotingActionTypeKeys, pollVotingActions } from '~/poll-voting/state/pollVotingActions';
import { pollVotingInitialState } from '~/poll-voting/state/pollVotingInitialState';
import { PollVotingState } from '~/poll-voting/types/PollVotingState';
import { select } from 'redux-saga/effects';

export const pollVotingReducer = (
    state: PollVotingState = pollVotingInitialState,
    action: ActionType<typeof pollVotingActions>,
): PollVotingState => {
    switch (action.type) {
        case PollVotingActionTypeKeys.GET_POLL_SUCCESS:
            return produce(state, draftState => {
                const poll = {
                    ...action.payload,
                    questions: action.payload.questions.map(q => ({ ...q, selectedOptionId: null })),
                };
                draftState.poll = poll;
            });
        case PollVotingActionTypeKeys.SELECT_OPTION:
            return produce(state, draftState => {
                const { question, option } = action.payload;
                const selectedQuestion = draftState.poll!.questions.find(q => q.questionId === question.questionId)!;
                if (selectedQuestion.selectedOptionId === option.optionId) {
                    selectedQuestion.selectedOptionId = null;
                } else {
                    selectedQuestion.selectedOptionId = option.optionId;
                }
            });
        default:
            return state;
    }
};
