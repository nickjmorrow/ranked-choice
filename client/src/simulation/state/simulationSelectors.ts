import { SimulationState } from '~/simulation/types/SimulationState';

interface AppState {
    simulationState: SimulationState;
}

const getOptions = (state: AppState) => state.simulationState.options;

const getVotes = (state: AppState) => state.simulationState.votes;

export const simulationSelectors = { getOptions, getVotes };
