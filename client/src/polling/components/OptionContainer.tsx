import styled from 'styled-components';

export const OptionContainer = styled.div`
    cursor: pointer;
    padding: ${p => p.theme.spacing.ss4};
    box-shadow: ${p => p.theme.boxShadow.bs1};
    border-radius: ${p => p.theme.borderRadius.br1};
    margin: ${p => p.theme.spacing.ss4} 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    transition: background-color ${p => p.theme.transitions.fast};
    align-items: center;
    min-height: ${p => p.theme.spacing.ss12};
    max-width: ${p => p.theme.spacing.ss96};
`;
