import * as React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import { simulationSelectors } from '~/simulation/state/simulationSelectors';
import { Typography } from '~/core/Typography';

import { Option } from '~/polling/components/Option';
import { OptionBarListContainer } from '~/simulation/components/OptionBarListContainer';
import { CreateOption } from '~/simulation/components/CreateOption';
import { Option as OptionType } from '~/polling/types/Option';
import { simulationActions } from '~/simulation/state/simulationActions';

export const OptionsManager: React.FC = () => {
    const options = useSelector(simulationSelectors.getOptions);
    const dispatch = useDispatch();
    const handleRemove = (option: OptionType) => {
        dispatch(simulationActions.removeOption(option));
    };
    return (
        <Container>
            <Typography variant={'h3'}>Options</Typography>
            <OptionBarListContainer>
                {options.map(o => (
                    <Option option={o} key={o.optionId} onRemove={handleRemove} />
                ))}
                <CreateOption />
            </OptionBarListContainer>
        </Container>
    );
};

const Container = styled.div``;
