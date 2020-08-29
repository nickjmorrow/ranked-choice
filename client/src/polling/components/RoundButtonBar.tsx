// external
import React from 'react';
import styled from 'styled-components';

// inter
import { Typography } from '~/core/atoms/Typography';

// intra
import { Round } from '~/polling/types/Round';
import { Option } from '~/polling/types/Option';

export const RoundButtonBar: React.FC<{
    onClick: () => void;
    round: Round;
    isExpanded: boolean;
    options: Option[];
}> = ({ onClick: handleClick, round: { roundId, optionResults }, isExpanded, options }) => {
    return (
        <Container key={roundId} onClick={handleClick}>
            <Typography variant={'h3'} style={{ margin: '0' }}>{`Round ${roundId}`}</Typography>
            {isExpanded && (
                <OptionListContainer>
                    {optionResults.map(o => (
                        <OptionContainer key={o.optionId}>
                            <Typography>
                                {options.find(op => op.optionId === o.optionId)!.label}:{' '}
                                {optionResults.some(ovr => ovr.optionId === o.optionId)
                                    ? optionResults.find(ovr => ovr.optionId === o.optionId)!.voteCount
                                    : '0'}
                            </Typography>
                        </OptionContainer>
                    ))}
                </OptionListContainer>
            )}
        </Container>
    );
};

const OptionBar = styled.div`
    box-shadow: ${p => p.theme.boxShadow.bs1};
    max-width: ${p => p.theme.spacing.ss64};
    padding: ${p => p.theme.spacing.ss4};
    border-radius: ${p => p.theme.borderRadius.br1};
    height: max-content;
`;

const Container = styled(OptionBar)`
    margin-bottom: ${p => p.theme.spacing.ss8};
    cursor: pointer;
`;

const OptionListContainer = styled.div`
    margin-top: ${p => p.theme.spacing.ss6};
`;

const OptionContainer = styled.div`
    margin: ${p => p.theme.spacing.ss4} 0;
`;
