import { action } from 'typesafe-actions';
import { Question } from '~/polling/types/Question';
import { Option } from '~/polling/types/Option';

export enum PollCreationActionTypeKeys {
    CREATE_QUESTION = 'CREATE_QUESTION',
    CREATE_OPTION = 'CREATE_OPTION',
    REMOVE_OPTION = 'REMOVE_OPTION',
    UPDATE_TITLE = 'UPDATE_TITLE',
    UPDATE_DESCRIPTION = 'UPDATE_DESCRIPTION',
}

const createQuestion = (question: Omit<Question, 'questionId'>) =>
    action(PollCreationActionTypeKeys.CREATE_QUESTION, question);

const createOption = (payload: { question: Question; option: Omit<Option, 'optionId'> }) =>
    action(PollCreationActionTypeKeys.CREATE_OPTION, payload);

const removeOption = (payload: { question: Question; option: Option }) =>
    action(PollCreationActionTypeKeys.REMOVE_OPTION, payload);

const updateTitle = (payload: string) => action(PollCreationActionTypeKeys.UPDATE_TITLE, payload);

const updateDescription = (payload: string) => action(PollCreationActionTypeKeys.UPDATE_DESCRIPTION, payload);

export const pollCreationActions = {
    createQuestion,
    createOption,
    removeOption,
    updateTitle,
    updateDescription,
};
