// external
import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

// inter
import { CloseIcon } from '~/core/atoms/CloseIcon';
import { TextArea } from '~/core/atoms/TextArea';
import { CreateOption } from '~/polling/components/CreateOption';
import { Question as QuestionType } from '~/polling/types/Question';
import { Option as OptionType } from '~/polling/types/Option';
import { Question as GenericQuestion } from '~/polling/components/Question';

// intra
import { Option } from '~/poll-creation/components/Option';
import { pollCreationActions } from '~/poll-creation/state/pollCreationActions';
import { OptionListContainer } from '~/polling/components/OptionListContainer';

export const Question: React.FC<{ question: QuestionType }> = ({ question }) => {
    const dispatch = useDispatch();
    const handleRemoveOption = (option: OptionType) => {
        dispatch(pollCreationActions.removeOption({ question, option }));
    };

    const handleRemoveQuestion = () => {
        dispatch(pollCreationActions.removeQuestion(question));
    };

    const handleCreate = (label: string) => {
        dispatch(pollCreationActions.createOption({ question, option: { label, sublabel: null } }));
    };

    const optionList = (
        <OptionListContainer>
            {question.options.map(o => (
                <Option
                    key={o.optionId}
                    option={o}
                    onRemove={() => handleRemoveOption(o)}
                    onSublabelChange={(sublabel: string) =>
                        dispatch(pollCreationActions.updateOption({ question, option: { ...o, sublabel } }))
                    }
                    onLabelChange={(label: string) =>
                        dispatch(pollCreationActions.updateOption({ question, option: { ...o, label } }))
                    }
                />
            ))}
            <CreateOption onChange={handleCreate} />
        </OptionListContainer>
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
        <CloseIcon
            onClick={handleRemoveQuestion}
            style={{ position: 'absolute', top: '-5px', right: '-5px', height: '20px', width: '20px' }}
        />
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
const CustomTextArea = styled(TextArea)`
    min-width: ${p => p.theme.spacing.ss64};
    max-width: ${p => p.theme.spacing.ss128};
    width: 100%;
`;

const SubheadingTextArea = styled(CustomTextArea)`
    color: inherit;
`;
