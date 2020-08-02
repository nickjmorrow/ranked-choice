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
                    const orderedOptions = currentQuestion.options.filter(
                        (o): o is FilledOrderedOption => o.orderId !== null,
                    );

                    orderedOptions.forEach((o, i) => {
                        o.orderId = i + 1;
                    });
                }
            });
        case PollVotingActionTypeKeys.REORDER_OPTION:
            return produce(state, draftState => {
                const { newOrderId, option, question } = action.payload;
                const { questions } = draftState.poll!;
                const selectedQuestion = questions.find(q => q.questionId === question.questionId)!;
                const selectedOption = selectedQuestion.options.find(o => o.optionId === option.optionId)!;
                const previousOrderId = selectedOption.orderId as number;
                selectedOption.orderId = newOrderId;
                const unorderedOptions = selectedQuestion.options.filter(o => o.orderId === null);
                const orderedOptions = selectedQuestion.options.filter(
                    (o): o is FilledOrderedOption => o.orderId !== null,
                );

                if (previousOrderId < newOrderId) {
                    orderedOptions.forEach(o => {
                        if (o.optionId === option.optionId) {
                            return;
                        }
                        if (o.orderId > previousOrderId && o.orderId <= newOrderId) {
                            o.orderId -= 1;
                        }
                    });
                }

                if (previousOrderId > newOrderId) {
                    orderedOptions.forEach(o => {
                        if (o.optionId === option.optionId) {
                            return;
                        }
                        if (o.orderId >= newOrderId && o.orderId < previousOrderId) {
                            o.orderId += 1;
                        }
                    });
                }

                selectedQuestion.options = [...orderedOptions.sort(byOrderId), ...unorderedOptions];
            });
        default:
            return state;
    }
};

const byOrderId = (a: FilledOrderedOption, b: FilledOrderedOption) => (a.orderId < b.orderId ? -1 : 1);
