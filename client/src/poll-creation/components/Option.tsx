import React, { createRef, useEffect } from 'react';
import styled from 'styled-components';
import { Option as OptionType } from '~/polling/types/Option';
import { Input } from '~/core/atoms/Input';
import { Option as GenericOption } from '~/polling/components/Option';
import { CloseIcon } from '~/core/atoms/CloseIcon';

export const Option: React.FC<{
    option: OptionType;
    onLabelChange: (label: string) => void;
    onSublabelChange?: (sublabel: string) => void;
    onRemove: () => void;
}> = ({ option, onRemove: handleRemove, onLabelChange: handleLabelChange, onSublabelChange: handleSublabelChange }) => {
    const ref = createRef<HTMLInputElement>();

    const label = (
        <CustomInput ref={ref} value={option.label} onChange={e => handleLabelChange(e.currentTarget.value)} />
    );

    const sublabel = handleSublabelChange && (
        <CustomInput value={option.sublabel || ''} onChange={e => handleSublabelChange(e.currentTarget.value)} />
    );

    useEffect(() => {
        if (ref.current) {
            ref.current.focus();
        }
    }, []);

    return (
        <GenericOption
            removeButton={
                <CloseIcon
                    style={{ position: 'absolute', top: '5px', right: '0px', height: '20px', width: '20px' }}
                    onClick={handleRemove}
                />
            }
            label={label}
            sublabel={sublabel}
            containerStyle={{ cursor: 'default' }}
        />
    );
};

const CustomInput = styled(Input)`
    text-align: right;
    height: min-content;
`;
