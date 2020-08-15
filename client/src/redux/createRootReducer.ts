// external
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

// inter
import { simulationApi } from '~/simulation';
import { pollCreationApi } from '~/poll-creation';
import { pollVotingApi } from '~/poll-voting';
import { pollResultsApi } from '~/poll-results';

// intra
import { history as createdHistory } from '~/redux/history';

export const createRootReducer = (history: typeof createdHistory) =>
    combineReducers({
        simulationState: simulationApi.reducer,
        pollCreationState: pollCreationApi.reducer,
        pollVotingState: pollVotingApi.reducer,
        pollResultState: pollResultsApi.reducer,
        router: connectRouter(history),
    });
