import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from '~/core/atoms/Typography';
import { QuestionResult } from '~/polling/components/QuestionResult';
import { simulationActions } from '~/simulation/state/simulationActions';
import { simulationSelectors } from '~/simulation/state/simulationSelectors';

export const ResultsPage: React.FC = () => {
    const options = useSelector(simulationSelectors.getOptions);
    const votes = useSelector(simulationSelectors.getVotes);
    const pollResult = useSelector(simulationSelectors.getPollResult);
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(
            simulationActions.calculatePollResult.request({
                poll: {
                    questions: [
                        {
                            optionIds: options.map(o => o.optionId),
                            votes,
                        },
                    ],
                },
            }),
        );
    }, []);

    if (pollResult === null) {
        return null;
    }

    const { questionResults } = pollResult;
    const { rounds } = questionResults[0];

    return (
        <>
            <Typography variant={'h3'}>Results</Typography>
            <QuestionResult rounds={rounds} options={options} />
        </>
    );
};
