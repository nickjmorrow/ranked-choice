// external
import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

// inter
import { Typography } from '~/core/Typography';
import { Input } from '~/core/Input';
import { CloseIcon } from '~/core/CloseIcon';
import { CreateOption } from '~/polling/components/CreateOption';
import { Question as QuestionType } from '~/polling/types/Question';
import { Option as OptionType } from '~/polling/types/Option';
import { Question as GenericQuestion } from '~/polling/components/Question';

// intra
import { Option } from '~/poll-creation/components/Option';
import { pollCreationActions } from '~/poll-creation/state/pollCreationActions';
import { pollCreationSelectors } from '~/poll-creation/state/pollCreationSelectors';
import { TextArea } from '~/core/TextArea';

export const Question: React.FC<{ question: QuestionType }> = ({ question }) => {
    const dispatch = useDispatch();
    const handleCreateOption = (question: QuestionType, label: string) => {
        dispatch(pollCreationActions.createOption({ question, option: { label, sublabel: null } }));
    };
    const handleRemoveOption = (question: QuestionType, option: OptionType) => {
        dispatch(pollCreationActions.removeOption({ question, option }));
    };

    const handleRemoveQuestion = () => {
        dispatch(pollCreationActions.removeQuestion(question));
    };
    const currentInteractiveQuestionId = useSelector(pollCreationSelectors.getPollCreationState)
        .currentInteractingQuestionId;

    const handleCreate = (label: string) =>
        dispatch(pollCreationActions.createOption({ question, option: { label, sublabel: null } }));

    const optionList = (
        <OptionsContainer>
            {question.options.map(o => (
                <Option
                    key={o.optionId}
                    option={o}
                    onRemove={() => handleRemoveOption(question, o)}
                    onSublabelChange={(sublabel: string) =>
                        dispatch(pollCreationActions.updateOption({ question, option: { ...o, sublabel } }))
                    }
                    onLabelChange={(label: string) =>
                        dispatch(pollCreationActions.updateOption({ question, option: { ...o, label } }))
                    }
                />
            ))}
            <CreateOption onCreate={handleCreate} />
        </OptionsContainer>
    );

    const content = (
        <CustomTextArea
            value={question.content}
            placeholder={'Untitled Question'}
            onChange={e =>
                dispatch(pollCreationActions.updateQuestionContent({ content: e.currentTarget.value, question }))
            }
        />
    );

    const subheading = (
        <SubheadingTextArea
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
    );

    const handleClick = () => dispatch(pollCreationActions.setCurrentInteractiveQuestionId(question.questionId));

    const removeButton = (
        <CloseIcon onClick={handleRemoveQuestion} style={{ position: 'absolute', top: '0px', right: '0px' }} />
    );

    return (
        <GenericQuestion
            question={question}
            content={content}
            subheading={subheading}
            optionList={optionList}
            onClick={handleClick}
            removeButton={removeButton}
        />
    );
};
const OptionsContainer = styled.div``;

const CustomTextArea = styled(TextArea)`
    min-width: ${p => p.theme.spacing.ss64};
    max-width: ${p => p.theme.spacing.ss128};
    width: 100%;
`;

const SubheadingTextArea = styled(CustomTextArea)`
    color: inherit;
`;
