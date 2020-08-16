import React from 'react';
import styled from 'styled-components';
import { Typography } from '~/core/Typography';

export const Footer: React.FC = () => {
    return <StyledFooter></StyledFooter>;
};

const StyledFooter = styled.footer`
    height: 64px;
    padding: 0 64px;
    display: flex;
    align-items: center;
    background-color: ${p => p.theme.neutralColor.cs2};
`;
