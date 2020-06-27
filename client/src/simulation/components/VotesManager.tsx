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
            <Typography variant={'h2'}>Votes</Typography>
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

const Container = styled.div``;

const VotesContainer = styled(OptionBarListContainer)`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
`;

const VoteContainer = styled.div`
    margin-right: ${p => p.theme.spacing.ss6};
    margin-bottom: ${p => p.theme.spacing.ss6};
`;
