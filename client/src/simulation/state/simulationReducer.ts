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
        case SimulationActionTypeKeys.REMOVE_VOTE:
            return produce(state, draftState => {
                draftState.votes = state.votes.filter(v => v.voterId !== action.payload.voterId);
            });
        case SimulationActionTypeKeys.ADD_OPTION:
            return produce(state, draftState => {
                const optionId = state.options.reduce((agg, cur) => Math.max(agg, cur.optionId), 0) + 1;
                draftState.options.push({ optionId, label: action.payload });
            });
        case SimulationActionTypeKeys.REMOVE_OPTION:
            return produce(state, draftState => {
                draftState.options = state.options.filter(o => o.optionId !== action.payload.optionId);
                draftState.votes = state.votes.map(v => ({
                    ...v,
                    choices: v.choices.filter(c => c.optionId !== action.payload.optionId),
                }));
            });
        case SimulationActionTypeKeys.ADD_CHOICE:
            return produce(state, draftState => {
                const vote = draftState.votes.find(v => v.voterId === action.payload.vote.voterId)!;
                vote.choices.push(action.payload.choice);
            });
        case SimulationActionTypeKeys.REMOVE_CHOICE:
            return produce(state, draftState => {
                const vote = draftState.votes.find(v => v.voterId === action.payload.vote.voterId)!;
                vote.choices = vote.choices.filter(c => c.optionId === action.payload.choice.optionId);
            });

        default:
            return state;
    }
};
