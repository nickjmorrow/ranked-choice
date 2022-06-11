// external
import axios from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';
import { push } from 'connected-react-router';

// inter
import { handleError } from '~/core';

// intra
import { pollCreationActions, PollCreationActionTypeKeys } from '~/poll-creation/state/pollCreationActions';
import { CreateQuestionModel } from '~/polling/types/CreateQuestionModel';

const apiRoutes = {
    createPoll: {
        route: '/polls/create',
        method: axios.post,
    },
};

function* createPollAsync(action: ReturnType<typeof pollCreationActions.createPoll.request>) {
    try {
        const createQuestionModels = action.payload.poll.questions.map(
            ({ orderId, content, subheading, isRequired, options }): CreateQuestionModel => ({
                orderId,
                content,
                subheading,
                isRequired,
                options,
            }),
        );
        const createPollModel = { poll: { ...action.payload.poll, questions: createQuestionModels } };
        const { data } = yield call(apiRoutes.createPoll.method, apiRoutes.createPoll.route, createPollModel);
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
