// external
import React, { useState } from 'react';
import styled from 'styled-components';
import { Typography } from '~/core/Typography';
import { Input } from '~/core/Input';
import { Question as QuestionType } from '~/polling/types/Question';
import { Option } from '~/polling/components/Option';
import { useSelector, useDispatch } from 'react-redux';
import { pollCreationSelectors } from '~/poll-creation/state/pollCreationSelectors';
import { pollCreationActions } from '~/poll-creation/state/pollCreationActions';
import { Option as OptionType } from '~/polling/types/Option';
import { Question } from '~/poll-creation/components/Question';
import { Card } from '~/poll-creation/components/Card';

export const CreatePollPage: React.FC = () => {
    const pollCreationState = useSelector(pollCreationSelectors.getPollCreationState);
    const { title, description } = pollCreationState;
    const dispatch = useDispatch();

    return (
        <Container>
            <Typography variant={'h2'}>Create Poll</Typography>
            <Card>
                <Input
                    value={title}
                    placeholder={'Untitled Poll'}
                    style={{ fontSize: '18px', marginBottom: '8px' }}
                    onChange={e => dispatch(pollCreationActions.updateTitle(e.currentTarget.value))}
                />
                <Input
                    value={description}
                    placeholder={'Poll Description'}
                    onChange={e => dispatch(pollCreationActions.updateDescription(e.currentTarget.value))}
                />
            </Card>
            {pollCreationState.questions.map(q => (
                <Question question={q} key={q.questionId} />
            ))}
        </Container>
    );
};

const Container = styled.div``;
