import { all, AllEffect, fork } from 'redux-saga/effects';
import { simulationApi } from '~/simulation';
import { pollVotingApi } from '~/poll-voting';

export function* rootSaga(): Generator<AllEffect<never>, void, unknown> {
    const sagas = [...simulationApi.sagas, ...pollVotingApi.sagas];
    yield all(sagas.map(s => fork(s)) as any);
}
