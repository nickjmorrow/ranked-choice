import { themeInputs as themeInputsValue } from '~/theming/themeInputs';
import {
    generateColorShades,
    getTransitions,
    getBoxShadow,
    getBorderRadius,
    getBorderStyle,
    getFontSize,
    getSpacing,
    getIconSize,
} from '~/theming/styleProviders';

export const getTheme = (themeInputs: typeof themeInputsValue) => ({
    backgroundColor: 'white',
    coreColor: generateColorShades(themeInputs.colors.core),
    accentColor: generateColorShades(themeInputs.colors.accent),
    neutralColor: generateColorShades(themeInputs.colors.neutral),
    successColor: generateColorShades(themeInputs.colors.success),
    warningColor: generateColorShades(themeInputs.colors.warning),
    dangerColor: generateColorShades(themeInputs.colors.danger),
    transitions: getTransitions(themeInputs.transitions),
    borderRadius: getBorderRadius(themeInputs.border.borderRadius),
    borderStyle: getBorderStyle(themeInputs.border.borderStyle),
    boxShadow: getBoxShadow('hsla(0, 0%, 0%, 0.2)'),
    fontSizes: getFontSize(themeInputs.typography.fontSizes),
    fontFamilies: themeInputs.typography.fontFamilies,
    fontWeights: themeInputs.typography.fontWeights,
    lineHeights: themeInputs.typography.lineHeights,
    spacing: getSpacing(themeInputs.spacing),
});
