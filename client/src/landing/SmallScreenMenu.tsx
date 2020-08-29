// external
import React from 'react';
import styled from 'styled-components';

// inter
import { Link } from '~/core/molecules/Link';
import { componentRouteMappings } from '~/core/componentRouteMappings';

export const SmallScreenMenu: React.FC<{ onRequestClose: () => void }> = ({ onRequestClose: handleRequestClose }) => {
    return (
        <Container>
            {componentRouteMappings
                .filter(crm => crm.isVisible)
                .map(crm => (
                    <NavLink key={crm.route} onClick={handleRequestClose}>
                        <StyledLink route={crm.link || crm.route}>{crm.label}</StyledLink>
                    </NavLink>
                ))}
        </Container>
    );
};

const Container = styled.nav`
    background-color: ${p => p.theme.backgroundColor};
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
`;

const NavLink = styled.div``;

const StyledLink = styled(Link)`
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    padding: 32px;
    font-size: ${p => p.theme.fontSizes.fs7};
`;
