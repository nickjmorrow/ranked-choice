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

@Injectable()
export class PollResultProvider {
    public constructor(
        private readonly connection: Connection,
        pollResultCalculationService: PollResultCalculationService,
        pollProvider: PollProvider,
    ) {}

    public async getPollResult(link: string): Promise<PollResult> {
        const poll = await this.connection.manager.findOneOrFail(Poll, {
            where: { link },
            relations: ['questions', 'questions.options', 'questions.options.votes'],
        });

        // const questions = poll.questions.map(q => ({
        //     optionIds: q.options.map(o => o.optionId),
        //     votes: q.options.flatMap(o => o.votes).map(v => ({ orderId: v.orderId, optionId: v.option.optionId })),
        // }));

        const votes = await this.getVotesForQuestion(poll.questions[0]);

        console.log(votes);
        // const calculatePollResultRequest: CalculatePollResultRequest = {
        //     poll: {
        //         questions,
        //     },
        // };

        throw new Error();
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
}
