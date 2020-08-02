import styled from 'styled-components';
import { Theme } from '~/theming';

type State = 'normal' | 'hover' | 'active';

interface Props {
    isEnabled?: boolean;
}

const getColor = (theme: Theme, props: Props, state: State) => {
    if (props.isEnabled === false) {
        return theme.neutralColor.cs5;
    }

    switch (state) {
        case 'normal':
            return theme.coreColor.cs5;
        case 'hover':
            return theme.coreColor.cs4;
        case 'active':
            return theme.coreColor.cs6;
    }
};

export const Button = styled.button<Props>`
    padding: ${p => p.theme.spacing.ss4} ${p => p.theme.spacing.ss6};
    border-radius: ${p => p.theme.borderRadius.br1};
    outline: none;
    border: none;
    cursor: ${p => (p.isEnabled ? 'pointer' : 'none')};
    background-color: ${p => getColor(p.theme, p, 'normal')};
    color: ${p => p.theme.backgroundColor};
    font-family: ${p => p.theme.fontFamilies.default};
    &: hover {
        background-color: ${p => getColor(p.theme, p, 'hover')};
    }
    &: active {
        background-color: ${p => getColor(p.theme, p, 'active')};
    }
`;
