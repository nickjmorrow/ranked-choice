import { RankedQuestionVote } from '~/poll-result-calculation/types/Vote';

export interface Question {
    optionIds: number[];
    votes: RankedQuestionVote[];
    questionId: number;
}
