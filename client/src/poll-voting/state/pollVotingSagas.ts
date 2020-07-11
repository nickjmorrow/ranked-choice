import axios from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';
import { handleError } from '~/core';
import { pollVotingActions, PollVotingActionTypeKeys } from '~/poll-voting/state/pollVotingActions';

const apiRoutes = {
    getPoll: {
        route: (link: string) => `/polls/${link}`,
        method: axios.get,
    },
};

function* getPollAsync(action: ReturnType<typeof pollVotingActions.getPoll.request>) {
    try {
        const { data } = yield call(apiRoutes.getPoll.method, apiRoutes.getPoll.route(action.payload));
        yield put(pollVotingActions.getPoll.success(data));
    } catch (error) {
        handleError(error);
        yield put(pollVotingActions.getPoll.failure(error));
    }
}

function* watchGetPollAsync() {
    yield takeEvery(PollVotingActionTypeKeys.GET_POLL, getPollAsync);
}

export const pollVotingSagas = [watchGetPollAsync];
