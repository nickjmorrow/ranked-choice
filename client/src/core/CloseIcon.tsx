// external
import React from 'react';
import { Svg } from '~/core/icons/Svg';
import styled from 'styled-components';

export const CloseIcon: React.FC<React.HTMLProps<HTMLOrSVGElement>> = props => {
    return (
        // @ts-ignore
        <CustomSvg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
                fillRule="evenodd"
                color="inherit"
                d="M15.78 14.36a1 1 0 0 1-1.42 1.42l-2.82-2.83-2.83 2.83a1 1 0 1 1-1.42-1.42l2.83-2.82L7.3 8.7a1 1 0 0 1 1.42-1.42l2.83 2.83 2.82-2.83a1 1 0 0 1 1.42 1.42l-2.83 2.83 2.83 2.82z"
            />
        </CustomSvg>
    );
};

const CustomSvg = styled(Svg)`
    fill: ${p => p.theme.dangerColor.cs5};
`;
