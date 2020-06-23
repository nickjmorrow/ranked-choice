import 'styled-components';
import { getTheme } from '~/theming/getTheme';

type Theme = ReturnType<typeof getTheme>;

declare module 'styled-components' {
    export interface DefaultTheme {
        typography: Theme['typography'];
        colors: Theme['colors'];
        transitions: Theme['transitions'];
        boxShadow: Theme['boxShadow'];
        border: Theme['border'];
        spacing: Theme['spacing'];
        icons: Theme['icons'];
        appSettings: Theme['appSettings'];
    }
}
