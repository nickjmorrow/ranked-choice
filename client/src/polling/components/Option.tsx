import * as React from 'react';
import styled from 'styled-components';
import { Option as OptionType } from '~/polling/types/Option';
import { Typography } from '~/core/Typography';
import { OptionBar } from '~/simulation/components/OptionBar';
import { RemoveIconButton } from '~/core/RemoveIconButton';
import { useDispatch } from 'react-redux';
import { Input } from '~/core/Input';

export const Option: React.FC<{
    style?: React.CSSProperties;
    option: OptionType;
    isEditable?: boolean;
    onChange?: (label: string) => void;
    onRemove: (option: OptionType) => void;
}> = ({ option, style, onRemove: handleRemove, onChange: handleChange, isEditable }) => {
    return (
        <OptionBar style={style}>
            <InnerContainer>
                {isEditable ? (
                    <Input value={option.label} onChange={e => handleChange!(e.currentTarget.value)} />
                ) : (
                    <Typography>{option.label}</Typography>
                )}
                <RemoveIconButton onClick={() => handleRemove(option)} />
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
