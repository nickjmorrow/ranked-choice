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
            <Typography variant={'h2'}>{poll.title}</Typography>
            <Description>{poll.description}</Description>
            <QuestionsContainer>
                {poll.questions.map(q => (
                    <Question question={q} key={q.questionId} />
                ))}
            </QuestionsContainer>
            <VoteOnPollButton />
        </Container>
    );
};

const Container = styled.div`
    max-width: ${p => p.theme.spacing.ss128};
`;

const QuestionsContainer = styled.div`
    padding: ${p => p.theme.spacing.ss6} 0;
`;

const Description = styled(Typography)`
    line-height: 1.4rem;
`;
