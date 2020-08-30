import { PollCreationState } from '~/poll-creation/types/PollCreationState';

export const pollCreationInitialState: PollCreationState = {
    title: '',
    description: '',
    questions: [],
    currentInteractingQuestionId: null,
};
