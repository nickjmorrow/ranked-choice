import { combineReducers } from 'redux';
import { simulationApi } from '~/simulation';
import { pollCreationApi } from '~/poll-creation';

export const rootReducer = combineReducers({
    simulationState: simulationApi.reducer,
    pollCreationState: pollCreationApi.reducer,
});
