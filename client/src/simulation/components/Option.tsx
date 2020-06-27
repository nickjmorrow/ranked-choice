import * as React from 'react';
<<<<<<< HEAD
import styled from 'styled-components';
import { Option as OptionType } from '~/simulation/types/Option';
import { Typography } from '~/core/Typography';
import { OptionBar } from '~/simulation/components/OptionBar';
import { RemoveIconButton } from '~/core/RemoveIconButton';
import { useDispatch } from 'react-redux';
import { simulationActions } from '~/simulation/state/simulationActions';

export const Option: React.FC<{ option: OptionType }> = ({ option }) => {
    const dispatch = useDispatch();
    const handleRemove = () => {
        dispatch(simulationActions.removeOption(option));
    };
    return (
        <OptionBar>
            <InnerContainer>
                <Typography>{option.label}</Typography>
                <RemoveIconButton onClick={handleRemove} />
            </InnerContainer>
        </OptionBar>
    );
};

const InnerContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;
=======
import { Option as OptionType } from '~/simulation/types/Option';
import { Typography } from '~/core/Typography';
import { OptionBar } from '~/simulation/components/OptionBar';

export const Option: React.FC<{ option: OptionType }> = ({ option }) => {
    return (
        <OptionBar>
            <Typography>{option.label}</Typography>
        </OptionBar>
    );
};
>>>>>>> master
