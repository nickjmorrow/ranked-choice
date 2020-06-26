import * as React from 'react';
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
