import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import { simulationSelectors } from '~/simulation/state/simulationSelectors';
import { Typography } from '~/core/atoms/Typography';

import { Option } from '~/poll-creation/components/Option';
import { CreateOption } from '~/polling/components/CreateOption';
import { Option as OptionType } from '~/polling/types/Option';
import { simulationActions } from '~/simulation/state/simulationActions';
import { OptionListContainer } from '~/polling/components/OptionListContainer';

export const CreateOptionsPage: React.FC = () => {
    const options = useSelector(simulationSelectors.getOptions);
    const dispatch = useDispatch();
    const handleRemove = (option: OptionType) => {
        dispatch(simulationActions.removeOption(option));
    };
    const handleCreate = (label: string) => {
        dispatch(simulationActions.addOption(label));
    };
    const handleLabelChange = (label: string, option: OptionType) => {
        dispatch(simulationActions.updateOption({ ...option, label }));
    };
    return (
        <Container>
            <Typography variant={'h3'}>Options</Typography>
            <OptionListContainer>
                {options.map(o => (
                    <Option
                        option={o}
                        key={o.optionId}
                        onRemove={() => handleRemove(o)}
                        onLabelChange={(label: string) => handleLabelChange(label, o)}
                    />
                ))}
                <CreateOption onChange={handleCreate} />
            </OptionListContainer>
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
`;
