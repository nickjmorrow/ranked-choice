import { Question } from '~/polling/types/Question';

export interface QuestionWithVote extends Question {
    selectedOptionId: number | null;
}
