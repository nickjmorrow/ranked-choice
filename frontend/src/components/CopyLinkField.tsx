import Icon from 'src/components/Icon';
import useCopy from 'src/hooks/useCopy';
import { INPUT } from 'src/styles';

interface Props {
  hint: string;
  id: string;
  label: string;
  url: string;
}

/**
 * A link to share, with a copy button. The field is read-only and selects
 * itself on focus, so copying by hand works when the clipboard is refused.
 */
export default function CopyLinkField({ hint, id, label, url }: Props) {
  const { copy, state } = useCopy();

  return (
    <div className={'flex flex-col gap-1'}>
      <label className={'text-sm font-medium text-ink'} htmlFor={id}>
        {label}
      </label>
      <p className={'text-xs text-ink-muted'} id={`${id}-hint`}>
        {hint}
      </p>
      <div className={'flex gap-2'}>
        <input
          aria-describedby={`${id}-hint`}
          className={[INPUT, 'w-full min-w-0 font-mono text-xs'].join(' ')}
          id={id}
          onFocus={(event) => {
            event.currentTarget.select();
          }}
          readOnly
          value={url}
        />
        <button
          className={
            'inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-ink/15 px-3 text-sm font-medium text-ink transition hover:bg-surface-raised'
          }
          onClick={() => void copy(url)}
          type={'button'}
        >
          <Icon name={state === 'copied' ? 'check' : 'copy'} />
          {state === 'copied' ? 'Copied' : 'Copy'}
          <span className={'sr-only'}>{` ${label.toLowerCase()}`}</span>
        </button>
      </div>
      <p aria-live={'polite'} className={'min-h-4 text-xs text-ink-muted'}>
        {state === 'failed'
          ? 'Could not copy automatically — the link is selected; copy it by hand.'
          : ''}
      </p>
    </div>
  );
}
