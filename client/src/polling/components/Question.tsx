// external
import React from 'react';
import styled from 'styled-components';
import { Typography } from '~/core/Typography';
import { Question as QuestionType } from '~/polling/types/Question';

export const Question: React.FC<{
    question: QuestionType;
    content: React.ReactNode;
    subheading: React.ReactNode;
    optionList: React.ReactNode;
    onClick?: () => void;
    removeButton?: React.ReactNode;
}> = ({
    question,
    content,
    subheading,
    optionList,
    removeButton,
    onClick: handleClick = () => {
        return;
    },
}) => {
    return (
        <QuestionContainer onClick={handleClick}>
            {removeButton}
            <Title>Question {question.orderId}</Title>
            <Content style={{ display: 'block' }}>{content}</Content>
            <Subheading style={{ display: 'block' }}>{subheading}</Subheading>
            {optionList}
        </QuestionContainer>
    );
};

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
`;

const QuestionContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: ${p => p.theme.spacing.ss4} 0;
    position: relative;
`;
