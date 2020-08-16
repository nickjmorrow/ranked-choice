import styled from 'styled-components';
import { Button } from '~/core/Button';

export const WideButton = styled(Button)`
    width: 100%;
    max-width: 413px;
    padding: ${p => p.theme.spacing.ss4};
`;
