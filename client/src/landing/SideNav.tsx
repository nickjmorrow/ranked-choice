import * as React from 'react';
import { Link } from '~/core/Link';
import styled from 'styled-components';
import { componentRouteMappings } from '~/core/componentRouteMappings';

export const SideNav: React.FC = () => {
    return (
        <StyledNav>
            {componentRouteMappings
                .filter(crm => crm.isVisible)
                .map(crm => (
                    <NavLink key={crm.route}>
                        <StyledLink route={crm.route}>{crm.label}</StyledLink>
                    </NavLink>
                ))}
        </StyledNav>
    );
};

const StyledNav = styled.nav`
    display: flex;
    flex-direction: column;
    width: 240px;
    padding-top: ${p => p.theme.spacing.ss12};
`;

const NavLink = styled.div``;

const StyledLink = styled(Link)`
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    padding-left: 64px;
`;
