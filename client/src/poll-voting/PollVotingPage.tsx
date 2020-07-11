// external
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router';
import { useTypedSelector } from '~/redux/useTypedSelector';
import { Typography } from '~/core/Typography';
import { useDispatch } from 'react-redux';
import { pollVotingActions } from '~/poll-voting/state/pollVotingActions';

export const PollVotingPage: React.FC = () => {
    const { link } = useParams();
    const poll = useTypedSelector(state => state.pollVotingState.poll);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pollVotingActions.getPoll.request(link));
    }, []);

    if (poll === null) {
        return null;
    }

    return (
        <Container>
            <Typography variant={'h2'}>Poll Voting</Typography>
            <Typography>{poll.title}</Typography>
            <Typography>{poll.description}</Typography>
        </Container>
    );
};

const Container = styled.div``;
