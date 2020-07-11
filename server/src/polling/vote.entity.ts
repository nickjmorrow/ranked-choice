import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Poll } from '~/polling/poll.entity';
import { Option } from '~/polling/option.entity';

@Entity({ schema: 'public', name: 'votes' })
export class Vote {
    @PrimaryGeneratedColumn({ name: 'vote_id' })
    public voteId!: number;

    @ManyToOne(
        type => Option,
        option => option.votes,
    )
    @JoinColumn({ name: 'option_id' })
    public option!: Option;
}
