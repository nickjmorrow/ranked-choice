// external
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useTypedSelector } from '~/redux/useTypedSelector';
import { useDispatch } from 'react-redux';
import { pollVotingActions } from '~/poll-voting/state/pollVotingActions';
import { pollResultActions } from '~/poll-results/state/pollResultActions';
import { QuestionResult } from '~/poll-results/components/QuestionResult';
import { TitleDescription } from '~/polling/components/TitleDescription';
import { PollContainer, QuestionListContainer } from '~/polling/components';
import { Typography } from '~/core/Typography';
import { theme } from '~/theming/theme';
import { routingSelectors } from '~/routing/routingSelectors';

export const PollResultPage: React.FC = () => {
    const link = useTypedSelector(routingSelectors.getParam('/results/:link', 'link'));
    const pollResult = useTypedSelector(state => state.pollResultState.pollResult);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pollResultActions.getPollResult.request(link));
    }, []);

    if (pollResult === null) {
        return null;
    }
    const {
        poll: { title, description },
        questionResults,
    } = pollResult;
    const areAnyVotesCast = questionResults
        .map(qr => qr.rounds.map(r => r.optionResults.map(or => or.voteCount)))
        .flat(3)
        .some(c => c !== 0);

    let content = areAnyVotesCast ? (
        <QuestionListContainer>
            {questionResults.map(qr => (
                <QuestionResult questionResult={qr} key={qr.question.questionId} />
            ))}
        </QuestionListContainer>
    ) : (
        <Typography style={{ marginTop: theme.spacing.ss16, display: 'block' }}>
            No votes have yet been cast for this poll.
        </Typography>
    );

    return (
        <PollContainer>
            <TitleDescription title={title} description={description} />
            {content}
        </PollContainer>
    );
};
