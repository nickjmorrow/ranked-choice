import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Vote } from '~/polling/vote.entity';

interface PollVoteRequest {
    optionIds: number[];
}

@Injectable()
export class PollVoter {
    public constructor(private readonly connection: Connection) {}
    public async voteOnPoll(pollVoteRequest: PollVoteRequest): Promise<void> {
        await this.connection
            .createQueryBuilder()
            .insert()
            .into(Vote)
            .values(
                pollVoteRequest.optionIds.map(o => ({
                    option: { optionId: o },
                })),
            )
            .execute();
    }
}
