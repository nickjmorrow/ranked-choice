import * as React from 'react';
import styled from 'styled-components';
import { Option as OptionType } from '~/polling/types/Option';
import { Typography } from '~/core/Typography';
import { CloseIcon } from '~/core/CloseIcon';
import { Input } from '~/core/Input';
import { Option as GenericOption } from '~/polling/components';
import { Question } from '~/polling/types/Question';

export const Option: React.FC<{
    option: OptionType;
    onLabelChange: (label: string) => void;
    onSublabelChange: (sublabel: string) => void;
    onRemove: (option: OptionType) => void;
}> = ({ option, onRemove: handleRemove, onLabelChange: handleLabelChange, onSublabelChange: handleSublabelChange }) => {
    const label = <CustomInput value={option.label} onChange={e => handleLabelChange(e.currentTarget.value)} />;

    const sublabel = (
        <SublabelInput value={option.sublabel || ''} onChange={e => handleSublabelChange(e.currentTarget.value)} />
    );

    return (
        <GenericOption label={label} sublabel={sublabel} />
        // <OptionContainer>
        //     <InnerContainer>
        // {isEditable ? (
        //     <Input value={option.label} onChange={e => handleChange!(e.currentTarget.value)} />
        // ) : (
        //     <Typography>{option.label}</Typography>
        // )}
        //         <RemoveIconButton onClick={() => handleRemove(option)} />
        //     </InnerContainer>
        // </OptionContainer>
    );
};

const InnerContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const CustomInput = styled(Input)`
    text-align: right;
    height: min-content;
`;

const SublabelInput = styled(CustomInput)`
    color: ${p => p.theme.neutralColor.cs6};
`;
