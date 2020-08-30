// external
import React from 'react';
import styled from 'styled-components';
import { Typography } from '~/core/atoms/Typography';
import { Link } from '~/core/molecules/Link';
import { useTypedSelector } from '~/redux';
import { routingSelectors } from '~/routing';
import { theme } from '~/theming';

export const VoteSuccessPage: React.FC = () => {
    const link = useTypedSelector(routingSelectors.getParam('/voting-success/:link', 'link'));
    return (
        <Container>
            <Typography style={{ marginBottom: theme.spacing.ss8 }}>Your vote was successfully cast.</Typography>
            <Typography>
                View poll results <Link route={`/results/${link}`}>here</Link>.
            </Typography>
        </Container>
    );
};

const Container = styled.div`
    margin-top: ${p => p.theme.spacing.ss16};
    display: flex;
    flex-direction: column;
    align-items: center;
`;
