import { SimulationState } from '~/simulation/types/SimulationState';

interface AppState {
    simulationState: SimulationState;
}

const getOptions = (state: AppState) => state.simulationState.options;

const getVotes = (state: AppState) => state.simulationState.votes;

const getPollResult = (state: AppState) => state.simulationState.pollResult;

export const simulationSelectors = { getOptions, getVotes, getPollResult };
