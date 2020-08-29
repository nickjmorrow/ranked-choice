// external
import React from 'react';
import styled from 'styled-components';
import { VictoryChart, VictoryTheme, VictoryBar, VictoryAxis } from 'victory';

// inter
import { Option } from '~/polling/types/Option';
import { OptionResult } from '~/polling/types/OptionResult';
import { truncateLabel } from '~/core/services/truncateLabel';

export const ResultGraph: React.FC<{
    options: Option[];
    optionVoteResults: OptionResult[];
    style?: React.CSSProperties;
}> = ({ options, optionVoteResults, style }) => {
    const getLabel = (optionResult: OptionResult): string => {
        const rawLabel = options.find(o => o.optionId === optionResult.optionId)!.label;
        return truncateLabel(rawLabel, 15);
    };
    const graphOptionVoteResults = optionVoteResults
        .filter(ovr => ovr.voteCount > 0)
        .map((ovr, i) => ({ ...ovr, orderId: i + 1 }));
    return (
        <Container style={style}>
            <VictoryChart theme={VictoryTheme.material} domainPadding={30}>
                <VictoryAxis
                    tickValues={graphOptionVoteResults.map(govr => govr.orderId)}
                    tickFormat={graphOptionVoteResults.map(getLabel)}
                />
                <VictoryAxis tickFormat={x => x} dependentAxis={true} />
                <VictoryBar
                    data={graphOptionVoteResults}
                    x={'orderId'}
                    y={'voteCount'}
                    cornerRadius={{ topLeft: 6, topRight: 6 }}
                />
            </VictoryChart>
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
    max-width: 400px;
    position: relative;
    left: -28px;
    top: -28px;
`;
