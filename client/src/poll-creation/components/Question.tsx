// external
import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

// inter
import { Typography } from '~/core/Typography';
import { CreateOption } from '~/polling/components/CreateOption';
import { Question as QuestionType } from '~/polling/types/Question';
import { Option } from '~/polling/components/Option';
import { Option as OptionType } from '~/polling/types/Option';

// intra
import { Card } from '~/poll-creation/components/Card';
import { pollCreationActions } from '~/poll-creation/state/pollCreationActions';
import { Input } from '~/core/Input';
import { pollCreationSelectors } from '~/poll-creation/state/pollCreationSelectors';

export const Question: React.FC<{ question: QuestionType }> = ({ question }) => {
    const dispatch = useDispatch();
    const handleCreateOption = (question: QuestionType, label: string) => {
        dispatch(pollCreationActions.createOption({ question, option: { label } }));
    };
    const handleRemoveOption = (question: QuestionType, option: OptionType) => {
        dispatch(pollCreationActions.removeOption({ question, option }));
    };
    const currentInteractiveQuestionId = useSelector(pollCreationSelectors.getPollCreationState)
        .currentInteractingQuestionId;
    const isEditable = question.questionId === currentInteractiveQuestionId;

    return (
        <Card
            key={question.questionId}
            onClick={() => dispatch(pollCreationActions.setCurrentInteractiveQuestionId(question.questionId))}
        >
            {isEditable ? (
                <>
                    <Input
                        value={question.content}
                        placeholder={'Untitled Question'}
                        onChange={e =>
                            dispatch(
                                pollCreationActions.updateQuestionContent({ content: e.currentTarget.value, question }),
                            )
                        }
                    />
                    <Input
                        value={question.subheading}
                        placeholder={'Subheading'}
                        style={{ fontSize: '14px' }}
                        onChange={e =>
                            dispatch(
                                pollCreationActions.updateQuestionSubheading({
                                    subheading: e.currentTarget.value,
                                    question,
                                }),
                            )
                        }
                    />
                </>
            ) : (
                <>
                    <Typography style={{ display: 'block', marginBottom: '4px' }}>{question.content}</Typography>
                    <Typography style={{ display: 'block', marginBottom: '8px' }} fontSizeVariant={'fs2'}>
                        {question.subheading}
                    </Typography>
                </>
            )}
            <OptionsContainer>
                {question.options.map(o => (
                    <Option
                        key={o.optionId}
                        style={{ marginBottom: '8px', boxShadow: 'none', paddingLeft: '0' }}
                        option={o}
                        onRemove={() => handleRemoveOption(question, o)}
                        isEditable={isEditable}
                        onChange={(label: string) =>
                            dispatch(pollCreationActions.updateOption({ question, option: { ...o, label } }))
                        }
                    />
                ))}
                <CreateOption onCreate={(label: string) => handleCreateOption(question, label)} />
            </OptionsContainer>
        </Card>
    );
};
const OptionsContainer = styled.div``;
