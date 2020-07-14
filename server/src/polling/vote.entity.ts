import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Option } from '~/polling/option.entity';

@Entity({ schema: 'public', name: 'votes' })
export class Vote {
    @PrimaryGeneratedColumn({ name: 'vote_id' })
    public voteId!: number;

    @ManyToOne(
        () => Option,
        option => option.votes,
    )
    @JoinColumn({ name: 'option_id' })
    public option!: Option;
}
