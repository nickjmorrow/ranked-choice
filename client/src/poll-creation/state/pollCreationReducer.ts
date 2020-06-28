import { ActionType } from 'typesafe-actions';
import { produce } from 'immer';
import { PollCreationState } from '~/poll-creation/types/PollCreationState';
import { pollCreationInitialState } from '~/poll-creation/state/pollCreationInitialState';
import { pollCreationActions, PollCreationActionTypeKeys } from '~/poll-creation/state/pollCreationActions';

export const pollCreationReducer = (
    state: PollCreationState = pollCreationInitialState,
    action: ActionType<typeof pollCreationActions>,
): PollCreationState => {
    switch (action.type) {
        case PollCreationActionTypeKeys.CREATE_OPTION:
            return produce(state, draftState => {
                const options = draftState.questions.find(q => q.questionId === action.payload.question.questionId)!
                    .options;
                const optionId = Math.max(...options.map(o => o.optionId)) + 1;
                options.push({ optionId, ...action.payload.option });
            });
        case PollCreationActionTypeKeys.REMOVE_OPTION:
            return produce(state, draftState => {
                const question = draftState.questions.find(q => q.questionId === action.payload.question.questionId)!;
                question.options.splice(
                    question.options.findIndex(o => o.optionId === action.payload.option.optionId),
                    1,
                );
            });
        case PollCreationActionTypeKeys.UPDATE_TITLE:
            return produce(state, draftState => {
                draftState.title = action.payload;
            });
        case PollCreationActionTypeKeys.UPDATE_DESCRIPTION:
            return produce(state, draftState => {
                draftState.description = action.payload;
            });
        default:
            return state;
    }
};
