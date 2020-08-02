import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import * as React from 'react';
import { Typography } from '~/core/Typography';

export const Link: React.FC<{
    route: string;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}> = ({ route, children, className, style }) => {
    return (
        <StyledLink className={className} to={route} style={style}>
            <StyledTypography sizeVariant={'inherit'} colorVariant={'inherit'}>
                {children}
            </StyledTypography>
        </StyledLink>
    );
};

const StyledLink = styled(RouterLink)`
    text-decoration: none;
    cursor: pointer;
`;

const StyledTypography = styled(Typography)`
    color: ${p => p.theme.coreColor.cs4};
`;
