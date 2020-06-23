import { combineReducers } from 'redux';
import { todosReducer } from '~/todos/state/todosReducer';

export const rootReducer = combineReducers({
    todosState: todosReducer,
});
