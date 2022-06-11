// external
import React from 'react';
import styled from 'styled-components';
import { Collapse } from 'react-collapse';
import { useSelector, useDispatch } from 'react-redux';
import Select from 'react-select';

// inter
import { Typography } from '~/core/atoms/Typography';
import { CloseIcon } from '~/core/atoms/CloseIcon';
import { Paper } from '~/polling/components/Paper';

// intra
import { Vote as VoteType } from '~/simulation/types/Vote';
import { simulationSelectors } from '~/simulation/state/simulationSelectors';
import { simulationActions } from '~/simulation/state/simulationActions';
import { RankedOption } from '~/simulation/types/RankedOption';

interface SelectOption {
    value: number;
    label: string;
}

export const Vote: React.FC<{ vote: VoteType }> = ({ vote }) => {
    const [isOpen, setIsOpen] = React.useState(true);
    const options = useSelector(simulationSelectors.getOptions);
    const validOptions = options.filter(o => !vote.rankedOptions.map(c => c.optionId).includes(o.optionId));
    const selectOptions: SelectOption[] = validOptions.map(o => ({ value: o.optionId, label: o.label }));
    const dispatch = useDispatch();
    const handleChange = (selectOption: SelectOption): void => {
        dispatch(simulationActions.addChoice({ vote, optionId: selectOption.value }));
    };

    const handleRemove = (choice: RankedOption): void => {
        dispatch(simulationActions.removeChoice({ choice, vote }));
    };

    return (
        <Container>
            <Typography onClick={() => setIsOpen(s => !s)}>{`VoterId ${vote.voterId}`}</Typography>
            <Collapse isOpened={isOpen}>
                <ChoicesContainer>
                    {vote.rankedOptions
                        .slice()
                        .sort((a, b) => (a.orderId < b.orderId ? -1 : 1))
                        .map(c => (
                            <Choice key={c.optionId}>
                                <div>
                                    <Typography style={{ marginRight: '16px' }}>{c.orderId}</Typography>
                                    <Typography>{options.find(o => o.optionId === c.optionId)!.label}</Typography>
                                </div>
                                <CloseIcon onClick={() => handleRemove(c)} />
                            </Choice>
                        ))}
                    {vote.rankedOptions.length < options.length && (
                        <Typography>
                            <Select options={selectOptions} value={null} onChange={handleChange as any} />
                        </Typography>
                    )}
                </ChoicesContainer>
            </Collapse>
        </Container>
    );
};

const ChoicesContainer = styled.div`
    display: grid;
    grid-auto-flow: row;
    grid-row-gap: ${p => p.theme.spacing.ss4};
    margin-top: ${p => p.theme.spacing.ss6};
`;

const Choice = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Container = styled(Paper)`
    width: 100%;
`;
