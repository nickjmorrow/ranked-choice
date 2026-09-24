import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Option } from 'src/api/types';
import Icon from 'src/components/Icon';
import { ordinal } from 'src/format';
import { ICON_BUTTON } from 'src/styles';

export type RankedControl = 'down' | 'remove' | 'up';

interface Props {
  isFirst: boolean;
  isLast: boolean;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
  option: Option;
  rank: number;
  /** Registers a control so the list can put focus back on it after a move. */
  registerControl: (control: RankedControl, element: HTMLButtonElement | null) => void;
}

/**
 * One ranked option: its rank, a drag handle, and buttons that do what
 * dragging does, for anyone who cannot or would rather not drag.
 */
export default function RankedOption({
  isFirst,
  isLast,
  onMove,
  onRemove,
  option,
  rank,
  registerControl,
}: Props) {
  const {
    attributes,
    isDragging,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: option.optionId });

  return (
    <li
      className={[
        'flex items-center gap-2 rounded-lg border bg-surface py-2 pr-2 pl-1',
        isDragging ? 'relative z-10 border-accent shadow-lg' : 'border-ink/15',
      ].join(' ')}
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
    >
      <button
        aria-label={`Drag to reorder ${option.label}`}
        className={[ICON_BUTTON, 'cursor-grab touch-none active:cursor-grabbing'].join(' ')}
        ref={setActivatorNodeRef}
        type={'button'}
        {...attributes}
        {...listeners}
      >
        <Icon name={'grip'} />
      </button>
      <span
        aria-hidden={'true'}
        className={
          'flex h-7 w-9 shrink-0 items-center justify-center rounded-md bg-accent text-xs font-semibold text-on-accent tabular-nums'
        }
      >
        {ordinal(rank)}
      </span>
      <div className={'min-w-0 flex-1'}>
        <p className={'truncate text-sm font-medium text-ink'}>
          <span className={'sr-only'}>{`${ordinal(rank)} choice: `}</span>
          {option.label}
        </p>
        {option.sublabel !== null && (
          <p className={'truncate text-xs text-ink-muted'}>{option.sublabel}</p>
        )}
      </div>
      <div className={'flex items-center'}>
        <button
          aria-label={`Move ${option.label} up`}
          className={ICON_BUTTON}
          disabled={isFirst}
          onClick={() => {
            onMove(-1);
          }}
          ref={(element) => {
            registerControl('up', element);
          }}
          type={'button'}
        >
          <Icon name={'arrow-up'} />
        </button>
        <button
          aria-label={`Move ${option.label} down`}
          className={ICON_BUTTON}
          disabled={isLast}
          onClick={() => {
            onMove(1);
          }}
          ref={(element) => {
            registerControl('down', element);
          }}
          type={'button'}
        >
          <Icon name={'arrow-down'} />
        </button>
        <button
          aria-label={`Remove ${option.label} from your ranking`}
          className={ICON_BUTTON}
          onClick={onRemove}
          ref={(element) => {
            registerControl('remove', element);
          }}
          type={'button'}
        >
          <Icon name={'x'} />
        </button>
      </div>
    </li>
  );
}
