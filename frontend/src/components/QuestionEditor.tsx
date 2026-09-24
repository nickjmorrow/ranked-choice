import Button from 'src/components/Button';
import Icon from 'src/components/Icon';
import TextField from 'src/components/TextField';
import {
  addOptionButtonId,
  type DraftQuestion,
  MAX_OPTIONS,
  optionFieldId,
  questionFieldId,
  TEXT_LIMIT,
} from 'src/pollForm';
import { CARD, ICON_BUTTON } from 'src/styles';

interface Props {
  canRemove: boolean;
  /** Field id -> the problem with it, once the form has been submitted. */
  errors: Map<string, string>;
  number: number;
  onAddOption: () => void;
  onChange: (question: DraftQuestion) => void;
  onRemove: () => void;
  onRemoveOption: (key: number) => void;
  question: DraftQuestion;
}

/** One question of a new poll: its prompt, an optional note, and its options. */
export default function QuestionEditor({
  canRemove,
  errors,
  number,
  onAddOption,
  onChange,
  onRemove,
  onRemoveOption,
  question,
}: Props) {
  const legendId = `question-${String(question.key)}-legend`;

  return (
    <fieldset aria-labelledby={legendId} className={[CARD, 'flex flex-col gap-4 p-5'].join(' ')}>
      <div className={'flex items-center justify-between gap-3'}>
        <h2 className={'text-sm font-semibold text-ink'} id={legendId}>
          {`Question ${String(number)}`}
        </h2>
        {canRemove && (
          <Button onClick={onRemove} size={'sm'} variant={'danger'}>
            {`Remove question ${String(number)}`}
          </Button>
        )}
      </div>

      <TextField
        error={errors.get(questionFieldId(question.key))}
        id={questionFieldId(question.key)}
        label={'Prompt'}
        maxLength={TEXT_LIMIT}
        onChange={(value) => {
          onChange({ ...question, content: value });
        }}
        placeholder={'e.g. Where should the offsite be?'}
        value={question.content}
      />
      <TextField
        hint={'Guidance shown under the prompt.'}
        id={`question-${String(question.key)}-subheading`}
        label={'Note'}
        maxLength={TEXT_LIMIT}
        onChange={(value) => {
          onChange({ ...question, subheading: value });
        }}
        optional
        placeholder={'e.g. Rank as many as you like.'}
        value={question.subheading}
      />

      <div className={'flex flex-col gap-2'}>
        <h3 className={'text-sm font-medium text-ink'}>Options</h3>
        <ol className={'flex flex-col gap-3'}>
          {question.options.map((option, index) => {
            const labelId = optionFieldId(question.key, option.key);
            const name = `Option ${String(index + 1)}`;
            return (
              <li className={'flex items-start gap-2'} key={option.key}>
                <span
                  aria-hidden={'true'}
                  className={'mt-2 w-5 shrink-0 text-right text-xs text-ink-muted tabular-nums'}
                >
                  {index + 1}
                </span>
                <div className={'grid flex-1 gap-2 sm:grid-cols-[3fr_2fr]'}>
                  <TextField
                    error={errors.get(labelId)}
                    id={labelId}
                    label={`${name} label`}
                    labelHidden
                    maxLength={TEXT_LIMIT}
                    onChange={(value) => {
                      onChange({
                        ...question,
                        options: question.options.map((o) =>
                          o.key === option.key ? { ...o, label: value } : o,
                        ),
                      });
                    }}
                    placeholder={'Label'}
                    value={option.label}
                  />
                  <TextField
                    id={`${labelId}-detail`}
                    label={`${name} detail (optional)`}
                    labelHidden
                    maxLength={TEXT_LIMIT}
                    onChange={(value) => {
                      onChange({
                        ...question,
                        options: question.options.map((o) =>
                          o.key === option.key ? { ...o, sublabel: value } : o,
                        ),
                      });
                    }}
                    placeholder={'Detail (optional)'}
                    value={option.sublabel}
                  />
                </div>
                <button
                  aria-label={`Remove option ${String(index + 1)}${option.label.trim() === '' ? '' : `, ${option.label.trim()}`}`}
                  className={[ICON_BUTTON, 'mt-1'].join(' ')}
                  disabled={question.options.length <= 2}
                  onClick={() => {
                    onRemoveOption(option.key);
                  }}
                  title={
                    question.options.length <= 2
                      ? 'A question needs at least two options'
                      : undefined
                  }
                  type={'button'}
                >
                  <Icon name={'x'} />
                </button>
              </li>
            );
          })}
        </ol>
        {question.options.length < MAX_OPTIONS && (
          <div>
            <Button
              id={addOptionButtonId(question.key)}
              onClick={onAddOption}
              size={'sm'}
              variant={'ghost'}
            >
              <Icon className={'h-3.5 w-3.5'} name={'plus'} />
              Add option
            </Button>
          </div>
        )}
      </div>
    </fieldset>
  );
}
