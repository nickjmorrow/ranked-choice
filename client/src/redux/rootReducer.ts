import { combineReducers } from 'redux';
import { simulationApi } from '~/simulation';
import { pollCreationApi } from '~/poll-creation';
import { pollVotingApi } from '~/poll-voting';
import { pollResultsApi } from '~/poll-results';

export const rootReducer = combineReducers({
    simulationState: simulationApi.reducer,
    pollCreationState: pollCreationApi.reducer,
    pollVotingState: pollVotingApi.reducer,
    pollResultState: pollResultsApi.reducer,
});
