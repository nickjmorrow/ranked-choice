// external
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

// inter
import { useTypedSelector } from '~/redux/useTypedSelector';
import { QuestionResult } from '~/polling/components/QuestionResult';
import { TitleDescription } from '~/polling/components/TitleDescription';
import { PollContainer } from '~/polling/components/PollContainer';
import { QuestionListContainer } from '~/polling/components/QuestionListContainer';
import { QuestionHeader } from '~/polling/components/QuestionHeader';
import { routingSelectors } from '~/routing/routingSelectors';

// intra
import { pollResultActions } from '~/poll-results/state/pollResultActions';
import { QuestionContainer } from '~/polling/components/QuestionContainer';

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

    return (
        <PollContainer style={{ maxWidth: '800px' }}>
            <TitleDescription title={title} description={description} />
            <QuestionListContainer>
                {questionResults.map((qr, i) => (
                    <QuestionContainer key={qr.question.questionId}>
                        <QuestionHeader
                            orderId={i + 1}
                            content={qr.question.content}
                            subheading={qr.question.subheading}
                        />
                        <QuestionResult options={qr.question.options} rounds={qr.rounds} key={qr.question.questionId} />
                    </QuestionContainer>
                ))}
            </QuestionListContainer>
        </PollContainer>
    );
};
