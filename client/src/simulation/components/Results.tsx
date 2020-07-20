import * as React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { simulationSelectors } from '~/simulation/state/simulationSelectors';
import { Typography } from '~/core/Typography';
import { ResultGraph } from '~/simulation/components/ResultGraph';
import { OptionBar } from '~/polling/components/OptionBar';
import { useMedia } from 'react-media';
import { mediaQueries } from '~/core/mediaQueries';
import { simulationActions } from '~/simulation/state/simulationActions';
import { Round } from '~/polling/types/Round';

export const Results: React.FC = () => {
    const options = useSelector(simulationSelectors.getOptions);
    const votes = useSelector(simulationSelectors.getVotes);
    const pollResult = useSelector(simulationSelectors.getPollResult);
    const screenSize = useMedia({ queries: mediaQueries });
    const dispatch = useDispatch();
    const [activeRound, setActiveRound] = React.useState<Round | null>(null);

    React.useEffect(() => {
        dispatch(
            simulationActions.calculatePollResult.request({
                poll: {
                    questions: [
                        {
                            optionIds: options.map(o => o.optionId),
                            votes,
                        },
                    ],
                },
            }),
        );
    }, []);

    if (pollResult === null) {
        return null;
    }

    const { questionResults } = pollResult;
    const { rounds } = questionResults[0];
    if (activeRound === null) {
        setActiveRound(rounds[rounds.length - 1]);
    }

    return (
        <Container>
            <Typography variant={'h3'}>Results</Typography>
            <MainContainer>
                <RoundsContainer>
                    {rounds
                        .slice()
                        .sort((a, b) => (a.roundId < b.roundId ? 1 : -1))
                        .map(r => (
                            <RoundButtonBar key={r.roundId} onClick={() => setActiveRound(r)}>
                                <Typography variant={'h3'} style={{ margin: '0' }}>{`Round ${r.roundId}`}</Typography>
                                {activeRound?.roundId === r.roundId && (
                                    <OptionListContainer>
                                        {options.map(o => (
                                            <OptionContainer key={o.optionId}>
                                                <Typography>
                                                    {o.label}:{' '}
                                                    {r.optionResults.find(ovr => ovr.optionId === o.optionId)
                                                        ?.voteCount ?? '0'}
                                                </Typography>
                                            </OptionContainer>
                                        ))}
                                    </OptionListContainer>
                                )}
                            </RoundButtonBar>
                        ))}
                </RoundsContainer>
                {activeRound && (
                    <ResultGraph
                        style={{ marginTop: screenSize.small ? '0' : '-64px' }}
                        optionVoteResults={activeRound.optionResults}
                        options={options}
                    />
                )}
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
    flex-wrap: wrap;
`;
