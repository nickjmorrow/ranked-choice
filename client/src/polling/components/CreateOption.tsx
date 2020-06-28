import * as React from 'react';
import { OptionBar } from '~/simulation/components/OptionBar';
import { Input } from '~/core/Input';
import styled from 'styled-components';
import { CreateIconButton } from '~/core/CreateIconButton';

export const CreateOption: React.FC<{ onCreate: (label: string) => void }> = ({ onCreate: handleCreate }) => {
    const [optionLabel, setOptionLabel] = React.useState('');
    const handleCreateInternal = (): void => {
        if (optionLabel.length === 0) {
            return;
        }
        handleCreate(optionLabel);
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
                <CreateIconButton onClick={handleCreateInternal} />
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
