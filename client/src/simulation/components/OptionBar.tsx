import styled from 'styled-components';

export const OptionBar = styled.div`
    box-shadow: ${p => p.theme.boxShadow.bs1};
    max-width: ${p => p.theme.spacing.ss64};
    padding: ${p => p.theme.spacing.ss4};
    border-radius: ${p => p.theme.borderRadius.br1};
    height: max-content;
`;
