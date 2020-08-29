// external
import React from 'react';
import styled from 'styled-components';
import { Button } from '~/core/atoms/Button';
import { useDispatch } from 'react-redux';
import { pollCreationActions } from '~/poll-creation/state/pollCreationActions';
import { WideButton } from '~/core/atoms/WideButton';

export const CreateQuestionButton: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
    const dispatch = useDispatch();
    return (
        <WideButton style={style} onClick={() => dispatch(pollCreationActions.createQuestion())}>
            Add Question
        </WideButton>
    );
};
