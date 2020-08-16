import styled from 'styled-components';

export const Paper = styled.div`
    box-shadow: ${p => p.theme.boxShadow.bs1};
    padding: ${p => p.theme.spacing.ss4};
    border-radius: ${p => p.theme.borderRadius.br1};
    height: max-content;
`;
