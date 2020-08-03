import { Round } from '~/poll-result-calculation/types/Round';

export interface QuestionResult {
    rounds: Round[];
    questionId: number;
}
