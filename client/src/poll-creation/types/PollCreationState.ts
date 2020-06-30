import { Question } from '~/polling/types/Question';

export interface PollCreationState {
    title: string;
    description: string;
    questions: Question[];
    currentInteractingQuestionId: number | null;
}
