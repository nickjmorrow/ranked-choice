import { RootState } from '~/redux/RootState';
import { QuestionWithVote, FilledOrderedOption } from '~/poll-voting/types/QuestionWithVote';
import { PollVoteRequest } from '~/poll-voting/types/PollVoteRequest';

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

export const pollVotingSelectors = { getPollVotingRequest };
