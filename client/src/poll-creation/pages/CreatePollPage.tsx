// external
import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

// inter
import { TextArea } from '~/core/TextArea';
import { PollContainer } from '~/polling/components/PollContainer';
import { QuestionListContainer } from '~/polling/components/QuestionListContainer';
import { TitleDescription } from '~/polling/components/TitleDescription';
import { theme } from '~/theming/theme';

// intra
import { CreatePollButton } from '~/poll-creation/components/CreatePollButton';
import { CreateQuestionButton } from '~/poll-creation/components/CreateQuestionButton';
import { Question } from '~/poll-creation/components/Question';
import { pollCreationActions } from '~/poll-creation/state/pollCreationActions';
import { pollCreationSelectors } from '~/poll-creation/state/pollCreationSelectors';

export const CreatePollPage: React.FC = () => {
    const pollCreationState = useSelector(pollCreationSelectors.getPollCreationState);
    const { title, description } = pollCreationState;
    const dispatch = useDispatch();
    const maxWidth = 500;
    const titleNode = (
        <TextArea
            value={title}
            placeholder={'Untitled Poll'}
            style={{ maxWidth: `${maxWidth}px`, width: '100%', marginLeft: '-5px' }}
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
            <InnerContainer>
                <TitleDescription title={titleNode} description={descriptionNode} />
                <QuestionListContainer>
                    {pollCreationState.questions.map(q => (
                        <Question question={q} key={q.orderId} />
                    ))}
                </QuestionListContainer>
                <ButtonsContainer>
                    <CreateQuestionButton style={{ marginBottom: theme.spacing.ss8 }} />
                    <CreatePollButton />
                </ButtonsContainer>
            </InnerContainer>
        </PollContainer>
    );
};

const ButtonsContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const InnerContainer = styled.div``;
