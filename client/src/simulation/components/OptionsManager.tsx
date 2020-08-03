import * as React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import { simulationSelectors } from '~/simulation/state/simulationSelectors';
import { Typography } from '~/core/Typography';

import { Option } from '~/poll-creation/components/Option';
import { OptionBarListContainer } from '~/simulation/components/OptionBarListContainer';
import { CreateOption } from '~/polling/components/CreateOption';
import { Option as OptionType } from '~/polling/types/Option';
import { simulationActions } from '~/simulation/state/simulationActions';

export const OptionsManager: React.FC = () => {
    const options = useSelector(simulationSelectors.getOptions);
    const dispatch = useDispatch();
    const handleRemove = (option: OptionType) => {
        dispatch(simulationActions.removeOption(option));
    };
    const handleCreate = (label: string) => {
        dispatch(simulationActions.addOption(label));
    };
    const noOp = () => {
        return;
    };
    return (
        <Container>
            <Typography variant={'h3'}>Options</Typography>
            <OptionBarListContainer>
                {options.map(o => (
                    <Option
                        option={o}
                        key={o.optionId}
                        onRemove={handleRemove}
                        onLabelChange={noOp}
                        onSublabelChange={noOp}
                    />
                ))}
                <CreateOption onCreate={handleCreate} />
            </OptionBarListContainer>
        </Container>
    );
};

const Container = styled.div``;
