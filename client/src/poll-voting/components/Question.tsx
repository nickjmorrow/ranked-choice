// external
import React from 'react';
import styled from 'styled-components';
import { Typography } from '~/core/Typography';
import { Card } from '~/core/Card';
import { Option } from '~/poll-voting/components/Option';
import { QuestionWithVote } from '~/poll-voting/types/QuestionWithVote';

export const Question: React.FC<{ question: QuestionWithVote }> = ({ question }) => {
    return (
        <Container>
            <Typography>{question.orderId}</Typography>
            <Typography>{question.content}</Typography>
            <Typography>{question.subheading}</Typography>
            <OptionsContainer>
                {question.options.map(o => (
                    <Option key={o.optionId} option={o} question={question} />
                ))}
            </OptionsContainer>
        </Container>
    );
};

const Container = styled(Card)``;

const OptionsContainer = styled.div``;
