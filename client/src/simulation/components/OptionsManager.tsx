import * as React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { simulationSelectors } from '~/simulation/state/simulationSelectors';
import { Typography } from '~/core/Typography';

import { Option } from '~/simulation/components/Option';
import { OptionBarListContainer } from '~/simulation/components/OptionBarListContainer';
<<<<<<< HEAD
import { CreateOption } from '~/simulation/components/CreateOption';
=======
>>>>>>> master

export const OptionsManager: React.FC = () => {
    const options = useSelector(simulationSelectors.getOptions);
    return (
        <Container>
<<<<<<< HEAD
            <Typography variant={'h3'}>Options</Typography>
=======
            <Typography variant={'h2'}>Options</Typography>
>>>>>>> master
            <OptionBarListContainer>
                {options.map(o => (
                    <Option option={o} key={o.optionId} />
                ))}
<<<<<<< HEAD
                <CreateOption />
=======
>>>>>>> master
            </OptionBarListContainer>
        </Container>
    );
};

const Container = styled.div``;
