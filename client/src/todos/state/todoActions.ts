import { action } from 'typesafe-actions';
import { Todo } from '../types/Todo';

export enum TodosActionTypeKeys {
    ADD_TODO = 'ADD_TODO',
    REMOVE_TODO = 'REMOVE_TODO',
    UPDATE_TODO = 'UPDATE_TODO',
}

const addTodo = (payload: string) => action(TodosActionTypeKeys.ADD_TODO, payload);

const removeTodo = (payload: Todo) => action(TodosActionTypeKeys.REMOVE_TODO, payload);

const updateTodo = (payload: Todo) => action(TodosActionTypeKeys.UPDATE_TODO, payload);

export const todoActions = {
    addTodo,
    removeTodo,
    updateTodo,
};
