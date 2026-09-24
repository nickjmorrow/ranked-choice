import { type ReactNode, useEffect, useState } from 'react';
import type { Option, Tally } from 'src/api/types';
import RoundChart from 'src/components/RoundChart';
import RoundPicker from 'src/components/RoundPicker';
import { describeOutcome, describeRound, roundView } from 'src/rounds';

interface Props {
  /** Shown under the outcome when there are no ballots: a way to add one. */
  emptyAction?: ReactNode;
  options: readonly Option[];
  tally: Tally;
}

const REPLAY_STEP_MS = 1400;

/**
 * One question's count: the outcome in a sentence, then any round of it as a
 * chart with what happened in that round written underneath.
 */
export default function QuestionResults({ emptyAction, options, tally }: Props) {
  const last = tally.rounds.length - 1;
  // null follows the final round, including when a live simulation adds or
  // removes rounds under it.
  const [selected, setSelected] = useState<null | number>(null);
  const [isReplaying, setIsReplaying] = useState(false);
  const index = selected === null ? last : Math.min(selected, last);

  useEffect(() => {
    if (!isReplaying) return;
    const timer = setTimeout(() => {
      if (index >= last) {
        setIsReplaying(false);
        setSelected(null);
      } else {
        setSelected(index + 1);
      }
    }, REPLAY_STEP_MS);
    return () => clearTimeout(timer);
  }, [index, isReplaying, last]);

  const outcome = describeOutcome(options, tally);
  const hasVotes = tally.outcome.kind !== 'no-votes';

  return (
    <div className={'flex flex-col gap-5'}>
      <div>
        <p
          className={[
            'text-lg font-semibold tracking-tight',
            tally.outcome.kind === 'winner' ? 'text-accent' : 'text-ink',
          ].join(' ')}
        >
          {outcome.headline}
        </p>
        <p className={'text-sm text-ink-muted'}>{outcome.detail}</p>
        {!hasVotes && emptyAction !== undefined && <div className={'mt-3'}>{emptyAction}</div>}
      </div>

      {hasVotes && (
        <>
          <RoundPicker
            isReplaying={isReplaying}
            onReplay={() => {
              setSelected(0);
              setIsReplaying(true);
            }}
            onSelect={(next) => {
              setIsReplaying(false);
              setSelected(next === last ? null : next);
            }}
            rounds={tally.rounds.length}
            selected={index}
          />
          <RoundChart view={roundView(options, tally, index)} />
          <div aria-live={'polite'} className={'rounded-lg bg-ink/[0.03] px-4 py-3'}>
            <p className={'mb-1 text-xs font-semibold tracking-wide text-ink-muted uppercase'}>
              {`Round ${String(index + 1)} of ${String(tally.rounds.length)}`}
            </p>
            <ul className={'flex flex-col gap-1 text-sm text-ink'}>
              {describeRound(options, tally, index).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
