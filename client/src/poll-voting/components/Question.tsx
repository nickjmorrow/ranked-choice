// external
import React from 'react';
import styled from 'styled-components';
import { Typography } from '~/core/Typography';
import { Option } from '~/poll-voting/components/Option';
import { QuestionWithVote, FilledOrderedOption } from '~/poll-voting/types/QuestionWithVote';

export const Question: React.FC<{ question: QuestionWithVote }> = ({ question }) => {
    const orderedOptions = question.options.filter((o): o is FilledOrderedOption => o.orderId !== null);
    const unorderedOptions = question.options.filter(o => o.orderId === null);
    return (
        <Container>
            <Title>Question {question.orderId}</Title>
            <Content style={{ display: 'block' }}>{question.content}</Content>
            <Subheading style={{ display: 'block' }}>{question.subheading}</Subheading>
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

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: ${p => p.theme.spacing.ss4} 0;
`;

const OptionsContainer = styled.div``;

const Title = styled(Typography)`
    display: inline-block;
    color: ${p => p.theme.neutralColor.cs5};
    font-size: ${p => p.theme.fontSizes.fs1};
    margin-bottom: ${p => p.theme.spacing.ss4};
`;

const Content = styled(Typography)`
    margin-bottom: ${p => p.theme.spacing.ss2};
`;

const Subheading = styled(Typography)`
    display: block;
    color: ${p => p.theme.neutralColor.cs5};
    font-size: ${p => p.theme.fontSizes.fs2};
    margin-bottom: ${p => p.theme.spacing.ss4};
    line-height: 1.4rem;
`;
