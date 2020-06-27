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

const addOption = (option: Option) => action(SimulationActionTypeKeys.ADD_OPTION, option);

const addVote = (vote: Vote) => action(SimulationActionTypeKeys.ADD_VOTE, vote);

const addChoice = (payload: { optionId: number; vote: Vote }) => action(SimulationActionTypeKeys.ADD_CHOICE, payload);

const removeChoice = (payload: { choice: Choice; vote: Vote }) =>
    action(SimulationActionTypeKeys.REMOVE_CHOICE, payload);

export const simulationActions = {
    addOption,
    addVote,
    addChoice,
    removeChoice,
};
