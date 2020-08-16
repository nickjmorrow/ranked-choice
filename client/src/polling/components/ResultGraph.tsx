// external
import React from 'react';
import styled from 'styled-components';
import { VictoryChart, VictoryTheme, VictoryBar, VictoryAxis } from 'victory';

// inter
import { Option } from '~/polling/types/Option';
import { OptionResult } from '~/polling/types/OptionResult';

export const ResultGraph: React.FC<{
    options: Option[];
    optionVoteResults: OptionResult[];
    style?: React.CSSProperties;
}> = ({ options, optionVoteResults, style }) => {
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
    width: 100%;
    max-width: 400px;
    position: relative;
    left: -28px;
    top: -28px;
`;
