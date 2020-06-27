import { action } from 'typesafe-actions';
import { Option } from '~/simulation/types/Option';
import { Vote } from '~/simulation/types/Vote';
import { Choice } from '~/simulation/types/Choice';

export enum SimulationActionTypeKeys {
    ADD_OPTION = 'ADD_OPTION',
    UPDATE_OPTION = 'UPDATE_OPTION',
    REMOVE_OPTION = 'REMOVE_OPTION',
    ADD_VOTE = 'ADD_VOTE',
    UPDATE_VOTE = 'UPDATE_VOTE',
    REMOVE_VOTE = 'REMOVE_VOTE',
    ADD_CHOICE = 'ADD_CHOICE',
    REMOVE_CHOICE = 'REMOVE_CHOICE',
}

const addOption = (label: Option['label']) => action(SimulationActionTypeKeys.ADD_OPTION, label);

const removeOption = (option: Option) => action(SimulationActionTypeKeys.REMOVE_OPTION, option);

const addVote = (vote: Omit<Vote, 'voterId'>) => action(SimulationActionTypeKeys.ADD_VOTE, vote);

const removeVote = (vote: Vote) => action(SimulationActionTypeKeys.REMOVE_VOTE, vote);

const removeChoice = (payload: { vote: Vote; choice: Choice }) =>
    action(SimulationActionTypeKeys.REMOVE_CHOICE, payload);

const addChoice = (payload: { vote: Vote; optionId: Option['optionId'] }) =>
    action(SimulationActionTypeKeys.ADD_CHOICE, payload);

export const simulationActions = {
    addOption,
    removeOption,
    addVote,
    addChoice,
    removeChoice,
    removeVote,
};
