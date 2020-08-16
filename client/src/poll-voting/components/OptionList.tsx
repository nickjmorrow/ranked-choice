// external
import React from 'react';
import styled from 'styled-components';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { useSelector, useDispatch } from 'react-redux';

// inter
import { Typography } from '~/core/Typography';
import { Option } from '~/polling/components/Option';

// intra
import { OrderedOption, FilledOrderedOption, QuestionWithVote } from '~/poll-voting/types/QuestionWithVote';
import { pollVotingSelectors } from '~/poll-voting/state/pollVotingSelectors';
import { pollVotingActions } from '~/poll-voting/state/pollVotingActions';
import { OptionListContainer } from '~/polling/components/OptionListContainer';

export const OptionList: React.FC<{ options: OrderedOption[]; question: QuestionWithVote }> = ({
    options,
    question,
}) => {
    const orderedOptions = options.filter((o): o is FilledOrderedOption => o.orderId !== null);
    const unorderedOptions = options.filter(o => o.orderId === null);
    const nextOrderId = useSelector(pollVotingSelectors.getNextOrderId(question));
    const dispatch = useDispatch();

    const getOrderIdValue = (isHovering: boolean, isSelected: boolean, option: OrderedOption) => {
        if (isSelected) {
            return option.orderId;
        }
        if (isHovering) {
            return nextOrderId;
        }
        return ' ';
    };
    return (
        <Droppable droppableId={question.questionId.toString()}>
            {provided => (
                <OptionListContainer ref={provided.innerRef} {...provided.droppableProps}>
                    {orderedOptions
                        .slice()
                        .sort((a, b) => (a.orderId < b.orderId ? -1 : 1))
                        .slice()
                        .map((o, i) => (
                            <Draggable key={o.optionId} draggableId={o.optionId.toString()} index={i}>
                                {provided => (
                                    <div
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        ref={provided.innerRef}
                                    >
                                        <Option
                                            label={o.label}
                                            sublabel={o.sublabel}
                                            key={o.optionId}
                                            isSelected={true}
                                            onClick={() => {
                                                dispatch(pollVotingActions.selectOption({ option: o, question }));
                                            }}
                                            showOrderIdFunc={(isHovering: boolean) => (
                                                <Order isHovering={isHovering} isSelected={true}>
                                                    {getOrderIdValue(isHovering, true, o)}
                                                </Order>
                                            )}
                                        />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                    {provided.placeholder}
                    {unorderedOptions.map((o, i) => (
                        <Option
                            key={o.optionId}
                            label={o.label}
                            sublabel={o.sublabel}
                            isSelected={false}
                            onClick={() => {
                                dispatch(pollVotingActions.selectOption({ option: o, question }));
                            }}
                            showOrderIdFunc={(isHovering: boolean) => (
                                <Order isHovering={isHovering} isSelected={false}>
                                    {getOrderIdValue(isHovering, false, o)}
                                </Order>
                            )}
                        />
                    ))}
                </OptionListContainer>
            )}
        </Droppable>
    );
};

const Order = styled(Typography)<{ isHovering: boolean; isSelected: boolean }>`
    font-size: ${p => p.theme.fontSizes.fs4};
    opacity: ${p => (p.isHovering || p.isSelected ? '1' : '0')};
    transition: opacity ${p => p.theme.transitions.fast};
`;
