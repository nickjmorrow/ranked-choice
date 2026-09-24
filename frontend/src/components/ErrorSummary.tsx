import type { Ref } from 'react';
import type { DraftError } from 'src/pollForm';

interface Props {
  errors: DraftError[];
  ref?: Ref<HTMLDivElement>;
}

/**
 * Every problem with a form, at the top, each linking to its field. Receives
 * focus when a submit fails, so a screen reader reads the list first.
 */
export default function ErrorSummary({ errors, ref }: Props) {
  if (errors.length === 0) return null;
  return (
    <div
      aria-labelledby={'error-summary-title'}
      className={'rounded-xl border border-danger/40 bg-danger/5 p-4'}
      ref={ref}
      role={'alert'}
      tabIndex={-1}
    >
      <h2 className={'text-sm font-semibold text-ink'} id={'error-summary-title'}>
        {errors.length === 1
          ? 'Fix one thing before creating the poll'
          : `Fix ${String(errors.length)} things before creating the poll`}
      </h2>
      <ul className={'mt-2 flex flex-col gap-1 text-sm'}>
        {errors.map((error) => (
          <li key={`${error.fieldId}:${error.message}`}>
            <a
              className={'text-danger underline underline-offset-2'}
              href={`#${error.fieldId}`}
              onClick={(event) => {
                // A hash jump scrolls but does not always focus; do both.
                event.preventDefault();
                document.getElementById(error.fieldId)?.focus();
              }}
            >
              {error.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
