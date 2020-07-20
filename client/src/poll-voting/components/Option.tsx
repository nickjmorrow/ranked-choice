// external
import React from 'react';
import styled from 'styled-components';
import { Option as OptionType } from '~/polling/types/Option';
import { Typography } from '~/core/Typography';
import { useDispatch } from 'react-redux';
import { pollVotingActions } from '~/poll-voting/state/pollVotingActions';
import { QuestionWithVote, OrderedOption } from '~/poll-voting/types/QuestionWithVote';

export const Option: React.FC<{ option: OrderedOption; question: QuestionWithVote }> = ({ option, question }) => {
    const dispatch = useDispatch();
    const handleClick = () => {
        dispatch(pollVotingActions.selectOption({ option, question }));
    };

    return (
        <Container onClick={handleClick} isSelected={option.orderId !== null}>
            <Typography>{option.orderId}</Typography>
            <Typography>{option.label}</Typography>
            <Typography>{option.sublabel}</Typography>
        </Container>
    );
};

const Container = styled.div<{ isSelected: boolean }>`
    cursor: pointer;
    background-color: ${p => (p.isSelected ? p.theme.coreColor.cs4 : p.theme.backgroundColor)};
`;
