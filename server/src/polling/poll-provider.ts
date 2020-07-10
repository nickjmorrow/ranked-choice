import { Injectable } from '@nestjs/common';
import { Poll } from '~/polling/poll.entity';
import { Connection } from 'typeorm';

@Injectable()
export class PollProvider {
    public constructor(private readonly connection: Connection) {}
    public getAllProducts(): Promise<Poll[]> {
        return this.connection.manager.find(Poll);
    }

    public getOnePoll(link: string): Promise<Poll> {
        return this.connection.manager.findOne(Poll, undefined, { where: { link } });
    }
}
