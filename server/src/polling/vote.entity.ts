import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Option } from '~/polling/option.entity';

@Entity({ schema: 'public', name: 'votes' })
export class Vote {
    @PrimaryGeneratedColumn({ name: 'vote_id' })
    public voteId!: number;

    @Column({ name: 'question_id' })
    public questionId!: number;

    @ManyToOne(
        () => Option,
        option => option.votes,
    )
    @JoinColumn({ name: 'option_id' })
    public option!: Option;

    @Column({ name: 'option_id' })
    public optionId!: number;

    @Column({ name: 'order_id' })
    public orderId!: number;

    @Column({ name: 'submission_id' })
    public submissionId!: number;
}
