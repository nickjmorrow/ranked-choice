// external
import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'react-router-redux';
import { createBrowserHistory } from 'history';

// intra
import { rootReducer } from '~/redux/rootReducer';
import { rootSaga } from '~/redux/rootSaga';

const sagaMiddleware = createSagaMiddleware();

const configureStore = () => {
    const middleware = [routerMiddleware(createBrowserHistory()), sagaMiddleware];

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middleware)));

    sagaMiddleware.run(rootSaga);
    return store;
};

export const store = configureStore();
