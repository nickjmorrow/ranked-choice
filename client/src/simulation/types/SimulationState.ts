import { Option } from '~/simulation/types/Option';
import { Vote } from '~/simulation/types/Vote';

export interface SimulationState {
    options: Option[];
    votes: Vote[];
}
