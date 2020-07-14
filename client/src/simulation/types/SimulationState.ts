import { Option } from '~/polling/types/Option';
import { Vote } from '~/simulation/types/Vote';
import { PollResult } from '~/polling/types/PollResult';

export interface SimulationState {
    options: Option[];
    votes: Vote[];
    pollResult: PollResult | null;
}
