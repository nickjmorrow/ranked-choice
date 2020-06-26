import { combineReducers } from 'redux';
import { simulationApi } from '~/simulation';

export const rootReducer = combineReducers({
    simulationState: simulationApi.reducer,
});
