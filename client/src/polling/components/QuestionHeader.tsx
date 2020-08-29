// external
import React from 'react';
import styled from 'styled-components';
import { Typography } from '~/core/atoms/Typography';

export const QuestionHeader: React.FC<{ orderId: number; content: React.ReactNode; subheading?: React.ReactNode }> = ({
    orderId,
    content,
    subheading,
}) => {
    return (
        <Container>
            <Title>Question {orderId}</Title>
            <Content style={{ display: 'block' }}>{content}</Content>
            <Subheading style={{ display: 'block' }}>{subheading}</Subheading>
        </Container>
    );
};

const Container = styled.div``;

const Title = styled(Typography)`
    display: inline-block;
    font-size: ${p => p.theme.fontSizes.fs1};
    margin-bottom: ${p => p.theme.spacing.ss4};
`;

const Content = styled(Typography)`
    margin-bottom: ${p => p.theme.spacing.ss2};
    width: 100%;
`;

const Subheading = styled(Typography)`
    display: block;
    color: ${p => p.theme.neutralColor.cs7};
    font-size: ${p => p.theme.fontSizes.fs2};
    margin-bottom: ${p => p.theme.spacing.ss4};
    width: 100%;
`;
