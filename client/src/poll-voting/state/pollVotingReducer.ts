import { produce } from 'immer';
import { ActionType } from 'typesafe-actions';
import { pollVotingActions, PollVotingActionTypeKeys } from '~/poll-voting/state/pollVotingActions';
import { pollVotingInitialState } from '~/poll-voting/state/pollVotingInitialState';
import { PollVotingState } from '~/poll-voting/types/PollVotingState';
import { FilledOrderedOption } from '~/poll-voting/types/QuestionWithVote';

export const pollVotingReducer = (
    state: PollVotingState = pollVotingInitialState,
    action: ActionType<typeof pollVotingActions>,
): PollVotingState => {
    switch (action.type) {
        case PollVotingActionTypeKeys.GET_POLL_SUCCESS:
            return produce(state, draftState => {
                const poll = {
                    ...action.payload,
                    questions: action.payload.questions.map(q => ({
                        ...q,
                        options: q.options.map(o => ({ ...o, orderId: null })),
                    })),
                };
                draftState.poll = poll;
            });
        case PollVotingActionTypeKeys.SELECT_OPTION:
            return produce(state, draftState => {
                const { question, option } = action.payload;
                const currentQuestion = (draftState.poll &&
                    draftState.poll.questions.find(q => q.questionId === question.questionId))!;
                const currentOption = currentQuestion.options.find(o => o.optionId === option.optionId)!;
                if (currentOption.orderId === null) {
                    const maxOrderId = Math.max(
                        ...(currentQuestion.options.filter(o => o.orderId !== null).map(o => o.orderId) as number[]),
                        0,
                    );
                    currentOption.orderId = maxOrderId + 1;
                } else {
                    currentOption.orderId = null;
                    const orderedOptions = currentQuestion.options
                        .filter((o): o is FilledOrderedOption => o.orderId !== null)
                        .sort((a, b) => (a.orderId < b.orderId ? -1 : 1));

                    orderedOptions.forEach((o, i) => {
                        o.orderId = i + 1;
                    });
                }
            });
        default:
            return state;
    }
};
