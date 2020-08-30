import React from 'react';
import { Typography } from '~/core/atoms/Typography';
import styled from 'styled-components';
import { componentRouteMappings } from '~/core/componentRouteMappings';
import { Link } from '~/core/molecules/Link';

export const Home: React.FC = () => {
    return (
        <Container>
            <Typography>Hello and welcome!</Typography>
            <LinksContainer>
                {componentRouteMappings
                    .filter(crm => crm.description !== undefined)
                    .map(crm => (
                        <Section>
                            <Link route={crm.exampleLink || crm.link || crm.route}>
                                <Label>{crm.label}</Label>
                            </Link>
                            <Description>{crm.description}</Description>
                        </Section>
                    ))}
            </LinksContainer>
        </Container>
    );
};

const Container = styled.div`
    margin: ${p => p.theme.spacing.ss16};
`;

const LinksContainer = styled.div``;

const Section = styled.div`
    ${({ theme }) => `
		display: flex;
		flex-direction: column;
		padding: ${theme.spacing.ss8} 0;
	`}
`;

const Label = styled(Typography)`
    ${({ theme }) => `
		font-size: ${theme.fontSizes.fs6};
		color: ${theme.coreColor.cs5};
		margin-bottom: ${theme.spacing.ss4};
		display: block;
	`}
`;

const Description = styled(Typography)``;
