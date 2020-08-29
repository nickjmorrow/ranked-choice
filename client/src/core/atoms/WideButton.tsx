import styled from 'styled-components';
import { Button } from '~/core/atoms/Button';

export const WideButton = styled(Button)`
    width: 100%;
    padding: ${p => p.theme.spacing.ss4};
`;
