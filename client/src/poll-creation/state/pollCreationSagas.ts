import axios from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';
import { handleError } from '~/core';
import { pollVotingActions, PollVotingActionTypeKeys } from '~/poll-voting/state/pollVotingActions';
import { pollCreationActions, PollCreationActionTypeKeys } from '~/poll-creation/state/pollCreationActions';

const apiRoutes = {
    createPoll: {
        route: '/polls',
        method: axios.post,
    },
    voteOnPoll: {
        route: '/polls/vote',
        method: axios.post,
    },
};

function* createPollAsync(action: ReturnType<typeof pollCreationActions.createPoll.request>) {
    try {
        const { data } = yield call(apiRoutes.createPoll.method, apiRoutes.createPoll.route, action.payload);
        yield put(pollCreationActions.createPoll.success(data));
    } catch (error) {
        handleError(error);
        yield put(pollCreationActions.createPoll.failure(error));
    }
}

function* watchCreatePollAsync() {
    yield takeEvery(PollCreationActionTypeKeys.CREATE_POLL, createPollAsync);
}

export const pollCreationSagas = [watchCreatePollAsync];
