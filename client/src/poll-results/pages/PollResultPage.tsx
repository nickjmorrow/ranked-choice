// external
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router';
import { useTypedSelector } from '~/redux/useTypedSelector';
import { useDispatch } from 'react-redux';
import { pollVotingActions } from '~/poll-voting/state/pollVotingActions';
import { pollResultActions } from '~/poll-results/state/pollResultActions';
import { QuestionResult } from '~/poll-results/components/QuestionResult';

export const PollResultPage: React.FC = () => {
    const { link } = useParams();
    const pollResult = useTypedSelector(state => state.pollResultState.pollResult);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pollResultActions.getPollResult.request(link));
    }, []);

    if (pollResult === null) {
        return null;
    }
    return (
        <Container>
            {pollResult.poll.title}
            {pollResult.questionResults.map(qr => (
                <QuestionResult questionResult={qr} key={qr.question.questionId} />
            ))}
        </Container>
    );
};

const Container = styled.div``;
