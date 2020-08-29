import styled from 'styled-components';

export const Input = styled.input`
    font-family: ${p => p.theme.fontFamilies.default};
	padding: ${p => p.theme.spacing.ss2};
	border-radius; ${p => p.theme.borderRadius.br1};
	outline: none;
	border: none;
	&: focus {
		border-bottom: ${p => p.theme.borderStyle.bs1} ${p => p.theme.coreColor.cs4};
	}
`;
