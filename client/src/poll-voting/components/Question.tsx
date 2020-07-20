// external
import React from 'react';
import styled from 'styled-components';
import { Typography } from '~/core/Typography';
import { Card } from '~/core/Card';
import { Option } from '~/poll-voting/components/Option';
import { QuestionWithVote, FilledOrderedOption } from '~/poll-voting/types/QuestionWithVote';

export const Question: React.FC<{ question: QuestionWithVote }> = ({ question }) => {
    const orderedOptions = question.options.filter((o): o is FilledOrderedOption => o.orderId !== null);
    const unorderedOptions = question.options.filter(o => o.orderId === null);
    return (
        <Container>
            <Typography>{question.orderId}</Typography>
            <Typography>{question.content}</Typography>
            <Typography>{question.subheading}</Typography>
            <OptionsContainer>
                {orderedOptions
                    .sort((a, b) => (a.orderId < b.orderId ? -1 : 1))
                    .map(o => (
                        <Option key={o.optionId} option={o} question={question} />
                    ))}
                {unorderedOptions.map(o => (
                    <Option key={o.optionId} option={o} question={question} />
                ))}
            </OptionsContainer>
        </Container>
    );
};

const Container = styled(Card)``;

const OptionsContainer = styled.div``;
