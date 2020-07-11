import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Poll } from '~/polling/poll.entity';
import { Option } from '~/polling/option.entity';

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
        type => Poll,
        poll => poll.questions,
    )
    @JoinColumn({ name: 'poll_id' })
    public poll!: Poll;

    @OneToMany(
        type => Option,
        option => option.question,
    )
    public options!: Option[];
}
