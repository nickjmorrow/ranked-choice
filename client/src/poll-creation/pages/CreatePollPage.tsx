// external
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextArea } from '~/core/TextArea';
import { CreatePollButton } from '~/poll-creation/components/CreatePollButton';
import { CreateQuestionButton } from '~/poll-creation/components/CreateQuestionButton';
import { Question } from '~/poll-creation/components/Question';
import { pollCreationActions } from '~/poll-creation/state/pollCreationActions';
import { pollCreationSelectors } from '~/poll-creation/state/pollCreationSelectors';
import { PollContainer, QuestionListContainer } from '~/polling/components';
import { TitleDescription } from '~/polling/components/TitleDescription';

export const CreatePollPage: React.FC = () => {
    const pollCreationState = useSelector(pollCreationSelectors.getPollCreationState);
    const { title, description } = pollCreationState;
    const dispatch = useDispatch();
    const maxWidth = 400;
    const titleNode = (
        <TextArea
            value={title}
            placeholder={'Untitled Poll'}
            style={{ maxWidth: `${maxWidth}px`, marginLeft: '-5px' }}
            onChange={e => dispatch(pollCreationActions.updateTitle(e.currentTarget.value))}
        />
    );

    const descriptionNode = (
        <TextArea
            value={description}
            placeholder={'Poll Description'}
            onChange={e => dispatch(pollCreationActions.updateDescription(e.currentTarget.value))}
            style={{ maxWidth: `${maxWidth}px`, marginLeft: '-5px' }}
        />
    );
    return (
        <PollContainer>
            <TitleDescription title={titleNode} description={descriptionNode} />
            <QuestionListContainer>
                {pollCreationState.questions.map(q => (
                    <Question question={q} key={q.orderId} />
                ))}
            </QuestionListContainer>
            <CreateQuestionButton />
            <CreatePollButton />
        </PollContainer>
    );
};
