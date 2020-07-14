import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Option } from '~/polling/option.entity';
import { Poll } from '~/polling/poll.entity';

@Entity({ schema: 'public', name: 'questions' })
export class Question {
    @PrimaryGeneratedColumn({ name: 'question_id' })
    public questionId!: number;

    @Column({ name: 'order_id' })
    public orderId!: number;

    @Column({ name: 'content' })
    public content!: string;

    @Column({ name: 'subheading' })
    public subheading!: string | null;

    @Column({ name: 'is_required' })
    public isRequired!: boolean;

    @ManyToOne(
        () => Poll,
        poll => poll.questions,
    )
    @JoinColumn({ name: 'poll_id' })
    public poll!: Poll;

    @OneToMany(
        () => Option,
        option => option.question,
    )
    public options!: Option[];
}
