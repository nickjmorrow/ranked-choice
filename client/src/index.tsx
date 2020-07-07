import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { App } from '~/landing/App';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '~/theming/ThemeProvider';
import axios from 'axios';
import { getBaseUrl } from '~/core/getBaseUrl';

axios.defaults.baseURL = getBaseUrl();

ReactDOM.render(<App />, document.querySelector('#container'));

if (module && module.hot) {
    module.hot.accept();

    module.hot.addStatusHandler(status => {
        if (status === 'prepare') console.clear();
    });
}
