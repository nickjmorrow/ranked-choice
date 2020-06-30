import { ActionType } from 'typesafe-actions';
import { produce } from 'immer';
import { PollCreationState } from '~/poll-creation/types/PollCreationState';
import { pollCreationInitialState } from '~/poll-creation/state/pollCreationInitialState';
import { pollCreationActions, PollCreationActionTypeKeys } from '~/poll-creation/state/pollCreationActions';
import { Question } from '~/polling/types/Question';

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
        case PollCreationActionTypeKeys.CREATE_QUESTION:
            return produce(state, draftState => {
                const questionId = Math.max(...state.questions.map(q => q.questionId)) + 1;
                const orderId = Math.max(...state.questions.map(q => q.orderId)) + 1;
                const question: Question = {
                    questionId,
                    orderId,
                    isRequired: true,
                    options: [],
                    content: '',
                    subheading: '',
                };
                draftState.questions.push(question);
                draftState.currentInteractingQuestionId = questionId;
            });
        case PollCreationActionTypeKeys.SET_CURRENT_INTERACTIVE_QUESTION_ID:
            return produce(state, draftState => {
                draftState.currentInteractingQuestionId = action.payload;
            });
        case PollCreationActionTypeKeys.UPDATE_QUESTION_CONTENT:
            return produce(state, draftState => {
                draftState.questions.find(q => q.questionId === action.payload.question.questionId)!.content =
                    action.payload.content;
            });
        case PollCreationActionTypeKeys.UPDATE_QUESTION_SUBHEADING:
            return produce(state, draftState => {
                draftState.questions.find(q => q.questionId === action.payload.question.questionId)!.subheading =
                    action.payload.subheading;
            });
        case PollCreationActionTypeKeys.UPDATE_OPTION:
            return produce(state, draftState => {
                const question = draftState.questions.find(q => q.questionId === action.payload.question.questionId)!;
                const { option: updatedOption } = action.payload;
                const option = question.options.find(o => o.optionId === updatedOption.optionId)!;
                option.label = updatedOption.label;
                option.sublabel = updatedOption.sublabel;
            });
        default:
            return state;
    }
};