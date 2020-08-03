// external
import React, { useState } from 'react';
import styled from 'styled-components';
import { QuestionResult as QuestionResultType } from '~/poll-results/types/QuestionResult';
import { ResultGraph } from '~/simulation/components/ResultGraph';
import { OptionBar } from '~/polling/components/OptionBar';

export const QuestionResult: React.FC<{ questionResult: QuestionResultType }> = ({ questionResult }) => {
    const [currentRoundId, setCurrentRoundId] = useState(questionResult.rounds[0].roundId);
    return (
        <Container>
            {questionResult.question.questionId}
            {questionResult.question.content}
            {questionResult.rounds.map(r => (
                <OptionBar key={r.roundId} onClick={() => setCurrentRoundId(r.roundId)}>
                    Round {r.roundId}
                </OptionBar>
            ))}
            <ResultGraph
                optionVoteResults={questionResult.rounds.find(r => r.roundId === currentRoundId)!.optionResults}
                options={questionResult.question.options}
            />
        </Container>
    );
};

const Container = styled.div``;
