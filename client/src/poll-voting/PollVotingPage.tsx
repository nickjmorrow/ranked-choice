// external
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router';
import { useTypedSelector } from '~/redux/useTypedSelector';
import { Typography } from '~/core/Typography';
import { useDispatch } from 'react-redux';
import { pollVotingActions } from '~/poll-voting/state/pollVotingActions';
import { Question } from '~/poll-voting/components/Question';
import { VoteOnPollButton } from '~/poll-voting/components/VoteOnPollButton';
import { QuestionListContainer, PollContainer } from '~/polling/components';

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
        <PollContainer>
            <Typography variant={'h2'}>{poll.title}</Typography>
            <Description>{poll.description}</Description>
            <QuestionListContainer>
                {poll.questions.map(q => (
                    <Question question={q} key={q.questionId} />
                ))}
            </QuestionListContainer>
            <VoteOnPollButton />
        </PollContainer>
    );
};

const Description = styled(Typography)`
    line-height: 1.4rem;
`;
