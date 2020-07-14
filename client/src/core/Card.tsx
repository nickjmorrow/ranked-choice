import styled from 'styled-components';

export const Card = styled.div`
    box-shadow: ${p => p.theme.boxShadow.bs1};
    padding: ${p => p.theme.spacing.ss4};
    border-radius: ${p => p.theme.borderRadius.br1};
    margin-bottom: ${p => p.theme.spacing.ss4};
    max-width: 500px;
    display: flex;
    flex-direction: column;
`;
