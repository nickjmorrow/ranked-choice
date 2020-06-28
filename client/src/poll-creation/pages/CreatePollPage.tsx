// external
import React, { useState } from 'react';
import styled from 'styled-components';
import { Typography } from '~/core/Typography';
import { Input } from '~/core/Input';
import { Question } from '~/polling/types/Question';
import { Option } from '~/polling/components/Option';
import { useSelector } from 'react-redux';
import { pollCreationSelectors } from '~/poll-creation/state/pollCreationSelectors';

export const CreatePollPage: React.FC = () => {
    const pollCreationState = useSelector(pollCreationSelectors.getPollCreationState);
    const [title, setTitle] = useState(pollCreationState.title);
    const [description, setDescription] = useState(pollCreationState.description);
    const [questions, setQuestions] = useState<Question[]>([
        {
            questionId: 1,
            orderId: 1,
            content: 'U.S. House of Representatives for District 1',
            subheading: 'Rank all available options.',
            isRequired: true,
            options: [
                { optionId: 1, label: 'Prince Passionfruit' },
                { optionId: 2, label: 'Sarah Strawberry' },
                { optionId: 3, label: 'Benny Blueberry' },
            ],
        },
    ]);
    return (
        <Container>
            <Typography variant={'h2'}>Create Poll</Typography>
            <Card>
                <Input
                    value={title}
                    placeholder={'Untitled Poll'}
                    style={{ fontSize: '18px', marginBottom: '8px' }}
                    onChange={e => setTitle(e.currentTarget.value)}
                />
                <Input
                    value={description}
                    placeholder={'Poll Description'}
                    onChange={e => setDescription(e.currentTarget.value)}
                />
            </Card>
            {questions.map(q => (
                <Card key={q.questionId}>
                    <Typography style={{ display: 'block', marginBottom: '4px' }}>{q.content}</Typography>
                    <Typography style={{ display: 'block', marginBottom: '8px' }} fontSizeVariant={'fs2'}>
                        {q.subheading}
                    </Typography>
                    <OptionsContainer>
                        {q.options.map(o => (
                            <Option
                                key={o.optionId}
                                style={{ marginBottom: '8px', boxShadow: 'none', paddingLeft: '0' }}
                                option={o}
                                onRemove={() => {
                                    return;
                                }}
                            />
                        ))}
                    </OptionsContainer>
                </Card>
            ))}
        </Container>
    );
};

const Container = styled.div``;

const TitleContainer = styled.div``;

const Card = styled.div`
    box-shadow: ${p => p.theme.boxShadow.bs1};
    padding: ${p => p.theme.spacing.ss4};
    border-radius: ${p => p.theme.borderRadius.br1};
    margin-bottom: ${p => p.theme.spacing.ss4};
`;

const OptionsContainer = styled.div``;
