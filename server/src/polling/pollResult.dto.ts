import { Question } from '~/polling/question.entity';
import { Poll } from '~/polling/poll.entity';

export interface PollResult {
    poll: Poll;
    questionResults: {
        question: Question;
        rounds: { roundId: number; optionResults: { optionId: number; voteCount: number }[] }[];
    }[];
}
