// external
import React from 'react';
import { Button } from '~/core/Button';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '~/redux/useTypedSelector';
import { pollVotingActions } from '~/poll-voting/state/pollVotingActions';
import { Typography } from '~/core/Typography';

export const VoteOnPollButton: React.FC = () => {
    const dispatch = useDispatch();
    const optionIds = useTypedSelector(state =>
        state.pollVotingState.poll?.questions.map(q => q.selectedOptionId).filter(o => o !== null),
    ) as number[];
    console.log(optionIds);
    const isEnabled = optionIds !== undefined && optionIds.length > 0;

    const handleClick = () => {
        if (isEnabled) {
            dispatch(pollVotingActions.voteOnPoll.request({ optionIds }));
        }
    };
    return (
        <Button isEnabled={isEnabled} onClick={handleClick}>
            <Typography>Vote</Typography>
        </Button>
    );
};
