import * as React from 'react';
import styled from 'styled-components';
import { Option as OptionType } from '~/polling/types/Option';
import { Typography } from '~/core/Typography';
import { RemoveIconButton } from '~/core/RemoveIconButton';
import { Input } from '~/core/Input';
import { OptionContainer } from '~/polling/components/OptionContainer';

export const Option: React.FC<{
    option: OptionType;
    isEditable?: boolean;
    onChange?: (label: string) => void;
    onRemove: (option: OptionType) => void;
}> = ({ option, onRemove: handleRemove, onChange: handleChange, isEditable }) => {
    return (
        <OptionContainer>
            <InnerContainer>
                {isEditable ? (
                    <Input value={option.label} onChange={e => handleChange!(e.currentTarget.value)} />
                ) : (
                    <Typography>{option.label}</Typography>
                )}
                <RemoveIconButton onClick={() => handleRemove(option)} />
            </InnerContainer>
        </OptionContainer>
    );
};

const InnerContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;
