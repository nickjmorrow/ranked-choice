import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Vote } from '~/polling/vote.entity';

interface PollVoteRequest {
    link: string;
    questions: { questionId: number; options: { optionId: number; orderId: number }[] }[];
}

@Injectable()
export class PollVoter {
    public constructor(private readonly connection: Connection) {}
    public async voteOnPoll(pollVoteRequest: PollVoteRequest): Promise<void> {
        let maxSubmissionVote = await this.connection
            .createQueryBuilder()
            .select()
            .from(Vote, 'vote')
            .orderBy('vote.submission_id', 'DESC')
            .take(1)
            .execute();
        let maxSubmissionId;
        if (maxSubmissionVote.length === 0) {
            maxSubmissionId = 1;
        } else {
            maxSubmissionId = maxSubmissionVote[0].submission_id + 1;
        }
        const votes = [].concat(
            ...pollVoteRequest.questions
                .map(q => ({ options: q.options, questionId: q.questionId }))
                .map(q =>
                    q.options.map(o => ({
                        optionId: o.optionId,
                        orderId: o.orderId,
                        questionId: q.questionId,
                        submissionId: maxSubmissionId,
                    })),
                ),
        );

        await this.connection.manager.insert(Vote, votes);
    }
}
