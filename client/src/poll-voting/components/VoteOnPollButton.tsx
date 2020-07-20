// external
import React from 'react';
import { Button } from '~/core/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useTypedSelector } from '~/redux/useTypedSelector';
import { pollVotingActions } from '~/poll-voting/state/pollVotingActions';
import { Typography } from '~/core/Typography';
import { QuestionWithVote, FilledOrderedOption } from '~/poll-voting/types/QuestionWithVote';
import { getPollVotingRequest } from '~/poll-voting/state/pollVotingSelectors';
import { PollVoteRequest } from '~/poll-voting/types/PollVoteRequest';

export const VoteOnPollButton: React.FC = () => {
    const dispatch = useDispatch();
    const request = useSelector(getPollVotingRequest);

    const handleClick = () => {
        dispatch(pollVotingActions.voteOnPoll.request(request));
    };
    return (
        <Button onClick={handleClick}>
            <Typography>Vote</Typography>
        </Button>
    );
};
