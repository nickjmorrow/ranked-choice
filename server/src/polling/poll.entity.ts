import { Column, Entity, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import { Question } from '~/polling/question.entity';

@Entity({ schema: 'public', name: 'polls' })
export class Poll {
    @PrimaryGeneratedColumn({ name: 'poll_id' })
    public pollId!: number;

    @Column({ name: 'title' })
    public title!: string;

    @Column({ name: 'link' })
    public link!: string;

    @Column({ name: 'description' })
    public description!: string;

    @OneToMany(
        type => Question,
        question => question.poll,
    )
    public questions!: Question[];
}
