import React, { useState } from 'react';
import styled from 'styled-components';
import { Typography } from '~/core/Typography';
import { Link } from '~/core/Link';
import { useMedia } from 'react-media';
import { mediaQueries } from '~/core/mediaQueries';
import { MenuIcon } from '~/core/MenuIcon';
import { SmallScreenMenu } from '~/landing/SmallScreenMenu';

export const Header: React.FC = () => {
    const screenSize = useMedia({ queries: mediaQueries });
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <>
            {screenSize.small ? (
                <>
                    <SmallScreenHeader>
                        <MenuIcon
                            style={{ position: 'absolute', left: '20px', cursor: 'pointer' }}
                            onClick={() => setIsMenuOpen(c => !c)}
                        />
                        <Link route={'/'}>
                            <SmallAppName variant={'h1'}>Unnamed Voting Project</SmallAppName>
                        </Link>
                    </SmallScreenHeader>
                    {isMenuOpen && <SmallScreenMenu onRequestClose={() => setIsMenuOpen(false)} />}
                </>
            ) : (
                <StyledHeader>
                    <Link route={'/'}>
                        <AppName variant={'h1'}>Unnamed Voting Project</AppName>
                    </Link>
                </StyledHeader>
            )}
        </>
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

const SmallAppName = styled(AppName)`
    font-size: 24px;
`;

const SmallScreenHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${p => p.theme.neutralColor.cs2};
    padding: 24px 12px;
`;
