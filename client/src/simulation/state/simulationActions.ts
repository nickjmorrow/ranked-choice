import { action } from 'typesafe-actions';
import { Option } from '~/simulation/types/Option';
import { Vote } from '~/simulation/types/Vote';

export enum SimulationActionTypeKeys {
    ADD_OPTION = 'ADD_OPTION',
    UPDATE_OPTION = 'UPDATE_OPTION',
    REMOVE_OPTION = 'REMOVE_OPTION',
    ADD_VOTE = 'ADD_VOTE',
    UPDATE_VOTE = 'UPDATE_VOTE',
    REMOVE_VOTE = 'REMOVE_VOTE',
}

const addOption = (option: Option) => action(SimulationActionTypeKeys.ADD_OPTION, option);

const addVote = (vote: Vote) => action(SimulationActionTypeKeys.ADD_VOTE, vote);

export const simulationActions = {
    addOption,
    addVote,
};
