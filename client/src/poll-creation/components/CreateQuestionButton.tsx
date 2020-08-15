// external
import React from 'react';
import styled from 'styled-components';
import { Button } from '~/core/Button';
import { useDispatch } from 'react-redux';
import { pollCreationActions } from '~/poll-creation/state/pollCreationActions';

export const CreateQuestionButton: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
    const dispatch = useDispatch();
    return (
        <Button style={style} onClick={() => dispatch(pollCreationActions.createQuestion())}>
            Add Question
        </Button>
    );
};
