import * as React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { simulationSelectors } from '~/simulation/state/simulationSelectors';
import { calculatePollResult } from '~/simulation/services/calculatePollResult';
import { Typography } from '~/core/Typography';
import { ResultGraph } from '~/simulation/components/ResultGraph';
import { OptionBar } from '~/simulation/components/OptionBar';

export const Results: React.FC = () => {
    const options = useSelector(simulationSelectors.getOptions);
    const votes = useSelector(simulationSelectors.getVotes);
    const { rounds } = calculatePollResult({ options, votes });
    const [activeRound, setActiveRound] = React.useState(rounds[rounds.length - 1]);

    return (
        <Container>
<<<<<<< HEAD
            <Typography variant={'h3'}>Results</Typography>
=======
            <Typography variant={'h2'}>Results</Typography>
>>>>>>> master
            <MainContainer>
                <RoundsContainer>
                    {rounds
                        .sort((a, b) => (a.roundId < b.roundId ? 1 : -1))
                        .map(r => (
                            <RoundButtonBar key={r.roundId} onClick={() => setActiveRound(r)}>
                                <Typography variant={'h3'} style={{ margin: '0' }}>{`Round ${r.roundId}`}</Typography>
                                {activeRound.roundId === r.roundId && (
                                    <OptionListContainer>
                                        {options.map(o => (
                                            <OptionContainer key={o.optionId}>
                                                <Typography>
                                                    {o.label}:{' '}
                                                    {
                                                        r.optionVoteResults.find(ovr => ovr.optionId === o.optionId)!
                                                            .voteCount
                                                    }
                                                </Typography>
                                            </OptionContainer>
                                        ))}
                                    </OptionListContainer>
                                )}
                            </RoundButtonBar>
                        ))}
                </RoundsContainer>
                <ResultGraph style={{ marginTop: '-64px' }} optionVoteResults={activeRound.optionVoteResults} />
            </MainContainer>
        </Container>
    );
};

const Container = styled.div``;

const RoundsContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-right: ${p => p.theme.spacing.ss16};
`;

const RoundButtonBar = styled(OptionBar)`
    margin-bottom: ${p => p.theme.spacing.ss8};
    cursor: pointer;
`;

const OptionListContainer = styled.div`
    margin-top: ${p => p.theme.spacing.ss6};
`;

const OptionContainer = styled.div`
    margin: ${p => p.theme.spacing.ss4} 0;
`;

const MainContainer = styled.div`
    display: flex;
    flex-direction: row;
`;
