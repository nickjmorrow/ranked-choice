// external
import React from 'react';
import styled from 'styled-components';
import { OrderedOption, FilledOrderedOption, QuestionWithVote } from '~/poll-voting/types/QuestionWithVote';
import { Option } from '~/poll-voting/components/Option';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Typography } from '~/core/Typography';
import { pollVotingSelectors } from '~/poll-voting/state/pollVotingSelectors';
import { useSelector, useDispatch } from 'react-redux';
import { pollVotingActions } from '~/poll-voting/state/pollVotingActions';

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
                <Container ref={provided.innerRef} {...provided.droppableProps}>
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
                                            label={<Typography>{o.label}</Typography>}
                                            sublabel={<Sublabel>{o.sublabel}</Sublabel>}
                                            key={o.optionId}
                                            question={question}
                                            isSelected={true}
                                            onClick={() => {
                                                dispatch(pollVotingActions.selectOption({ option: o, question }));
                                            }}
                                            order={(isHovering: boolean) => (
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
                            label={<Typography>{o.label}</Typography>}
                            sublabel={<Sublabel>{o.sublabel}</Sublabel>}
                            question={question}
                            isSelected={false}
                            onClick={() => {
                                dispatch(pollVotingActions.selectOption({ option: o, question }));
                            }}
                            order={(isHovering: boolean) => (
                                <Order isHovering={isHovering} isSelected={false}>
                                    {getOrderIdValue(isHovering, false, o)}
                                </Order>
                            )}
                        />
                    ))}
                </Container>
            )}
        </Droppable>
    );
};

const Container = styled.div``;

const Sublabel = styled(Typography)`
    font-size: ${p => p.theme.fontSizes.fs2};
    color: ${p => p.theme.neutralColor.cs6};
`;

const Order = styled(Typography)<{ isHovering: boolean; isSelected: boolean }>`
    font-size: ${p => p.theme.fontSizes.fs4};
    opacity: ${p => (p.isHovering || p.isSelected ? '1' : '0')};
    transition: opacity ${p => p.theme.transitions.fast};
`;
