// external
import React from 'react';
import styled from 'styled-components';
import { Switch, Route } from 'react-router';
import { useMedia } from 'react-media';
import 'normalize.css';

// inter
import { NotFound } from '~/core/NotFound';
import { componentRouteMappings } from '~/core/componentRouteMappings';

// intra
import { Header } from '~/landing/Header';
import { SideNav } from '~/landing/SideNav';
import { Footer } from '~/landing/Footer';
import { Provider } from 'react-redux';
import { store } from '~/store';
import { history } from '~/redux';
import { ThemeProvider } from '~/theming/ThemeProvider';
import { mediaQueries } from '~/core/mediaQueries';
import { ConnectedRouter } from 'connected-react-router';

export const App: React.SFC = () => {
    const screenSize = useMedia({ queries: mediaQueries });
    return (
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <ThemeProvider>
                    <Container>
                        <Header />
                        <Body>
                            {!screenSize.small && <SideNav />}
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
`;

const Main = styled.main`
    flex: 1;
    margin: ${p => p.theme.spacing.ss6} ${p => p.theme.spacing.ss8};
`;

const Container = styled.div`
    display: flex;
    min-height: 100vh;
    flex-direction: column;
`;
