import Icon from 'src/components/Icon';

interface Props {
  isReplaying: boolean;
  onReplay: () => void;
  onSelect: (index: number) => void;
  rounds: number;
  selected: number;
}

/**
 * A button per round, and one that plays the count from the start. Toggle
 * buttons (`aria-pressed`) rather than tabs: the chart below is one panel
 * whose contents change, not several panels.
 */
export default function RoundPicker({ isReplaying, onReplay, onSelect, rounds, selected }: Props) {
  if (rounds <= 1) return null;

  return (
    <div className={'flex flex-wrap items-center gap-2'}>
      <div
        aria-label={'Round'}
        className={'flex flex-wrap gap-0.5 rounded-lg border border-ink/10 p-0.5'}
        role={'group'}
      >
        {Array.from({ length: rounds }, (_, index) => {
          const isActive = index === selected;
          return (
            <button
              aria-pressed={isActive}
              className={[
                'rounded-md px-2.5 py-1 text-xs font-medium transition',
                isActive
                  ? 'bg-accent text-on-accent'
                  : 'text-ink-muted hover:bg-ink/5 hover:text-ink',
              ].join(' ')}
              key={index}
              onClick={() => {
                onSelect(index);
              }}
              type={'button'}
            >
              {index === rounds - 1
                ? `Round ${String(index + 1)} · final`
                : `Round ${String(index + 1)}`}
            </button>
          );
        })}
      </div>
      <button
        className={
          'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-ink-muted transition hover:bg-ink/5 hover:text-ink disabled:opacity-50'
        }
        disabled={isReplaying}
        onClick={onReplay}
        type={'button'}
      >
        <Icon className={'h-3 w-3'} name={'play'} />
        {isReplaying ? 'Replaying…' : 'Replay the count'}
      </button>
    </div>
  );
}
