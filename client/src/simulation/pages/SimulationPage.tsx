// external
import React from 'react';
import styled from 'styled-components';

// inter
import { OptionsManager } from '~/simulation/components/OptionsManager';
import { VotesManager } from '~/simulation/components/VotesManager';
import { Results } from '~/simulation/components/Results';

// intra
import { PollContainer } from '~/polling/components/PollContainer';
import { Typography } from '~/core/Typography';
import { Link } from '~/core/Link';
import { useTypedSelector } from '~/redux';
import { routingSelectors } from '~/routing';

export const SimulationPage: React.FC = () => {
    const states = [
        { component: OptionsManager, label: 'Create', stateId: 1, route: 'create' },
        { component: VotesManager, label: 'Vote', stateId: 2, route: 'vote' },
        { component: Results, label: 'Results', stateId: 3, route: 'results' },
    ];
    const subRoute = useTypedSelector(routingSelectors.getParam('/simulation/:link', 'link'));

    const activeState = states.find(s => s.route === subRoute)!;
    const Component = activeState.component;

    return (
        <PollContainer>
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
            <CurrentComponentContainer>
                <Component />
            </CurrentComponentContainer>
        </PollContainer>
    );
};

const CurrentComponentContainer = styled.div``;

const StateListContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
`;

const StateContainer = styled.div<{ isActive: boolean }>`
    min-width: ${p => p.theme.spacing.ss24};
    display: flex;
    justify-content: center;
    padding: ${p => p.theme.spacing.ss4} 0;
    background-color: ${p => (p.isActive ? p.theme.coreColor.cs3 : p.theme.coreColor.cs2)};
    transition: all ${p => p.theme.transitions.fast};
    cursor: pointer;

    &: hover {
        background-color: ${p => (p.isActive ? p.theme.coreColor.cs3 : p.theme.coreColor.cs1)};
        transition: all ${p => p.theme.transitions.fast};
    }
`;
