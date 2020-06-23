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
    colors: {
        background: 'hsl(0, 0%, 100%)',
        transparent: 'transparent',
        inherit: 'inherit',
        core: generateColorShades(themeInputs.colors.core),
        accent: generateColorShades(themeInputs.colors.accent),
        neutral: generateColorShades(themeInputs.colors.neutral),
        success: generateColorShades(themeInputs.colors.success),
        warning: generateColorShades(themeInputs.colors.warning),
        danger: generateColorShades(themeInputs.colors.danger),
    },
    transitions: getTransitions(themeInputs.transitions),
    boxShadow: getBoxShadow('hsla(0, 0%, 0%, 0.2)'),
    border: {
        borderRadius: getBorderRadius(themeInputs.border.borderRadius),
        borderStyle: getBorderStyle(themeInputs.border.borderStyle),
    },
    typography: {
        fontSizes: getFontSize(themeInputs.typography.fontSizes),
        fontFamily: themeInputs.typography.fontFamily,
        fontWeights: themeInputs.typography.fontWeights,
        lineHeight: themeInputs.typography.lineHeight,
    },
    spacing: getSpacing(themeInputs.spacing),
    icons: {
        iconSizes: getIconSize(themeInputs.icons.iconSizes),
    },
    appSettings: {
        githubUrl: themeInputs.appSettings.githubUrl,
        linkedInUrl: themeInputs.appSettings.linkedInUrl,
        portfolioUrl: themeInputs.appSettings.portfolioUrl,
        appName: themeInputs.appSettings.appName,
        appUrl: themeInputs.appSettings.appUrl,
    },
});
