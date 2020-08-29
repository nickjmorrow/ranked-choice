// external
import React from 'react';
import styled from 'styled-components';
import { Typography } from '~/core/atoms/Typography';

export const VoteSuccessPage: React.FC = () => {
    return (
        <Container>
            <Typography>Your vote was successfully cast.</Typography>
        </Container>
    );
};

const Container = styled.div`
    margin-top: ${p => p.theme.spacing.ss16};
`;
