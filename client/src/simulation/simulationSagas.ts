import axios from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';
import { SimulationActionTypeKeys, simulationActions } from '~/simulation/state/simulationActions';
import { handleError } from '~/core';

const apiRoutes = {
    calculatePollResult: {
        route: '/poll-result-calculation',
        method: axios.post,
    },
};

function* calculatePollResultsAsync(action: ReturnType<typeof simulationActions.calculatePollResult.request>) {
    try {
        const { data } = yield call(
            apiRoutes.calculatePollResult.method,
            apiRoutes.calculatePollResult.route,
            action.payload,
        );
        yield put(simulationActions.calculatePollResult.success(data));
    } catch (error) {
        handleError(error);
        yield put(simulationActions.calculatePollResult.failure(error));
    }
}

function* watchCalculatePollResultsAsync() {
    yield takeEvery(SimulationActionTypeKeys.CALCULATE_POLL_RESULT, calculatePollResultsAsync);
}

export const simulationSagas = [watchCalculatePollResultsAsync];
