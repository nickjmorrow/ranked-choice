import { QuestionWithVote } from '~/poll-voting/types/QuestionWithVote';
import { Poll } from '~/polling/types/Poll';

export interface PollWithVotes extends Poll {
    questions: QuestionWithVote[];
}
