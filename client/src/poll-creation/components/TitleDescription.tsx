// external
import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { pollCreationSelectors } from '~/poll-creation/state/pollCreationSelectors';
import { Card } from '~/core/Card';
import { Input } from '~/core/Input';
import { pollCreationActions } from '~/poll-creation/state/pollCreationActions';

export const TitleDescription: React.FC = () => {
    const pollCreationState = useSelector(pollCreationSelectors.getPollCreationState);
    const { title, description } = pollCreationState;
    const dispatch = useDispatch();
    return (
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
    );
};
