import * as React from 'react';
import styled from 'styled-components';
import { Vote as VoteType } from '~/simulation/types/Vote';
import { Typography } from '~/core/Typography';
import { OptionBar } from '~/simulation/components/OptionBar';
import { Collapse } from 'react-collapse';
<<<<<<< HEAD
import { useSelector, useDispatch } from 'react-redux';
import { simulationSelectors } from '~/simulation/state/simulationSelectors';
import { simulationActions } from '~/simulation/state/simulationActions';
import { RemoveIconButton } from '~/core/RemoveIconButton';
import { Choice } from '~/simulation/types/Choice';
=======
import { useSelector } from 'react-redux';
import { simulationSelectors } from '~/simulation/state/simulationSelectors';
>>>>>>> master

export const Vote: React.FC<{ vote: VoteType }> = ({ vote }) => {
    const [isOpen, setIsOpen] = React.useState(true);
    const options = useSelector(simulationSelectors.getOptions);
<<<<<<< HEAD
    const dispatch = useDispatch();
    const handleRemove = () => {
        dispatch(simulationActions.removeVote(vote));
    };
    const handleRemoveChoice = (choice: Choice) => {
        dispatch(simulationActions.removeChoice({ vote, choice }));
    };
    return (
        <OptionBar onClick={() => setIsOpen(s => !s)}>
            <InnerContainer>
                <Typography>{vote.label ?? `VoterId ${vote.voterId}`}</Typography>
                <RemoveIconButton onClick={handleRemove} />
            </InnerContainer>
=======
    return (
        <OptionBar onClick={() => setIsOpen(s => !s)}>
            <Typography>{vote.label ?? `VoterId ${vote.voterId}`}</Typography>
>>>>>>> master
            <Collapse isOpened={isOpen}>
                <ChoicesContainer>
                    {vote.choices.map(c => (
                        <Choice key={c.optionId}>
<<<<<<< HEAD
                            <div>
                                <Typography style={{ marginRight: '16px' }}>{c.orderId}</Typography>
                                <Typography>{options.find(o => o.optionId === c.optionId)!.label}</Typography>
                            </div>
                            <RemoveChoiceButton onClick={() => handleRemoveChoice(c)} />
=======
                            <Typography style={{ marginRight: '16px' }}>{c.orderId}</Typography>
                            <Typography>{options.find(o => o.optionId === c.optionId)!.label}</Typography>
>>>>>>> master
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

<<<<<<< HEAD
const Choice = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: ${p => p.theme.spacing.ss48};
`;

const InnerContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    min-width: ${p => p.theme.spacing.ss48};
`;

const RemoveChoiceButton = styled(RemoveIconButton)`
    height: 8px;
    width: 8px;
`;
=======
const Choice = styled.div``;
>>>>>>> master
