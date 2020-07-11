import { pollVotingSagas } from '~/poll-voting/state/pollVotingSagas';
import { pollVotingReducer } from '~/poll-voting/state/pollVotingReducer';

export const pollVotingApi = {
    sagas: pollVotingSagas,
    reducer: pollVotingReducer,
};
