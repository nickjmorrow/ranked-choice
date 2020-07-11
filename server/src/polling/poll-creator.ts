import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CreatePollRequest } from '~/polling/types/CreatePollRequest';
import { Poll } from '~/polling/poll.entity';
import { UniqueLinkProvider } from '~/polling/unique-link-provider';
import { Question } from '~/polling/question.entity';

@Injectable()
export class PollCreator {
    public constructor(
        private readonly connection: Connection,
        private readonly uniqueLinkProvider: UniqueLinkProvider,
    ) {}
    public async createPoll(createPollRequest: CreatePollRequest): Promise<void> {
        const manager = this.connection.manager;
        const {
            poll: { title, description, questions },
        } = createPollRequest;
        const { pollId } = (
            await manager.insert(Poll, {
                title,
                description,
                questions,
                link: await this.uniqueLinkProvider.getUniqueLink(),
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

        const insertedQuestions = questions.map((q, i) => (q.questionId = questionIds[i]));

        // const options = insertedQuestions.flatMap(q => ({ options: q.options, questionId: q.questionId}))

        // await manager
        //     .createQueryBuilder()
        //     .insert()
        //     .into(Option)
        //     .values(options)
        //     .execute();
    }
}
