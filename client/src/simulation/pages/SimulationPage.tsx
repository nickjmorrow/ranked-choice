// external
import React from 'react';
import styled from 'styled-components';

// inter
import { CreateOptionsPage } from '~/simulation/pages/CreateOptionsPage';
import { VotingPage } from '~/simulation/pages/VotingPage';
import { ResultsPage } from '~/simulation/pages/ResultsPage';

// intra
import { PollContainer } from '~/polling/components/PollContainer';
import { Typography } from '~/core/Typography';
import { Link } from '~/core/Link';
import { useTypedSelector } from '~/redux';
import { routingSelectors } from '~/routing';

export const SimulationPage: React.FC = () => {
    const states = [
        { component: CreateOptionsPage, label: 'Create', stateId: 1, route: 'create' },
        { component: VotingPage, label: 'Vote', stateId: 2, route: 'vote' },
        { component: ResultsPage, label: 'Results', stateId: 3, route: 'results' },
    ];
    const subRoute = useTypedSelector(routingSelectors.getParam('/simulation/:link', 'link'));

    const activeState = states.find(s => s.route === subRoute)!;
    const Component = activeState.component;

    const style = activeState === states[2] ? { maxWidth: '800px' } : {};
    return (
        <PollContainer style={style}>
            <Typography variant={'h2'}>Voting Simulation</Typography>
            <StateListContainer>
                {states.map(s => (
                    <Link key={s.route} route={`/simulation/${s.route}`}>
                        <StateContainer key={s.stateId} isActive={s.route === activeState.route}>
                            <Typography> {s.label}</Typography>
                        </StateContainer>
                    </Link>
                ))}
            </StateListContainer>
            <Component />
        </PollContainer>
    );
};

const StateListContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: ${p => p.theme.spacing.ss16};
`;

const StateContainer = styled.div<{ isActive: boolean }>`
    min-width: ${p => p.theme.spacing.ss24};
    display: flex;
    justify-content: center;
    padding: ${p => p.theme.spacing.ss4} 0;
    background-color: ${p => (p.isActive ? p.theme.coreColor.cs3 : p.theme.coreColor.cs2)};
    transition: all ${p => p.theme.transitions.fast};
    width: 100%;
    cursor: pointer;
    &: hover {
        background-color: ${p => (p.isActive ? p.theme.coreColor.cs3 : p.theme.coreColor.cs1)};
        transition: all ${p => p.theme.transitions.fast};
    }
`;
