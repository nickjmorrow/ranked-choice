import { all, AllEffect, fork } from 'redux-saga/effects';
import { simulationApi } from '~/simulation';
import { pollVotingApi } from '~/poll-voting';
import { pollCreationApi } from '~/poll-creation';
import { pollResultsApi } from '~/poll-results';

export function* rootSaga(): Generator<AllEffect<never>, void, unknown> {
    const apis = [simulationApi, pollVotingApi, pollCreationApi, pollResultsApi];
    const sagas = apis.flatMap(a => a.sagas);
    yield all(sagas.map(s => fork(s)) as any);
}
