import { Connection } from 'typeorm';
import { Poll } from '~/polling/poll.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UniqueLinkProvider {
    public constructor(private readonly connection: Connection) {}
    public async getUniqueLink(): Promise<string> {
        let randomId = this.getRandomId();

        while (await this.idAlreadyExists(randomId)) {
            randomId = this.getRandomId();
        }

        return randomId;
    }

    public async idAlreadyExists(link: string): Promise<boolean> {
        return (await this.connection.manager.findOne(Poll, { where: { link } })) !== undefined;
    }

    public getRandomId(): string {
        return Math.random()
            .toString(36)
            .substr(2, 9);
    }
}
