import { Question } from '~/polling/types/Question';

export interface QuestionResult {
    question: Question;
    rounds: { roundId: number; optionResults: { optionId: number; voteCount: number }[] }[];
}
