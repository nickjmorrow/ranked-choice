// external
import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

// inter
import { Typography } from '~/core/atoms/Typography';

// intra
import { simulationSelectors } from '~/simulation/state/simulationSelectors';
import { Vote } from '~/simulation/components/Vote';

export const VotingPage: React.FC = () => {
    const votes = useSelector(simulationSelectors.getVotes);

    return (
        <Container>
            <Typography variant={'h3'}>Votes</Typography>
            <VotesContainer>
                {votes.map(v => (
                    <VoteContainer key={v.voterId}>
                        <Vote vote={v} />
                    </VoteContainer>
                ))}
            </VotesContainer>
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
`;

const VotesContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    justify-content: space-between;
`;

const VoteContainer = styled.div`
    margin-bottom: ${p => p.theme.spacing.ss6};
    margin-right: ${p => p.theme.spacing.ss8};
    width: 42%;
    max-width: 250px;
`;
