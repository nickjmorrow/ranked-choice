// external
import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '~/core/Button';
import { pollCreationActions } from '~/poll-creation/state/pollCreationActions';
import { CreatePollRequest } from '~/poll-creation/types/CreatePollRequest';
import { useTypedSelector } from '~/redux/useTypedSelector';

export const CreatePollButton: React.FC = () => {
    const dispatch = useDispatch();
    const poll = useTypedSelector(state => state.pollCreationState);
    const createPollRequest: CreatePollRequest = {
        poll: {
            title: poll.title,
            description: poll.description,
            questions: poll.questions,
        },
    };
    const isEnabled =
        createPollRequest.poll.questions.length > 0 &&
        createPollRequest.poll.title.length > 0 &&
        !createPollRequest.poll.questions.some(q => q.options.length < 2) &&
        !createPollRequest.poll.questions.flatMap(q => q.options).some(o => o.label.length === 0);

    const handleClick = () => {
        if (isEnabled) {
            dispatch(pollCreationActions.createPoll.request(createPollRequest));
        }
    };
    return (
        <Button isEnabled={isEnabled} onClick={handleClick}>
            Submit
        </Button>
    );
};
