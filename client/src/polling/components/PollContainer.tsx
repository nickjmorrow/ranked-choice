import styled from 'styled-components';

export const PollContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    max-width: 500px;
    margin: ${p => p.theme.spacing.ss16} ${p => p.theme.spacing.ss4};
`;
