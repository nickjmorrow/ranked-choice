import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useEffect, useRef } from 'react';
import type { Option, Question } from 'src/api/types';
import Button from 'src/components/Button';
import Icon from 'src/components/Icon';
import RankedOption, { type RankedControl } from 'src/components/RankedOption';
import { ordinal } from 'src/format';
import { addToRanking, moveInRanking, removeFromRanking, unranked } from 'src/ranking';
import { CARD } from 'src/styles';

interface Props {
  /** Says a change out loud, for screen reader users. */
  announce: (message: string) => void;
  error: string | undefined;
  number: number;
  onChange: (ranking: number[]) => void;
  question: Question;
  ranking: number[];
  total: number;
}

type PendingFocus =
  | { control: RankedControl; kind: 'ranked'; optionId: number }
  | { index: number; kind: 'unranked' }
  | null;

/**
 * One question on a ballot: the voter's ranking so far, and the options not
 * yet in it. Clicking an option ranks it next; the ranking can then be
 * reordered by dragging, by keyboard, or with its buttons.
 */
export default function RankingQuestion({
  announce,
  error,
  number,
  onChange,
  question,
  ranking,
  total,
}: Props) {
  const byId = new Map(question.options.map((option) => [option.optionId, option]));
  const ranked = ranking.map((id) => byId.get(id)).filter((option) => option !== undefined);
  const remaining = unranked(question.options, ranking);
  const headingId = `question-${String(question.questionId)}`;

  // After a click the control that was clicked may be gone — a ranked option
  // leaves the list below — so focus is put somewhere sensible by hand.
  const controls = useRef(new Map<string, HTMLButtonElement>());
  const pendingFocus = useRef<PendingFocus>(null);
  const setPendingFocus = (next: PendingFocus) => {
    pendingFocus.current = next;
  };
  // After every render: the one that follows a change is the one that has
  // put (or taken) the target on the page.
  useEffect(() => {
    const pending = pendingFocus.current;
    if (pending === null) return;
    pendingFocus.current = null;
    const key =
      pending.kind === 'ranked'
        ? `${String(pending.optionId)}:${pending.control}`
        : `unranked:${String(pending.index)}`;
    const target = controls.current.get(key);
    if (target !== undefined && !target.disabled) target.focus();
    else if (pending.kind === 'ranked') {
      controls.current.get(`${String(pending.optionId)}:remove`)?.focus();
    }
  });

  const register = (key: string) => (element: HTMLButtonElement | null) => {
    if (element === null) controls.current.delete(key);
    else controls.current.set(key, element);
  };

  const rank = (option: Option, index: number) => {
    const next = addToRanking(ranking, option.optionId);
    onChange(next);
    announce(`${option.label} ranked ${ordinal(next.length)}.`);
    setPendingFocus(
      remaining.length > 1
        ? { index: Math.min(index, remaining.length - 2), kind: 'unranked' }
        : { control: 'remove', kind: 'ranked', optionId: option.optionId },
    );
  };

  const move = (option: Option, to: number) => {
    const next = moveInRanking(ranking, option.optionId, to);
    onChange(next);
    announce(`${option.label} moved to ${ordinal(next.indexOf(option.optionId) + 1)}.`);
  };

  const remove = (option: Option) => {
    onChange(removeFromRanking(ranking, option.optionId));
    announce(`${option.label} removed from your ranking.`);
    const position = ranking.indexOf(option.optionId);
    const neighbour = ranking[position + 1] ?? ranking[position - 1];
    setPendingFocus(
      neighbour === undefined
        ? { index: 0, kind: 'unranked' }
        : { control: 'remove', kind: 'ranked', optionId: neighbour },
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const label = (id: number | string) => byId.get(Number(id))?.label ?? 'Option';
  const place = (id: number | string | undefined) =>
    id === undefined ? '' : ordinal(ranking.indexOf(Number(id)) + 1);

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (over === null || active.id === over.id) return;
    const option = byId.get(Number(active.id));
    if (option !== undefined) move(option, ranking.indexOf(Number(over.id)));
  };

  return (
    <section
      aria-labelledby={headingId}
      className={[
        CARD,
        'flex flex-col gap-4 p-5',
        error === undefined ? '' : 'border-danger/50',
      ].join(' ')}
    >
      <header>
        <p className={'text-xs font-medium text-ink-muted'}>
          {`Question ${String(number)} of ${String(total)}`}
        </p>
        <h2
          aria-describedby={error === undefined ? undefined : `${headingId}-error`}
          className={'text-base font-semibold text-ink'}
          id={headingId}
          tabIndex={-1}
        >
          {question.content}
        </h2>
        {question.subheading !== null && (
          <p className={'mt-0.5 text-sm text-ink-muted'}>{question.subheading}</p>
        )}
        {error !== undefined && (
          <p className={'mt-2 text-sm font-medium text-danger'} id={`${headingId}-error`}>
            {error}
          </p>
        )}
      </header>

      <div className={'flex flex-col gap-2'}>
        <div className={'flex items-baseline justify-between gap-3'}>
          <h3 className={'text-xs font-semibold tracking-wide text-ink-muted uppercase'}>
            Your ranking
          </h3>
          {ranked.length > 0 && (
            <Button
              onClick={() => {
                onChange([]);
                announce('Ranking cleared.');
                setPendingFocus({ index: 0, kind: 'unranked' });
              }}
              size={'sm'}
              variant={'ghost'}
            >
              Clear
            </Button>
          )}
        </div>
        {ranked.length === 0 ? (
          <p
            className={
              'rounded-lg border border-dashed border-ink/20 px-4 py-5 text-center text-sm text-ink-muted'
            }
          >
            Nothing ranked yet. Choose options below, favourite first.
          </p>
        ) : (
          <DndContext
            accessibility={{
              announcements: {
                onDragCancel: ({ active }) =>
                  `Cancelled. ${label(active.id)} stays ${place(active.id)}.`,
                onDragEnd: ({ active, over }) =>
                  over === null
                    ? `${label(active.id)} dropped.`
                    : `${label(active.id)} dropped at ${place(over.id)}.`,
                onDragOver: ({ active, over }) =>
                  over === null ? undefined : `${label(active.id)} is over ${place(over.id)}.`,
                onDragStart: ({ active }) =>
                  `Picked up ${label(active.id)}, ranked ${place(active.id)}.`,
              },
              screenReaderInstructions: {
                draggable:
                  'Press space or enter to pick up. Use the up and down arrow keys to move, space or enter to drop, escape to cancel. Or use the move up and move down buttons.',
              },
            }}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={onDragEnd}
            sensors={sensors}
          >
            <SortableContext items={ranking} strategy={verticalListSortingStrategy}>
              <ol
                aria-label={`Your ranking for: ${question.content}`}
                className={'flex flex-col gap-2'}
              >
                {ranked.map((option, index) => (
                  <RankedOption
                    isFirst={index === 0}
                    isLast={index === ranked.length - 1}
                    key={option.optionId}
                    onMove={(direction) => {
                      move(option, index + direction);
                      setPendingFocus({
                        control: direction === -1 ? 'up' : 'down',
                        kind: 'ranked',
                        optionId: option.optionId,
                      });
                    }}
                    onRemove={() => {
                      remove(option);
                    }}
                    option={option}
                    rank={index + 1}
                    registerControl={(control, element) => {
                      register(`${String(option.optionId)}:${control}`)(element);
                    }}
                  />
                ))}
              </ol>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {remaining.length > 0 && (
        <div className={'flex flex-col gap-2'}>
          <h3 className={'text-xs font-semibold tracking-wide text-ink-muted uppercase'}>
            {ranked.length === 0 ? 'Options' : 'Not ranked'}
          </h3>
          <ul className={'grid gap-2 sm:grid-cols-2'}>
            {remaining.map((option, index) => (
              <li key={option.optionId}>
                <button
                  className={
                    'group flex w-full items-center gap-3 rounded-lg border border-ink/15 bg-surface px-3 py-2.5 text-left transition hover:border-accent hover:bg-accent/5'
                  }
                  onClick={() => {
                    rank(option, index);
                  }}
                  ref={register(`unranked:${String(index)}`)}
                  type={'button'}
                >
                  <span className={'min-w-0 flex-1'}>
                    <span className={'block truncate text-sm font-medium text-ink'}>
                      {option.label}
                    </span>
                    {option.sublabel !== null && (
                      <span className={'block truncate text-xs text-ink-muted'}>
                        {option.sublabel}
                      </span>
                    )}
                  </span>
                  <span
                    className={
                      'inline-flex shrink-0 items-center gap-1 rounded-md bg-ink/5 px-2 py-1 text-xs font-medium text-ink-muted transition group-hover:bg-accent group-hover:text-on-accent'
                    }
                  >
                    <Icon className={'h-3 w-3'} name={'plus'} />
                    {`Rank ${ordinal(ranked.length + 1)}`}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
