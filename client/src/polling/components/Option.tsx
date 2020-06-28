import * as React from 'react';
import styled from 'styled-components';
import { Option as OptionType } from '~/simulation/types/Option';
import { Typography } from '~/core/Typography';
import { OptionBar } from '~/simulation/components/OptionBar';
import { RemoveIconButton } from '~/core/RemoveIconButton';

export const Option: React.FC<{
    style?: React.CSSProperties;
    option: OptionType;
    onRemove: (option: OptionType) => void;
}> = ({ option, style, onRemove: handleRemove }) => {
    return (
        <OptionBar style={style}>
            <InnerContainer>
                <Typography>{option.label}</Typography>
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
