import { action } from 'typesafe-actions';
import { Question } from '~/polling/types/Question';

export enum PollCreationActionTypeKeys {
    ADD_QUESTION = 'ADD_QUESTION',
}

const addQuestion = (question: Omit<Question, 'questionId'>) =>
    action(PollCreationActionTypeKeys.ADD_QUESTION, question);

export const pollCreationActions = {
    addQuestion,
};
