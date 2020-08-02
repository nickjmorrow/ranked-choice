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
            <Order>{option.orderId}</Order>
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
    transition: background-color ${p => p.theme.transitions.slow};
    align-items: center;
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
`;

const Order = styled(Typography)`
    font-size: ${p => p.theme.fontSizes.fs4};
`;

const Sublabel = styled(Typography)`
    font-size: ${p => p.theme.fontSizes.fs2};
    color: ${p => p.theme.neutralColor.cs5};
`;
