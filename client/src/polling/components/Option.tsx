// external
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// inter
import { Typography } from '~/core/Typography';

// intra
import { OptionContainer } from '~/polling/components/OptionContainer';
import { CloseIcon } from '~/core/CloseIcon';

const noOp = () => {
    return;
};

export const Option: React.FC<{
    label: React.ReactNode;
    sublabel: React.ReactNode;
    isSelected?: boolean;
    onRemove?: () => void;
    showOrderIdFunc?: (isHovering: boolean) => React.ReactNode;
    onClick?: () => void;
}> = ({
    label,
    sublabel,
    showOrderIdFunc,
    isSelected = false,
    onClick: handleClick = noOp,
    onRemove: handleRemove,
}) => {
    const [isHovering, setIsHovering] = useState(false);

    const isRemovable = handleRemove !== undefined;

    return (
        <Container
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={handleClick}
            isSelected={isSelected}
        >
            {isRemovable && (
                <CloseIcon style={{ position: 'absolute', top: '5px', right: '0px', height: '20px', width: '20px' }} onClick={handleRemove} />
            )}
            {showOrderIdFunc ? showOrderIdFunc(isHovering) : <div />}
            <Content>
                <Typography>{label}</Typography>
                <Sublabel>{sublabel}</Sublabel>
            </Content>
        </Container>
    );
};

const Container = styled(OptionContainer)<{ isSelected: boolean }>`
    background-color: ${p => (p.isSelected ? p.theme.coreColor.cs2 : p.theme.backgroundColor)};
    max-width: ${p => p.theme.spacing.ss128};
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
