import styled from 'styled-components';

export const Input = styled.input`
    font-family: ${p => p.theme.fontFamilies.default};
    color: ${p => p.theme.coreColor.cs9};
    font-size: ${p => p.theme.fontSizes.fs3};
	padding: ${p => p.theme.spacing.ss2};
	border-radius; ${p => p.theme.borderRadius.br1};
	outline: none;
	border: none;
`;
