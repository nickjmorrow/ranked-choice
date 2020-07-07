import { RankedOption } from '~/simulation/types/RankedOption';

export interface Vote {
    voterId: number;
    rankedOptions: RankedOption[];
}
