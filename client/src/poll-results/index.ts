import { pollResultSagas } from '~/poll-results/state/pollResultSagas';
import { pollResultsReducer } from '~/poll-results/state/pollResultReducer';

export const pollResultsApi = {
    sagas: pollResultSagas,
    reducer: pollResultsReducer,
};
