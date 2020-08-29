// external
import React from 'react';
import styled from 'styled-components';

// inter
import { Typography } from '~/core/atoms/Typography';

export const TitleDescription: React.FC<{ title: React.ReactNode; description: React.ReactNode }> = ({
    title,
    description,
}) => {
    return (
        <Container>
            <Title>{title}</Title>
            <Description>{description}</Description>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const Title = styled.h2`
    font-family: ${p => p.theme.fontFamilies.default};
`;

const Description = styled(Typography)`
    line-height: 1.4rem;
`;
