import * as React from 'react';
import { OptionBar } from '~/simulation/components/OptionBar';
import { Input } from '~/core/Input';
import styled from 'styled-components';
import { CreateIconButton } from '~/core/CreateIconButton';
import { useDispatch } from 'react-redux';
import { simulationActions } from '~/simulation/state/simulationActions';

export const CreateOption: React.FC = () => {
    const [optionLabel, setOptionLabel] = React.useState('');
    const dispatch = useDispatch();
    const handleCreate = (): void => {
        if (optionLabel.length === 0) {
            return;
        }
        dispatch(simulationActions.addOption(optionLabel));
        setOptionLabel('');
    };
    return (
        <OptionBar>
            <InnerContainer>
                <StyledInput
                    placeholder={'New Option'}
                    value={optionLabel}
                    onChange={e => setOptionLabel(e.currentTarget.value)}
                />
                <CreateIconButton onClick={handleCreate} />
            </InnerContainer>
        </OptionBar>
    );
};

const StyledInput = styled(Input)`
    padding: ${p => p.theme.spacing.ss2} ${p => p.theme.spacing.ss2} ${p => p.theme.spacing.ss2} 0;
`;

const InnerContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;
