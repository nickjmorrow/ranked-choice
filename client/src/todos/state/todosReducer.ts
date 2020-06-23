import { todoActions, TodosActionTypeKeys } from './todoActions';
import { TodosState } from '~/todos/types/TodosState';
import { ActionType } from 'typesafe-actions';
import { produce } from 'immer';
import { todosInitialState } from '~/todos/state/todosInitialState';

export const todosReducer = (
    state: TodosState = todosInitialState,
    action: ActionType<typeof todoActions>,
): TodosState => {
    switch (action.type) {
        case TodosActionTypeKeys.ADD_TODO:
            const todoId = state.todos.reduce((agg, cur) => Math.max(cur.todoId, agg), 0) + 1;
            return produce(state, draftState => {
                draftState.todos.push({ todoId, description: action.payload });
            });
        case TodosActionTypeKeys.REMOVE_TODO:
            return produce(state, draftState => {
                const index = draftState.todos.findIndex(t => t.todoId === action.payload.todoId);
                draftState.todos.splice(index, 1);
            });
        case TodosActionTypeKeys.UPDATE_TODO:
            return produce(state, draftState => {
                const index = draftState.todos.findIndex(t => t.todoId === action.payload.todoId);
                draftState.todos[index] = action.payload;
            });
        default:
            return state;
    }
};
