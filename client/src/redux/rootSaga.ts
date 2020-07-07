import { all, AllEffect, fork } from 'redux-saga/effects';
import { simulationApi } from '~/simulation';

export function* rootSaga(): Generator<AllEffect<never>, void, unknown> {
    yield all(simulationApi.sagas.map(s => fork(s)) as any);
}
