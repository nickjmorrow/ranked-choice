import { Poll } from '~/polling/types/Poll';
import { QuestionResult } from '~/polling/types/QuestionResult';

export interface PollResult {
    poll: Poll;
    questionResults: QuestionResult[];
}
