import { RootState } from '~/redux/RootState';
import { QuestionWithVote, FilledOrderedOption } from '~/poll-voting/types/QuestionWithVote';
import { PollVoteRequest } from '~/poll-voting/types/PollVoteRequest';
import { Question } from '~/polling/types/Question';

export const getPollVotingRequest = (state: RootState): PollVoteRequest => {
    return {
        link: state.pollVotingState.poll!.link,
        questions: state.pollVotingState.poll!.questions.map(getUsefulQuestionShape),
    };
};

const getUsefulQuestionShape = (question: QuestionWithVote) => {
    return {
        questionId: question.questionId,
        options: question.options
            .filter((o): o is FilledOrderedOption => o.orderId !== null)
            .map(o => ({ orderId: o.orderId, optionId: o.optionId })),
    };
};

const getNextOrderId = (question: Question) => (state: RootState): number => {
    const orderIds =
        (state.pollVotingState.poll &&
            state.pollVotingState.poll.questions
                .find(q => q.questionId === question.questionId)!
                .options.filter(o => o.orderId !== null)
                .map(o => o.orderId as number)) ||
        [];
    if (orderIds.length === 0) {
        return 1;
    }
    return Math.max(...orderIds) + 1;
};

export const pollVotingSelectors = { getPollVotingRequest, getNextOrderId };
