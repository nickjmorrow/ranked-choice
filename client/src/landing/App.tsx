// external
import React from 'react';
import styled from 'styled-components';
import { Switch, Route } from 'react-router';
import { useMedia } from 'react-media';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import 'normalize.css';

// inter
import { NotFound } from '~/core/NotFound';
import { componentRouteMappings } from '~/core/componentRouteMappings';

// intra
import { Header } from '~/landing/Header';
import { Footer } from '~/landing/Footer';
import { store } from '~/store';
import { history } from '~/redux';
import { ThemeProvider } from '~/theming/ThemeProvider';
import { mediaQueries } from '~/core/mediaQueries';

export const App: React.SFC = () => {
    return (
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <ThemeProvider>
                    <Container>
                        <Header />
                        <Body>
                            <Main>
                                <Switch>
                                    {componentRouteMappings.map(crm => (
                                        <Route
                                            exact={crm.exact}
                                            key={crm.route}
                                            path={crm.route}
                                            component={crm.component}
                                        />
                                    ))}
                                    <Route component={NotFound} />
                                </Switch>
                            </Main>
                        </Body>
                        <Footer />
                    </Container>
                </ThemeProvider>
            </ConnectedRouter>
        </Provider>
    );
};

const Body = styled.div`
    display: flex;
    flex: 1;
    justify-content: center;
`;

const Main = styled.main`
    ${({ theme }) => `
		display:
    	flex: 1;
		margin: ${theme.spacing.ss8};
		max-width: 800px;
		width: 100%;
	`}
`;

const Container = styled.div`
    display: flex;
    min-height: 100vh;
    flex-direction: column;
`;
