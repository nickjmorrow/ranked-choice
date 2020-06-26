import { ActionType } from 'typesafe-actions';
import { produce } from 'immer';
import { SimulationState } from '~/simulation/types/SimulationState';
import { simulationInitialState } from '~/simulation/state/simulationInitialState';
import { simulationActions, SimulationActionTypeKeys } from '~/simulation/state/simulationActions';

export const simulationReducer = (
    state: SimulationState = simulationInitialState,
    action: ActionType<typeof simulationActions>,
): SimulationState => {
    switch (action.type) {
        case SimulationActionTypeKeys.ADD_VOTE:
            return produce(state, draftState => {
                const voterId = state.votes.reduce((agg, cur) => Math.max(agg, cur.voterId), 0) + 1;
                draftState.votes.push({ voterId, choices: action.payload.choices });
            });
        case SimulationActionTypeKeys.ADD_OPTION:
            return produce(state, draftState => {
                const optionId = state.options.reduce((agg, cur) => Math.max(agg, cur.optionId), 0) + 1;
                draftState.options.push({ optionId, label: action.payload.label });
            });
        default:
            return state;
    }
};
