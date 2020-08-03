// external
import React, { useState } from 'react';
import styled from 'styled-components';
import { Option as OptionType } from '~/polling/types/Option';
import { Typography } from '~/core/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { pollVotingActions } from '~/poll-voting/state/pollVotingActions';
import { QuestionWithVote, OrderedOption } from '~/poll-voting/types/QuestionWithVote';
import { Draggable } from 'react-beautiful-dnd';
import { pollVotingSelectors } from '~/poll-voting/state/pollVotingSelectors';
import { OptionContainer } from '~/polling/components';

export const Option: React.FC<{
    question: QuestionWithVote;
    label: React.ReactNode;
    sublabel: React.ReactNode;
    isSelected: boolean;
    order?: (isHovering: boolean) => React.ReactNode;
    onClick?: () => void;
}> = ({
    label,
    sublabel,
    order,
    isSelected,
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
                {label}
                {sublabel}
            </Content>
        </Container>
    );
};

const Container = styled(OptionContainer)<{ isSelected: boolean }>`
    background-color: ${p => (p.isSelected ? p.theme.coreColor.cs2 : p.theme.backgroundColor)};
    &: hover {
        background-color: ${p => (p.isSelected ? p.theme.coreColor.cs2 : p.theme.coreColor.cs1)};
    }
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
`;

const Order = styled(Typography)<{ isHovering: boolean; isSelected: boolean }>`
    font-size: ${p => p.theme.fontSizes.fs4};
    opacity: ${p => (p.isHovering || p.isSelected ? '1' : '0')};
    transition: opacity ${p => p.theme.transitions.fast};
`;
