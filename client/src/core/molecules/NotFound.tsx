import React from 'react';
import styled from 'styled-components';
import { Typography } from '~/core/atoms/Typography';

export const NotFound = () => (
    <Container>
        <Typography variant={'h2'}>Not Found</Typography>
        <Typography>The resource you were looking for could not be found.</Typography>
    </Container>
);

const Container = styled.div``;
