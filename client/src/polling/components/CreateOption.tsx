import React from 'react';
import { Input } from '~/core/Input';
import styled from 'styled-components';
import { OptionContainer } from '~/polling/components/OptionContainer';
import { Option } from '~/polling/components/Option';

interface Props {
    onChange: (label: string) => void;
}

export const CreateOption: React.FC<Props> = ({ onChange: handleChange }) => {
    return (
        // <OptionContainer>
        //     <InnerContainer>

        //     </InnerContainer>
        // </OptionContainer>
        <Option
            label={
                <StyledInput
                    placeholder={'New Option'}
                    value={''}
                    onChange={e => handleChange(e.currentTarget.value)}
                    style={{ textAlign: 'right' }}
                />
            }
        />
    );
};

const StyledInput = styled(Input)`
    padding: ${p => p.theme.spacing.ss2} ${p => p.theme.spacing.ss2} ${p => p.theme.spacing.ss2} 0;
`;

const InnerContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;
