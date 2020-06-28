import * as React from 'react';
import styled from 'styled-components';
import { Typography } from '~/core/Typography';
import { OptionsManager } from '~/simulation/components/OptionsManager';
import { VotesManager } from '~/simulation/components/VotesManager';
import { Results } from '~/simulation/components/Results';

export const SimulationPage: React.FC = () => {
    const states = [
        { component: OptionsManager, label: 'Options', stateId: 1 },
        { component: VotesManager, label: 'Votes', stateId: 2 },
        { component: Results, label: 'Results', stateId: 3 },
    ];
    const [currentState, setCurrentState] = React.useState(states[2]);

    return (
        <Container>
            <Typography variant={'h2'}>Voting Simulation</Typography>
            <StateListContainer>
                {states.map(s => (
                    <StateContainer
                        isActive={currentState.stateId === s.stateId}
                        key={s.stateId}
                        onClick={() => setCurrentState(s)}
                    >
                        <Typography> {s.label}</Typography>
                    </StateContainer>
                ))}
            </StateListContainer>

            <CurrentComponentContainer>
                <currentState.component />
            </CurrentComponentContainer>
        </Container>
    );
};

const CurrentComponentContainer = styled.div``;

const Container = styled.div``;

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
