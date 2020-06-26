import { OptionVoteResult } from '~/simulation/types/OptionVoteResult';

export interface Round {
    roundId: number;
    optionVoteResults: OptionVoteResult[];
}
