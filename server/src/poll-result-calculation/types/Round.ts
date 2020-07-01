import { OptionResult } from '~/poll-result-calculation/types/OptionResult';

export interface Round {
    roundId: number;
    optionResults: OptionResult[];
}
