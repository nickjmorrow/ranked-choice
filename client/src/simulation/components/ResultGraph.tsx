import * as React from 'react';
import { VictoryChart, VictoryTheme, VictoryBar, VictoryAxis } from 'victory';
import { OptionVoteResult } from '~/simulation/types/OptionVoteResult';
import { useSelector } from 'react-redux';
import { simulationSelectors } from '~/simulation/state/simulationSelectors';
import styled from 'styled-components';

export const ResultGraph: React.FC<{ optionVoteResults: OptionVoteResult[]; style?: React.CSSProperties }> = ({
    optionVoteResults,
    style,
}) => {
    const options = useSelector(simulationSelectors.getOptions);
    return (
        <Container style={style}>
            <VictoryChart theme={VictoryTheme.material} domainPadding={30}>
                <VictoryAxis
                    tickValues={optionVoteResults.map((r, i) => i + 1)}
                    tickFormat={optionVoteResults.map(ovr => options.find(o => o.optionId === ovr.optionId)!.label)}
                />
                <VictoryAxis tickFormat={x => x} dependentAxis={true} />
                <VictoryBar data={optionVoteResults} x={'optionId'} y={'voteCount'} />
            </VictoryChart>
        </Container>
    );
};

const Container = styled.div`
    height: 500px;
    width: 500px;
`;
