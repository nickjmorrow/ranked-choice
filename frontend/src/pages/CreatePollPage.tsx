import { type SubmitEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import Button from 'src/components/Button';
import ErrorSummary from 'src/components/ErrorSummary';
import Icon from 'src/components/Icon';
import QuestionEditor from 'src/components/QuestionEditor';
import TextField from 'src/components/TextField';
import useCreatePoll from 'src/hooks/useCreatePoll';
import useDocumentTitle from 'src/hooks/useDocumentTitle';
import usePollDraft from 'src/hooks/usePollDraft';
import useRetentionNote from 'src/hooks/useRetentionNote';
import { paths } from 'src/paths';
import {
  ADD_QUESTION_ID,
  addOptionButtonId,
  blankQuestion,
  DESCRIPTION_LIMIT,
  isBlank,
  MAX_QUESTIONS,
  nextKey,
  optionFieldId,
  questionFieldId,
  TEXT_LIMIT,
  TITLE_ID,
  toNewPoll,
  validateDraft,
} from 'src/pollForm';

/**
 * Create a poll: a title, and questions with their options. The draft is kept
 * in this browser as it is typed; problems are listed at the top and beside
 * each field once the form has been submitted, not while it is being filled in.
 */
export default function CreatePollPage() {
  useDocumentTitle('New poll');
  const navigate = useNavigate();
  const creation = useCreatePoll();
  const retention = useRetentionNote();
  const { clear, draft, setDraft } = usePollDraft();
  const [submitted, setSubmitted] = useState(false);
  const summary = useRef<HTMLDivElement>(null);

  // The id of an element to focus once the next render has put it on the page:
  // a newly added field, or the button next to one just removed.
  const focusNext = useRef<null | string>(null);
  const setFocusId = (id: string) => {
    focusNext.current = id;
  };
  useEffect(() => {
    if (focusNext.current === null) return;
    document.getElementById(focusNext.current)?.focus();
    focusNext.current = null;
  });

  const errors = submitted ? validateDraft(draft) : [];
  const errorByField = new Map(errors.map((error) => [error.fieldId, error.message]));

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    if (validateDraft(draft).length > 0) {
      // After the summary renders.
      requestAnimationFrame(() => summary.current?.focus());
      return;
    }
    creation.mutate(toNewPoll(draft), {
      onSuccess: ({ link }) => {
        clear();
        void navigate(paths.share(link));
      },
    });
  };

  return (
    <form className={'flex flex-col gap-6'} noValidate onSubmit={submit}>
      <header>
        <h1 className={'text-2xl font-semibold tracking-tight text-ink sm:text-3xl'}>New poll</h1>
        <p className={'mt-1 max-w-prose text-sm text-ink-muted'}>
          Voters rank the options for each question, and each question is counted by instant runoff.
          You get a link to share when you are done.
          {retention !== null && ` ${retention}`}
        </p>
      </header>

      <ErrorSummary errors={errors} ref={summary} />

      <div className={'flex flex-col gap-4'}>
        <TextField
          error={errorByField.get(TITLE_ID)}
          id={TITLE_ID}
          label={'Title'}
          maxLength={TEXT_LIMIT}
          onChange={(value) => {
            setDraft({ ...draft, title: value });
          }}
          placeholder={'e.g. Team offsite 2026'}
          value={draft.title}
        />
        <TextField
          id={'poll-description'}
          label={'Description'}
          maxLength={DESCRIPTION_LIMIT}
          multiline
          onChange={(value) => {
            setDraft({ ...draft, description: value });
          }}
          optional
          placeholder={'Anything voters should know before they rank.'}
          value={draft.description}
        />
      </div>

      {draft.questions.map((question, index) => (
        <QuestionEditor
          canRemove={draft.questions.length > 1}
          errors={errorByField}
          key={question.key}
          number={index + 1}
          onAddOption={() => {
            const key = nextKey(draft);
            setDraft({
              ...draft,
              questions: draft.questions.map((q) =>
                q.key === question.key
                  ? { ...q, options: [...q.options, { key, label: '', sublabel: '' }] }
                  : q,
              ),
            });
            setFocusId(optionFieldId(question.key, key));
          }}
          onChange={(changed) => {
            setDraft({
              ...draft,
              questions: draft.questions.map((q) => (q.key === changed.key ? changed : q)),
            });
          }}
          onRemove={() => {
            setDraft({
              ...draft,
              questions: draft.questions.filter((q) => q.key !== question.key),
            });
            setFocusId(ADD_QUESTION_ID);
          }}
          onRemoveOption={(key) => {
            setDraft({
              ...draft,
              questions: draft.questions.map((q) =>
                q.key === question.key
                  ? { ...q, options: q.options.filter((o) => o.key !== key) }
                  : q,
              ),
            });
            setFocusId(addOptionButtonId(question.key));
          }}
          question={question}
        />
      ))}

      <div className={'flex flex-wrap items-center justify-between gap-3'}>
        <Button
          disabled={draft.questions.length >= MAX_QUESTIONS}
          id={ADD_QUESTION_ID}
          onClick={() => {
            const question = blankQuestion(nextKey(draft));
            setDraft({ ...draft, questions: [...draft.questions, question] });
            setFocusId(questionFieldId(question.key));
          }}
        >
          <Icon name={'plus'} />
          Add question
        </Button>
        {!isBlank(draft) && (
          <Button
            onClick={() => {
              clear();
              setSubmitted(false);
              setFocusId(TITLE_ID);
            }}
            size={'sm'}
            variant={'ghost'}
          >
            Start over
          </Button>
        )}
      </div>

      <div className={'flex flex-col gap-3 border-t border-ink/10 pt-6'}>
        {creation.isError && (
          <p className={'text-sm text-danger'} role={'alert'}>
            {`The poll was not created: ${creation.error.message}`}
          </p>
        )}
        <div className={'flex flex-wrap items-center gap-3'}>
          <Button disabled={creation.isPending} type={'submit'} variant={'primary'}>
            {creation.isPending ? 'Creating poll…' : 'Create poll'}
          </Button>
          <p className={'text-xs text-ink-muted'}>
            Your draft is saved in this browser until then.
          </p>
        </div>
      </div>
    </form>
  );
}
