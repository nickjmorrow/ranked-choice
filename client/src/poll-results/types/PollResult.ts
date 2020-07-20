import { Question } from '~/polling/types/Question';
import { Poll } from '~/polling/types/Poll';
import { QuestionResult } from '~/poll-results/types/QuestionResult';

export interface PollResult {
    poll: Poll;
    questionResults: QuestionResult[];
}
