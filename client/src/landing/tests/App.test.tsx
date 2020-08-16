import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { App } from '~/landing/App';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { createRootReducer } from '~/redux/createRootReducer';
import { MemoryRouter } from 'react-router';
import { ThemeProvider } from '~/theming/ThemeProvider';
import { history } from '~/redux';

let container = (null as unknown) as HTMLDivElement;

beforeAll(() => {
    window.matchMedia = (): any => ({
        addListener: () => {
            return;
        },
        removeListener: () => {
            return;
        },
    });
});
beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    (container as unknown) = null;
});

it('renders without error', () => {
    act(() => {
        const store = createStore(createRootReducer(history));
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
