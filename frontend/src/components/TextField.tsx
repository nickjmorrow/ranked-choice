import { INPUT } from 'src/styles';

interface Props {
  /** The field's problem, if it has one. Shown under the input in red. */
  error?: string | undefined;
  /** Shown under the label; linked with aria-describedby. */
  hint?: string;
  id: string;
  label: string;
  /** Visually hidden label, for fields whose context already names them. */
  labelHidden?: boolean;
  maxLength: number;
  multiline?: boolean;
  onChange: (value: string) => void;
  optional?: boolean;
  placeholder?: string;
  value: string;
}

/**
 * A labelled input with its hint and error wired to it for assistive tech,
 * so no field on any page is identified by its placeholder alone.
 */
export default function TextField({
  error,
  hint,
  id,
  label,
  labelHidden = false,
  maxLength,
  multiline = false,
  onChange,
  optional = false,
  placeholder,
  value,
}: Props) {
  const hintId = hint === undefined ? undefined : `${id}-hint`;
  const errorId = error === undefined ? undefined : `${id}-error`;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  const shared = {
    'aria-describedby': describedBy,
    'aria-invalid': error === undefined ? undefined : true,
    id,
    maxLength,
    placeholder,
    value,
  };

  return (
    <div className={'flex flex-col gap-1'}>
      <label className={labelHidden ? 'sr-only' : 'text-sm font-medium text-ink'} htmlFor={id}>
        {label}
        {optional && <span className={'font-normal text-ink-muted'}>{' (optional)'}</span>}
      </label>
      {hint !== undefined && (
        <p className={'text-xs text-ink-muted'} id={hintId}>
          {hint}
        </p>
      )}
      {multiline ? (
        <textarea
          className={[INPUT, 'min-h-20 w-full resize-y'].join(' ')}
          onChange={(event) => {
            onChange(event.target.value);
          }}
          {...shared}
        />
      ) : (
        <input
          className={[INPUT, 'w-full'].join(' ')}
          onChange={(event) => {
            onChange(event.target.value);
          }}
          type={'text'}
          {...shared}
        />
      )}
      {error !== undefined && (
        <p className={'text-xs text-danger'} id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
}
