import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CreatePollRequest } from '~/polling/types/CreatePollRequest';
import { Poll } from '~/polling/poll.entity';
import { UniqueLinkProvider } from '~/polling/uniqueLinkProvider.service';
import { Question } from '~/polling/question.entity';
import { Option } from '~/polling/option.entity';
import { CreatePollResponse } from '~/polling/types/CreatePollResponse';

@Injectable()
export class PollCreator {
    public constructor(
        private readonly connection: Connection,
        private readonly uniqueLinkProvider: UniqueLinkProvider,
    ) { }
    public async createPoll(createPollRequest: CreatePollRequest): Promise<CreatePollResponse> {
        const manager = this.connection.manager;
        const {
            poll: { title, description, questions },
        } = createPollRequest;

        const link = await this.uniqueLinkProvider.getUniqueLink();

        const { pollId } = (
            await manager.insert(Poll, {
                title,
                description,
                questions,
                link,
            })
        ).identifiers[0];

        const questionIds = (
            await manager
                .createQueryBuilder()
                .insert()
                .into(Question)
                .values(questions.map(q => ({ ...q, poll: { pollId } })))
                .execute()
        ).identifiers.map(q => q.questionId);

        const insertedQuestions = questions.map((q, i) => {
            q.questionId = questionIds[i];
            return q;
        });

        const options = insertedQuestions
            .map(q => ({ options: q.options, questionId: q.questionId }))
            .reduce<Option[]>((agg, cur) => {
                agg = [
                    ...agg,
                    ...cur.options.map(o => ({
                        ...o,
                        optionId: undefined,
                        votes: [],
                        question: { questionId: cur.questionId },
                    })),
                ] as Option[];
                return agg;
            }, []);

        await manager
            .createQueryBuilder()
            .insert()
            .into(Option)
            .values(options)
            .execute();

        return { link };
    }
}
