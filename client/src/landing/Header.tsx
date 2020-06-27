import * as React from 'react';
import styled from 'styled-components';
import { Typography } from '~/core/Typography';
import { Link } from '~/core/Link';

export const Header: React.FC = () => {
    return (
        <StyledHeader>
            <AppName variant={'h1'}>Unnamed Voting Project</AppName>
            <RightAligned>
                <HeaderLink route={'/about'}>About</HeaderLink>
            </RightAligned>
        </StyledHeader>
    );
};

const StyledHeader = styled.header`
    display: flex;
    align-items: center;
    padding: 32px 64px;
    justify-content: space-between;
    background-color: ${p => p.theme.neutralColor.cs2};
`;

const AppName = styled(Typography)`
    margin: 0;
`;

const HeaderLink = styled(Link)`
    font-size: 16px;
    width: max-content;
    display: block;
    padding: 16px;
    margin-left: 16px;
    border-radius: ${p => p.theme.borderRadius.br1};
    transition: all ${p => p.theme.transitions.fast};
    &: hover {
        transition: all ${p => p.theme.transitions.fast};
        background-color: ${p => p.theme.coreColor.cs1};
    }
`;

const RightAligned = styled.div`
    display: flex;
    flex-direction: row;
`;
