import styled from 'styled-components';
import { Theme } from '~/theming';

type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body';

const getFontSize = (variant?: Variant) => {
    switch (variant) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
            return 'default';
        case 'body':
            return '14px';
        default:
            return 'inherit';
    }
};

const getTag = (variant?: Variant) => {
    switch (variant) {
        case 'h1':
            return 'h1';
        case 'h2':
            return 'h2';
        case 'h3':
            return 'h3';
        case 'h4':
            return 'h4';
        case 'h5':
            return 'h5';
        case 'h6':
            return 'h6';
        case 'body':
        default:
            return 'span';
    }
};

type ColorVariant = 'inherit';

const getColor = (theme: Theme, colorVariant?: ColorVariant) => {
    switch (colorVariant) {
        case 'inherit':
            return 'inherit';
        default:
            return theme.colors.core.cs9;
    }
};

interface TypographyProps {
    variant?: Variant;
    colorVariant?: ColorVariant;
}

export const Typography = styled('span').attrs((p: TypographyProps) => ({ as: getTag(p.variant) }))<TypographyProps>`
    font-family: ${p => p.theme.typography.fontFamily.default};
    font-size: ${p => getFontSize(p.variant)};
    color: ${p => getColor(p.theme, p.colorVariant)};
`;
