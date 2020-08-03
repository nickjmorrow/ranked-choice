// external
import React, { useState } from 'react';
import styled from 'styled-components';

// inter
import { Typography } from '~/core/Typography';

// intra
import { OptionContainer } from '~/polling/components/OptionContainer';

export const Option: React.FC<{
    label: React.ReactNode;
    sublabel: React.ReactNode;
    isSelected?: boolean;
    order?: (isHovering: boolean) => React.ReactNode;
    onClick?: () => void;
}> = ({
    label,
    sublabel,
    order,
    isSelected = false,
    onClick: handleClick = () => {
        return;
    },
}) => {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <Container
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={handleClick}
            isSelected={isSelected}
        >
            {order ? order(isHovering) : <div />}
            <Content>
                <Typography>{label}</Typography>
                <Sublabel>{sublabel}</Sublabel>
            </Content>
        </Container>
    );
};

const Container = styled(OptionContainer)<{ isSelected: boolean }>`
    background-color: ${p => (p.isSelected ? p.theme.coreColor.cs2 : p.theme.backgroundColor)};
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
`;

const Sublabel = styled(Typography)`
    font-size: ${p => p.theme.fontSizes.fs2};
    color: ${p => p.theme.neutralColor.cs6};
`;
