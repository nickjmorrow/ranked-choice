// external
import axios from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';
import { push } from 'connected-react-router';

// inter
import { handleError } from '~/core';

// intra
import { pollCreationActions, PollCreationActionTypeKeys } from '~/poll-creation/state/pollCreationActions';

const apiRoutes = {
    createPoll: {
        route: '/polls/create',
        method: axios.post,
    },
};

function* createPollAsync(action: ReturnType<typeof pollCreationActions.createPoll.request>) {
    try {
        const { data } = yield call(apiRoutes.createPoll.method, apiRoutes.createPoll.route, action.payload);
        yield put(pollCreationActions.createPoll.success(data));
        yield put(push(`/creation-success/${data.link}`));
    } catch (error) {
        handleError(error);
        yield put(pollCreationActions.createPoll.failure(error));
    }
}

function* watchCreatePollAsync() {
    yield takeEvery(PollCreationActionTypeKeys.CREATE_POLL, createPollAsync);
}

export const pollCreationSagas = [watchCreatePollAsync];
