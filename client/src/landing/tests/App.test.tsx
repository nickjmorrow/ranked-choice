import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { App } from '~/landing/App';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { rootReducer } from '~/redux/rootReducer';
import { MemoryRouter } from 'react-router';
import { ThemeProvider } from '~/theming/ThemeProvider';

let container = (null as unknown) as HTMLDivElement;
beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    (container as unknown) = null;
});

it('renders with an error', () => {
    act(() => {
        const store = createStore(rootReducer);
        render(
            <MemoryRouter>
                <Provider store={store}>
                    <ThemeProvider>
                        <App />
                    </ThemeProvider>
                </Provider>
            </MemoryRouter>,
            container,
        );
    });
});
