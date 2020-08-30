// external
import React from 'react';
import styled from 'styled-components';

// inter
import { Typography } from '~/core/atoms/Typography';
import { Link } from '~/core/molecules/Link';
import { useTypedSelector } from '~/redux';
import { routingSelectors } from '~/routing';
import { theme } from '~/theming';

export const CreatePollSuccessPage: React.FC = () => {
    const link = useTypedSelector(routingSelectors.getParam('/creation-success/:link', 'link'));
    return (
        <Container>
            <Typography variant={'h2'} style={{ marginBottom: theme.spacing.ss16 }}>
                Successfully created
            </Typography>
            <Typography style={{ display: 'block', marginBottom: theme.spacing.ss8 }}>
                You can vote on your poll <Link route={`/voting/${link}`}>here</Link>.
            </Typography>
            <Typography style={{ display: 'block' }}>
                You can view poll results <Link route={`/results/${link}`}>here</Link>.
            </Typography>
        </Container>
    );
};

const Container = styled.div`
    margin-top: ${p => p.theme.spacing.ss16};
`;
