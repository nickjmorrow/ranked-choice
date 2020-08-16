// external
import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'connected-react-router';

// intra
import { createRootReducer } from '~/redux/createRootReducer';
import { rootSaga } from '~/redux/rootSaga';
import { history } from '~/redux/history';

const sagaMiddleware = createSagaMiddleware();

const configureStore = () => {
    const middleware = [routerMiddleware(history), sagaMiddleware];

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(createRootReducer(history), composeEnhancers(applyMiddleware(...middleware)));

    sagaMiddleware.run(rootSaga);
    return store;
};

export const store = configureStore();
