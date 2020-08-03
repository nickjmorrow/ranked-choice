import * as React from 'react';
import { Input } from '~/core/Input';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { Option } from '~/polling/components/Option';

export const CreateOption: React.FC<{ onCreate: (label: string) => void }> = ({ onCreate: handleCreate }) => {
    const [optionLabel, setOptionLabel] = React.useState('');
    const handleChange = (label: string) => {
        handleCreate(label);
        setOptionLabel('');
    };
    return (
        <Option
            label={
                <StyledInput
                    placeholder={'New Option'}
                    value={optionLabel}
                    onChange={e => handleChange(e.currentTarget.value)}
                />
            }
            sublabel={<div />}
        />
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
