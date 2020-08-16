// external
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

// inter
import { Button } from '~/core/Button';

// intra
import { pollVotingActions } from '~/poll-voting/state/pollVotingActions';
import { getPollVotingRequest } from '~/poll-voting/state/pollVotingSelectors';

export const VoteOnPollButton: React.FC = () => {
    const dispatch = useDispatch();
    const request = useSelector(getPollVotingRequest);

    const handleClick = () => {
        dispatch(pollVotingActions.voteOnPoll.request(request));
    };
    return <Button onClick={handleClick}>Vote</Button>;
};
