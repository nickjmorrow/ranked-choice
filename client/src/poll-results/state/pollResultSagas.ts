import axios from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';
import { handleError } from '~/core';
import { pollVotingActions, PollVotingActionTypeKeys } from '~/poll-voting/state/pollVotingActions';
import { pollResultActions, PollResultActionTypeKeys } from '~/poll-results/state/pollResultActions';

const apiRoutes = {
    getPollResults: {
        route: (link: string) => `/polls/results/${link}`,
        method: axios.get,
    },
};

function* getPollResultsAsync(action: ReturnType<typeof pollResultActions.getPollResult.request>) {
    try {
        const { data } = yield call(apiRoutes.getPollResults.method, apiRoutes.getPollResults.route(action.payload));
        yield put(pollResultActions.getPollResult.success(data));
    } catch (error) {
        handleError(error);
        yield put(pollResultActions.getPollResult.failure(error));
    }
}

function* watchGetPollResultAsync() {
    yield takeEvery(PollResultActionTypeKeys.GET_POLL_RESULT, getPollResultsAsync);
}

export const pollResultSagas = [watchGetPollResultAsync];
