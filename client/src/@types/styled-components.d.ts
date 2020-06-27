import 'styled-components';
import { getTheme } from '~/theming/getTheme';

type Theme = ReturnType<typeof getTheme>;

declare module 'styled-components' {
    export interface DefaultTheme {
        backgroundColor: Theme['backgroundColor'];
        coreColor: Theme['coreColor'];
        accentColor: Theme['accentColor'];
        warningColor: Theme['warningColor'];
        dangerColor: Theme['dangerColor'];
        successColor: Theme['dangerColor'];
        neutralColor: Theme['neutralColor'];
        fontSizes: Theme['fontSizes'];
        fontFamilies: Theme['fontFamilies'];
        fontWeights: Theme['fontWeights'];
        lineHeights: Theme['lineHeights'];
        transitions: Theme['transitions'];
        boxShadow: Theme['boxShadow'];
        borderRadius: Theme['borderRadius'];
        borderStyle: Theme['borderStyle'];
        spacing: Theme['spacing'];
    }
}
