// external
import React, { useState } from 'react';
import styled from 'styled-components';
import { QuestionResult as QuestionResultType } from '~/poll-results/types/QuestionResult';
import { ResultGraph } from '~/simulation/components/ResultGraph';
import { OptionBar } from '~/polling/components/OptionBar';
import { QuestionHeader } from '~/polling/components/QuestionHeader';
import { QuestionContainer } from '~/polling/components/QuestionContainer';
import { Typography } from '~/core/Typography';

export const QuestionResult: React.FC<{ questionResult: QuestionResultType }> = ({ questionResult }) => {
    const [currentRoundId, setCurrentRoundId] = useState(questionResult.rounds[0].roundId);
    const {
        question: { questionId, content, subheading },
        rounds,
    } = questionResult;
    return (
        <QuestionContainer>
            <QuestionHeader orderId={questionId} content={content} subheading={subheading} />
            {rounds.map(r => (
                <OptionBar key={r.roundId} onClick={() => setCurrentRoundId(r.roundId)}>
                    <Typography>Round {r.roundId}</Typography>
                </OptionBar>
            ))}
            <ResultGraph
                optionVoteResults={questionResult.rounds.find(r => r.roundId === currentRoundId)!.optionResults}
                options={questionResult.question.options}
            />
        </QuestionContainer>
    );
};
