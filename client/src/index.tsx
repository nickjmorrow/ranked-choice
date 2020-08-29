import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import { getBaseUrl } from '~/core/services/getBaseUrl';
import { App } from '~/landing/App';

axios.defaults.baseURL = getBaseUrl();

ReactDOM.render(<App />, document.querySelector('#container'));

if (module && module.hot) {
    module.hot.accept();

    module.hot.addStatusHandler(status => {
        if (status === 'prepare') console.clear();
    });
}
