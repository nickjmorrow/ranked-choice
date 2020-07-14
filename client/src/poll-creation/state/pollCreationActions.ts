import { action } from 'typesafe-actions';
import { Question } from '~/polling/types/Question';
import { Option } from '~/polling/types/Option';
import { CreatePollRequest } from '~/poll-creation/types/CreatePollRequest';
import { PollVotingActionTypeKeys } from '~/poll-voting/state/pollVotingActions';
import { CreatePollResponse } from '~/poll-creation/types/CreatePollResponse';

export enum PollCreationActionTypeKeys {
    CREATE_QUESTION = 'CREATE_QUESTION',
    CREATE_OPTION = 'CREATE_OPTION',
    REMOVE_OPTION = 'REMOVE_OPTION',
    UPDATE_TITLE = 'UPDATE_TITLE',
    UPDATE_DESCRIPTION = 'UPDATE_DESCRIPTION',
    UPDATE_QUESTION_CONTENT = 'UPDATE_QUESTION_CONTENT',
    UPDATE_QUESTION_SUBHEADING = 'UPDATE_QUESTION_SUBHEADING',
    SET_CURRENT_INTERACTIVE_QUESTION_ID = 'SET_CURRENT_INTERACTIVE_QUESTION_ID',
    UPDATE_OPTION = 'UPDATE_OPTION',
    CREATE_POLL = 'CREATE_POLL',
    CREATE_POLL_SUCCESS = 'CREATE_POLL_SUCCESS',
    CREATE_POLL_FAILURE = 'CREATE_POLL_FAILURE',
    REMOVE_QUESTION = 'REMOVE_QUESTION',
}

const createQuestion = () => action(PollCreationActionTypeKeys.CREATE_QUESTION);

const createOption = (payload: { question: Question; option: Omit<Option, 'optionId'> }) =>
    action(PollCreationActionTypeKeys.CREATE_OPTION, payload);

const removeOption = (payload: { question: Question; option: Option }) =>
    action(PollCreationActionTypeKeys.REMOVE_OPTION, payload);

const updateTitle = (payload: string) => action(PollCreationActionTypeKeys.UPDATE_TITLE, payload);

const updateDescription = (payload: string) => action(PollCreationActionTypeKeys.UPDATE_DESCRIPTION, payload);

const updateQuestionContent = (payload: { question: Question; content: string }) =>
    action(PollCreationActionTypeKeys.UPDATE_QUESTION_CONTENT, payload);

const updateQuestionSubheading = (payload: { question: Question; subheading: string }) =>
    action(PollCreationActionTypeKeys.UPDATE_QUESTION_SUBHEADING, payload);

const setCurrentInteractiveQuestionId = (payload: number) =>
    action(PollCreationActionTypeKeys.SET_CURRENT_INTERACTIVE_QUESTION_ID, payload);

const updateOption = (payload: { question: Question; option: Option }) =>
    action(PollCreationActionTypeKeys.UPDATE_OPTION, payload);

const createPoll = {
    request: (requet: CreatePollRequest) => action(PollCreationActionTypeKeys.CREATE_POLL, requet),
    success: (response: CreatePollResponse) => action(PollCreationActionTypeKeys.CREATE_POLL_SUCCESS, response),
    failure: (error: Error) => action(PollCreationActionTypeKeys.CREATE_POLL_FAILURE, error),
};

const removeQuestion = (question: Question) => action(PollCreationActionTypeKeys.REMOVE_QUESTION, question);

export const pollCreationActions = {
    createQuestion,
    createOption,
    removeOption,
    updateTitle,
    updateDescription,
    updateQuestionContent,
    updateQuestionSubheading,
    setCurrentInteractiveQuestionId,
    updateOption,
    createPoll,
    removeQuestion,
};
