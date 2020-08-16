import { action } from 'typesafe-actions';
import { Option } from '~/polling/types/Option';
import { Vote } from '~/simulation/types/Vote';
import { RankedOption } from '~/simulation/types/RankedOption';
import { CalculatePollResultRequest } from '~/polling/types/CalculatePollResultRequest';
import { PollResult } from '~/polling/types/PollResult';

export enum SimulationActionTypeKeys {
    ADD_OPTION = 'SIMULATION_ADD_OPTION',
    UPDATE_OPTION = 'SIMULATION_UPDATE_OPTION',
    REMOVE_OPTION = 'SIMULATION_REMOVE_OPTION',
    ADD_VOTE = 'SIMULATION_ADD_VOTE',
    UPDATE_VOTE = 'SIMULATION_UPDATE_VOTE',
    REMOVE_VOTE = 'SIMULATION_REMOVE_VOTE',
    ADD_CHOICE = 'SIMULATION_ADD_CHOICE',
    REMOVE_CHOICE = 'SIMULATION_REMOVE_CHOICE',
    CALCULATE_POLL_RESULT = 'SIMULATION_CALCULATE_POLL_RESULT',
    CALCULATE_POLL_RESULT_SUCCESS = 'SIMULATION_CALCULATE_POLL_RESULT_SUCCESS',
    CALCULATE_POLL_RESULT_FAILURE = 'SIMULATION_CALCULATE_POLL_RESULT_FAILURE',
}

const addOption = (label: Option['label']) => action(SimulationActionTypeKeys.ADD_OPTION, label);

const updateOption = (option: Option) => action(SimulationActionTypeKeys.UPDATE_OPTION, option);

const removeOption = (option: Option) => action(SimulationActionTypeKeys.REMOVE_OPTION, option);

const addVote = (vote: Omit<Vote, 'voterId'>) => action(SimulationActionTypeKeys.ADD_VOTE, vote);

const removeVote = (vote: Vote) => action(SimulationActionTypeKeys.REMOVE_VOTE, vote);

const removeChoice = (payload: { vote: Vote; choice: RankedOption }) =>
    action(SimulationActionTypeKeys.REMOVE_CHOICE, payload);

const addChoice = (payload: { vote: Vote; optionId: Option['optionId'] }) =>
    action(SimulationActionTypeKeys.ADD_CHOICE, payload);

const calculatePollResult = {
    request: (payload: CalculatePollResultRequest) => action(SimulationActionTypeKeys.CALCULATE_POLL_RESULT, payload),
    success: (payload: PollResult) => action(SimulationActionTypeKeys.CALCULATE_POLL_RESULT_SUCCESS, payload),
    failure: (payload: Error) => action(SimulationActionTypeKeys.CALCULATE_POLL_RESULT_FAILURE, payload),
};

export const simulationActions = {
    addOption,
    updateOption,
    removeOption,
    addVote,
    addChoice,
    removeChoice,
    removeVote,
    calculatePollResult,
};
