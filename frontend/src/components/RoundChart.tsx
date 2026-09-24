import { percent, plural } from 'src/format';
import type { OptionRow, RoundView } from 'src/rounds';

interface Props {
  view: RoundView;
}

const STATUS_BADGE: Partial<Record<OptionRow['status'], { className: string; text: string }>> = {
  'eliminated-now': { className: 'bg-danger/10 text-danger', text: 'Eliminated' },
  tied: { className: 'bg-ink/10 text-ink', text: 'Tied' },
  winner: { className: 'bg-accent text-on-accent', text: 'Winner' },
};

/**
 * One round of a count as horizontal bars. A bar's length is the option's
 * share of the votes still counting, so the dashed line at the middle is the
 * majority line in every round. The solid part of a bar is first choices; the
 * lighter part is what it has gained from eliminated options since.
 *
 * The bars are decoration over text: every number is written out in the row.
 */
export default function RoundChart({ view }: Props) {
  const width = (votes: number) =>
    view.continuingVotes === 0 ? '0%' : `${String((votes / view.continuingVotes) * 100)}%`;

  return (
    <div className={'flex flex-col gap-3'}>
      <ol aria-label={`Round ${String(view.round)} counts`} className={'flex flex-col gap-3'}>
        {view.rows.map((row) => {
          const isOut = row.status === 'eliminated-earlier';
          const badge = STATUS_BADGE[row.status];
          const isFading = row.status === 'eliminated-now';
          return (
            <li
              className={[
                'grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1.5 sm:grid-cols-[11rem_minmax(0,1fr)_6.5rem] sm:items-center',
                isOut ? 'opacity-55' : '',
              ].join(' ')}
              key={row.optionId}
            >
              <div className={'col-start-1 row-start-1 min-w-0'}>
                <div className={'flex flex-wrap items-center gap-x-2 gap-y-0.5'}>
                  <span className={'truncate text-sm font-medium text-ink'}>{row.label}</span>
                  {badge !== undefined && (
                    <span
                      className={[
                        'rounded px-1.5 py-0.5 text-[0.6875rem] font-semibold tracking-wide uppercase',
                        badge.className,
                      ].join(' ')}
                    >
                      {badge.text}
                    </span>
                  )}
                </div>
                {row.sublabel !== null && (
                  <p className={'truncate text-xs text-ink-muted'}>{row.sublabel}</p>
                )}
              </div>

              <div
                aria-hidden={'true'}
                className={[
                  'relative col-span-2 row-start-2 h-4 overflow-hidden rounded sm:col-span-1 sm:col-start-2 sm:row-start-1',
                  // Out of the race: no track, so the eye goes to the options still in it.
                  isOut ? 'hidden sm:block' : 'bg-ink/5',
                ].join(' ')}
              >
                <div className={'flex h-full'}>
                  <div
                    className={[
                      'h-full motion-safe:transition-[width] motion-safe:duration-700 motion-safe:ease-out',
                      isFading ? 'bg-ink/35' : 'bg-accent',
                    ].join(' ')}
                    style={{ width: width(row.firstChoice) }}
                  />
                  <div
                    className={[
                      'h-full motion-safe:transition-[width] motion-safe:duration-700 motion-safe:ease-out',
                      isFading ? 'bg-ink/20' : 'bg-accent-soft',
                    ].join(' ')}
                    style={{ width: width(row.transferred) }}
                  />
                </div>
                <div
                  className={'absolute inset-y-0 left-1/2 border-l border-dashed border-ink/50'}
                />
              </div>

              <div
                className={'col-start-2 row-start-1 text-right text-sm tabular-nums sm:col-start-3'}
              >
                {isOut ? (
                  <span className={'text-xs text-ink-muted'}>
                    {row.eliminatedIn === null
                      ? 'Out'
                      : `Out after round ${String(row.eliminatedIn)}`}
                  </span>
                ) : (
                  <>
                    <span className={'font-semibold text-ink'}>{row.votes}</span>
                    <span
                      className={'text-ink-muted'}
                    >{` · ${percent(row.votes, view.continuingVotes)}`}</span>
                    {row.change !== null && row.change > 0 && (
                      <span className={'ml-1.5 text-xs font-medium text-success'}>
                        {`+${String(row.change)}`}
                      </span>
                    )}
                    <span className={'sr-only'}>
                      {row.transferred > 0
                        ? `, ${plural(row.transferred, 'vote')} of them gained by transfer`
                        : ''}
                      {row.change !== null && row.change > 0
                        ? `, up ${String(row.change)} since the previous round`
                        : ''}
                    </span>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <ul
        aria-label={'Key'}
        className={'flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted'}
      >
        <li className={'flex items-center gap-1.5'}>
          <span aria-hidden={'true'} className={'h-2.5 w-4 rounded-sm bg-accent'} />
          First choices
        </li>
        <li className={'flex items-center gap-1.5'}>
          <span aria-hidden={'true'} className={'h-2.5 w-4 rounded-sm bg-accent-soft'} />
          Gained by transfer
        </li>
        <li className={'flex items-center gap-1.5'}>
          <span aria-hidden={'true'} className={'h-3 border-l border-dashed border-ink/50'} />
          {`Majority (${String(view.majority)} of ${String(view.continuingVotes)})`}
        </li>
      </ul>
    </div>
  );
}
