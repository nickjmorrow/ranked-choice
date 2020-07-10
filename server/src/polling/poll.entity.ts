import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'public', name: 'polls' })
export class Poll {
    @PrimaryGeneratedColumn({ name: 'poll_id' })
    public pollId!: number;

    @Column({ name: 'title' })
    public title!: string;

    @Column({ name: 'link' })
    public link!: string;
}
