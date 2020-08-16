// external
import React, { useState } from 'react';
import styled from 'styled-components';
import { useMedia } from 'react-media';

// inter
import { mediaQueries } from '~/core/mediaQueries';
import { Typography } from '~/core/Typography';

// intra
import { ResultGraph } from '~/polling/components/ResultGraph';
import { RoundListContainer } from '~/polling/components/RoundListContainer';
import { Round } from '~/polling/types/Round';
import { Option } from '~/polling/types/Option';
import { theme } from '~/theming/theme';

export const QuestionResult: React.FC<{ options: Option[]; rounds: Round[] }> = ({ options, rounds }) => {
    const [activeRound, setActiveRound] = useState(rounds[rounds.length - 1]);
    const handleClick = (round: Round) => setActiveRound(round);
    const screenSize = useMedia({ queries: mediaQueries });
    const votesCast = rounds
        .flatMap(r => r.optionResults.flatMap(or => or.voteCount))
        .reduce((sum, current) => sum + current, 0);

    return (
        <Container>
            {votesCast > 0 ? (
                <>
                    <RoundListContainer
                        rounds={rounds}
                        options={options}
                        activeRound={activeRound}
                        onClick={handleClick}
                        style={{ marginRight: theme.spacing.ss16 }}
                    />
                    <ResultGraph optionVoteResults={activeRound.optionResults} options={options} />
                </>
            ) : (
                <Typography
                    style={{ display: 'block', margin: `${theme.spacing.ss16} 0`, color: theme.neutralColor.cs5 }}
                >
                    No votes have yet been cast for this question.
                </Typography>
            )}
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: row;
    margin: ${p => p.theme.spacing.ss4} 0;
    position: relative;
    flex-wrap: wrap;
`;
