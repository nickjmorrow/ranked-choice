// external
import React from 'react';
import styled from 'styled-components';
import { Button } from '~/core/Button';
import { useDispatch } from 'react-redux';
import { pollCreationActions } from '~/poll-creation/state/pollCreationActions';

export const CreateQuestionButton: React.FC = () => {
    const dispatch = useDispatch();
    return (
        <Container>
            <Button onClick={() => dispatch(pollCreationActions.createQuestion())}>Add Question</Button>
        </Container>
    );
};

const Container = styled.div``;
