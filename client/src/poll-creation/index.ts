import { pollCreationReducer } from '~/poll-creation/state/pollCreationReducer';
import { pollCreationSagas } from '~/poll-creation/state/pollCreationSagas';

export const pollCreationApi = {
    reducer: pollCreationReducer,
    sagas: pollCreationSagas,
};
