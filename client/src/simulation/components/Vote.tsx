import * as React from 'react';
import styled from 'styled-components';
import { Vote as VoteType } from '~/simulation/types/Vote';
import { Typography } from '~/core/Typography';
import { OptionBar } from '~/simulation/components/OptionBar';
import { Collapse } from 'react-collapse';
import { useSelector } from 'react-redux';
import { simulationSelectors } from '~/simulation/state/simulationSelectors';

export const Vote: React.FC<{ vote: VoteType }> = ({ vote }) => {
    const [isOpen, setIsOpen] = React.useState(true);
    const options = useSelector(simulationSelectors.getOptions);
    return (
        <OptionBar onClick={() => setIsOpen(s => !s)}>
            <Typography>{vote.label ?? `VoterId ${vote.voterId}`}</Typography>
            <Collapse isOpened={isOpen}>
                <ChoicesContainer>
                    {vote.choices.map(c => (
                        <Choice>
                            <Typography style={{ marginRight: '16px' }}>{c.orderId}</Typography>
                            <Typography>{options.find(o => o.optionId === c.optionId)!.label}</Typography>
                        </Choice>
                    ))}
                </ChoicesContainer>
            </Collapse>
        </OptionBar>
    );
};

const ChoicesContainer = styled.div`
    display: grid;
    grid-auto-flow: row;
    grid-row-gap: ${p => p.theme.spacing.ss4};
    margin-top: ${p => p.theme.spacing.ss6};
`;

const Choice = styled.div``;
