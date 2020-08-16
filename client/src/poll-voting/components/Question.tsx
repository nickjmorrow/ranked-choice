// external
import React from 'react';
import styled from 'styled-components';
import { Typography } from '~/core/Typography';
import { QuestionWithVote, FilledOrderedOption } from '~/poll-voting/types/QuestionWithVote';
import { DragDropContext, DropResult, ResponderProvided } from 'react-beautiful-dnd';
import { OptionList } from '~/poll-voting/components/OptionList';
import { useDispatch } from 'react-redux';
import { pollVotingActions } from '~/poll-voting/state/pollVotingActions';
import { Question as GenericQuestion } from '~/polling/components/Question';

export const Question: React.FC<{ question: QuestionWithVote }> = ({ question }) => {
    const dispatch = useDispatch();
    const handleDragEnd = (result: DropResult, provided: ResponderProvided) => {
        const optionId = parseInt(result.draggableId, 10);
        const option = question.options.find(o => o.optionId === optionId)! as FilledOrderedOption;
        const destinationIndex = result.destination!.index;
        const newOrderId = destinationIndex + 1;

        dispatch(pollVotingActions.reorderOption({ option, newOrderId, question }));
    };

    const optionList = (
        <DragDropContext onDragEnd={handleDragEnd}>
            <OptionList options={question.options} question={question} />
        </DragDropContext>
    );

    return (
        <GenericQuestion
            question={question}
            optionList={optionList}
            content={question.content}
            subheading={question.subheading}
        />
    );
};

const Title = styled(Typography)`
    display: inline-block;
    color: ${p => p.theme.neutralColor.cs5};
    font-size: ${p => p.theme.fontSizes.fs1};
    margin-bottom: ${p => p.theme.spacing.ss4};
`;

const Content = styled(Typography)`
    margin-bottom: ${p => p.theme.spacing.ss2};
`;

const Subheading = styled(Typography)`
    display: block;
    color: ${p => p.theme.neutralColor.cs5};
    font-size: ${p => p.theme.fontSizes.fs2};
    margin-bottom: ${p => p.theme.spacing.ss4};
`;
