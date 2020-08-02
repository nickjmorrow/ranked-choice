// external
import React from 'react';
import styled from 'styled-components';
import { OrderedOption, FilledOrderedOption, QuestionWithVote } from '~/poll-voting/types/QuestionWithVote';
import { Option } from '~/poll-voting/components/Option';
import { Droppable, Draggable } from 'react-beautiful-dnd';

export const OptionList: React.FC<{ options: OrderedOption[]; question: QuestionWithVote }> = ({
    options,
    question,
}) => {
    const orderedOptions = options.filter((o): o is FilledOrderedOption => o.orderId !== null);
    const unorderedOptions = options.filter(o => o.orderId === null);
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
                                        <Option key={o.optionId} option={o} question={question} index={i} />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                    {provided.placeholder}
                    {unorderedOptions.map((o, i) => (
                        <Option
                            key={o.optionId}
                            option={o}
                            question={question}
                            index={Math.max(orderedOptions.length - 1, 0) + i}
                        />
                    ))}
                </Container>
            )}
        </Droppable>
    );
};

const Container = styled.div``;
