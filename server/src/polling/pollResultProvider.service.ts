import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import {
    PollResultCalculationService,
    CalculatePollResultRequest,
} from '~/poll-result-calculation/poll-result-calculation.service';
import { PollResult } from '~/polling/pollResult.dto';
import { PollProvider } from '~/polling/pollProvider.service';
import { Poll } from '~/polling/poll.entity';
import { Question } from '~/polling/question.entity';
import { Vote } from '~/polling/vote.entity';
import { RankedQuestionVote } from '~/poll-result-calculation/types/Vote';

@Injectable()
export class PollResultProvider {
    public constructor(
        private readonly connection: Connection,
        private readonly pollResultCalculationService: PollResultCalculationService,
    ) {}

    public async getPollResult(link: string): Promise<PollResult> {
        const poll = await this.connection.manager.findOneOrFail(Poll, {
            where: { link },
            relations: ['questions', 'questions.options', 'questions.options.votes'],
        });

        const request: CalculatePollResultRequest = {
            poll: {
                questions: poll.questions.map(q => ({
                    questionId: q.questionId,
                    optionIds: q.options.map(o => o.optionId),
                    votes: this.getRankedQuestionVotes(q.options.flatMap(o => o.votes)),
                })),
            },
        };

        const response = this.pollResultCalculationService.calculatePollResult(request);
        const questions = poll.questions;

        return {
            poll,
            questionResults: response.questionResults.map(qr => ({
                question: questions.find(q => q.questionId === qr.questionId)!,
                rounds: qr.rounds,
            })),
        };
    }

    public async getVotesForQuestion(question: Question): Promise<Vote[]> {
        const optionIds = question.options.map(o => o.optionId);
        const votes = await this.connection.manager
            .createQueryBuilder(Vote, 'vote')
            .select()
            .where('vote.option_id IN (:...ids)', { ids: optionIds })
            .getMany();

        return votes;
    }

    public getRankedQuestionVotes(votes: Vote[]): RankedQuestionVote[] {
        const map = new Map<number, Vote[]>();
        votes.forEach(v => {
            if (!map.has(v.submissionId)) {
                map.set(v.submissionId, []);
            }
            map.set(v.submissionId, [...map.get(v.submissionId), v]);
        });
        return Array.from(map.values()).map(v => {
            return {
                rankedOptions: v.map(v => ({ orderId: v.orderId, optionId: v.optionId })),
            };
        });
    }
}
