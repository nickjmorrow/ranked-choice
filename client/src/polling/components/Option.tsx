// external
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// inter
import { Typography } from '~/core/atoms/Typography';

// intra
import { OptionContainer } from '~/polling/components/OptionContainer';
import { CloseIcon } from '~/core/atoms/CloseIcon';

const noOp = () => {
    return;
};

export const Option: React.FC<{
    label: React.ReactNode;
    sublabel?: React.ReactNode;
    isSelected?: boolean;
    removeButton?: React.ReactNode;
    showOrderIdFunc?: (isHovering: boolean) => React.ReactNode;
    onClick?: () => void;
    containerStyle?: React.CSSProperties;
}> = ({
    label,
    sublabel,
    showOrderIdFunc,
    isSelected = false,
    removeButton,
    onClick: handleClick = noOp,
    containerStyle,
}) => {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <Container
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={handleClick}
            isSelected={isSelected}
            style={containerStyle}
        >
            {removeButton}
            {showOrderIdFunc ? showOrderIdFunc(isHovering) : <div />}
            <Content>
                <Typography>{label}</Typography>
                {sublabel && <Sublabel>{sublabel}</Sublabel>}
            </Content>
        </Container>
    );
};

const Container = styled(OptionContainer)<{ isSelected: boolean }>`
    background-color: ${p => (p.isSelected ? p.theme.coreColor.cs2 : p.theme.backgroundColor)};
    position: relative;
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
