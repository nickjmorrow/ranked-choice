// external
import React from 'react';
import styled from 'styled-components';
import { Typography } from '~/core/atoms/Typography';
import { Question as QuestionType } from '~/polling/types/Question';
import { QuestionHeader } from '~/polling/components/QuestionHeader';
import { QuestionContainer } from '~/polling/components/QuestionContainer';

export const Question: React.FC<{
    question: QuestionType;
    content: React.ReactNode;
    subheading: React.ReactNode;
    optionList: React.ReactNode;
    onClick?: () => void;
    removeButton?: React.ReactNode;
}> = ({
    question: { orderId },
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
            <QuestionHeader orderId={orderId} content={content} subheading={subheading} />
            {optionList}
        </QuestionContainer>
    );
};
