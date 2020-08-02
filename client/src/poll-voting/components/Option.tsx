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

export const Option: React.FC<{ option: OrderedOption; question: QuestionWithVote; index: number }> = ({
    option,
    question,
    index,
}) => {
    const dispatch = useDispatch();
    const handleClick = () => {
        dispatch(pollVotingActions.selectOption({ option, question }));
    };
    const [isHovering, setIsHovering] = useState(false);
    const nextOrderId = useSelector(pollVotingSelectors.getNextOrderId(question));
    const isSelected = option.orderId !== null;
    const getOrderIdValue = () => {
        if (isSelected) {
            return option.orderId;
        }
        if (isHovering) {
            return nextOrderId;
        }
        return ' ';
    };
    return (
        <Container
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={handleClick}
            isSelected={isSelected}
        >
            <Order isHovering={isHovering} isSelected={isSelected}>
                {getOrderIdValue()}
            </Order>
            <Content>
                <Typography>{option.label}</Typography>
                <Sublabel>{option.sublabel}</Sublabel>
            </Content>
        </Container>
    );
};

const Container = styled.div<{ isSelected: boolean }>`
    cursor: pointer;
    background-color: ${p => (p.isSelected ? p.theme.coreColor.cs2 : p.theme.backgroundColor)};
    padding: ${p => p.theme.spacing.ss4};
    box-shadow: ${p => p.theme.boxShadow.bs1};
    border-radius: ${p => p.theme.borderRadius.br1};
    margin: ${p => p.theme.spacing.ss4} 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    transition: background-color ${p => p.theme.transitions.fast};
    align-items: center;
    min-height: ${p => p.theme.spacing.ss12};
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

const Sublabel = styled(Typography)`
    font-size: ${p => p.theme.fontSizes.fs2};
    color: ${p => p.theme.neutralColor.cs6};
`;
