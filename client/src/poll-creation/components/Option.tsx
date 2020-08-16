import React, { createRef, useEffect } from 'react';
import styled from 'styled-components';
import { Option as OptionType } from '~/polling/types/Option';
import { Input } from '~/core/Input';
import { Option as GenericOption } from '~/polling/components/Option';

export const Option: React.FC<{
    option: OptionType;
    onLabelChange: (label: string) => void;
    onSublabelChange: (sublabel: string) => void;
    onRemove: () => void;
}> = ({ option, onRemove: handleRemove, onLabelChange: handleLabelChange, onSublabelChange: handleSublabelChange }) => {
    const ref = createRef<HTMLInputElement>();

    const label = (
        <CustomInput ref={ref} value={option.label} onChange={e => handleLabelChange(e.currentTarget.value)} />
    );

    const sublabel = (
        <SublabelInput value={option.sublabel || ''} onChange={e => handleSublabelChange(e.currentTarget.value)} />
    );

    useEffect(() => {
        if (ref.current) {
            ref.current.focus();
        }
    }, []);

    return <GenericOption onRemove={handleRemove} label={label} sublabel={sublabel} />;
};

const CustomInput = styled(Input)`
    text-align: right;
    height: min-content;
`;

const SublabelInput = styled(CustomInput)`
    color: ${p => p.theme.neutralColor.cs6};
`;
