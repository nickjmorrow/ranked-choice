import * as React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { simulationSelectors } from '~/simulation/state/simulationSelectors';
import { Typography } from '~/core/Typography';
import { Vote } from '~/simulation/components/Vote';
import { OptionBarListContainer } from '~/simulation/components/OptionBarListContainer';

export const VotesManager: React.FC = () => {
    const votes = useSelector(simulationSelectors.getVotes);

    return (
        <Container>
            <Typography variant={'h3'}>Votes</Typography>
            <OptionBarListContainer>
                {votes.map(v => (
                    <Vote vote={v} key={v.voterId} />
                ))}
            </OptionBarListContainer>
        </Container>
    );
};

const Container = styled.div``;

const VotesContainer = styled.div``;
