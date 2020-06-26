import { Choice } from '~/simulation/types/Choice';

export interface Vote {
    voterId: number;
    label?: string;
    choices: Choice[];
}
