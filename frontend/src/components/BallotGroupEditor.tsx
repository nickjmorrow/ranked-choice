import Icon from 'src/components/Icon';
import { ordinal, plural } from 'src/format';
import { removeFromRanking } from 'src/ranking';
import {
  type BallotGroup,
  type Candidate,
  candidateName,
  MAX_VOTERS_PER_GROUP,
} from 'src/scenarios';
import { CARD, ICON_BUTTON, INPUT } from 'src/styles';

interface Props {
  candidates: readonly Candidate[];
  group: BallotGroup;
  number: number;
  onChange: (group: BallotGroup) => void;
  onRemove: () => void;
}

/** "N voters ranked A, then B": a group of identical ballots in the simulator. */
export default function BallotGroupEditor({
  candidates,
  group,
  number,
  onChange,
  onRemove,
}: Props) {
  const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));
  const available = candidates.filter((candidate) => !group.ranking.includes(candidate.id));
  const id = `group-${String(group.id)}`;
  const setVoters = (voters: number) => {
    onChange({ ...group, voters: Math.max(0, Math.min(MAX_VOTERS_PER_GROUP, voters)) });
  };

  return (
    <li aria-labelledby={`${id}-title`} className={[CARD, 'flex flex-col gap-3 p-4'].join(' ')}>
      <div className={'flex items-center justify-between gap-2'}>
        <h3
          className={'text-xs font-semibold tracking-wide text-ink-muted uppercase'}
          id={`${id}-title`}
        >
          {`Group ${String(number)} · ${plural(group.voters, 'voter')}`}
        </h3>
        <button
          aria-label={`Remove group ${String(number)}`}
          className={ICON_BUTTON}
          onClick={onRemove}
          type={'button'}
        >
          <Icon name={'x'} />
        </button>
      </div>

      <div className={'flex items-center gap-2'}>
        <label className={'text-sm text-ink'} htmlFor={`${id}-voters`}>
          Voters
        </label>
        <button
          aria-label={'One fewer voter'}
          className={[ICON_BUTTON, 'border border-ink/15'].join(' ')}
          disabled={group.voters <= 0}
          onClick={() => {
            setVoters(group.voters - 1);
          }}
          type={'button'}
        >
          −
        </button>
        <input
          className={[INPUT, 'w-16 text-center tabular-nums'].join(' ')}
          id={`${id}-voters`}
          inputMode={'numeric'}
          max={MAX_VOTERS_PER_GROUP}
          min={0}
          onChange={(event) => {
            const value = Math.trunc(Number(event.target.value));
            setVoters(Number.isNaN(value) ? 0 : value);
          }}
          type={'number'}
          value={group.voters}
        />
        <button
          aria-label={'One more voter'}
          className={[ICON_BUTTON, 'border border-ink/15'].join(' ')}
          disabled={group.voters >= MAX_VOTERS_PER_GROUP}
          onClick={() => {
            setVoters(group.voters + 1);
          }}
          type={'button'}
        >
          +
        </button>
      </div>

      <div className={'flex flex-col gap-2'}>
        <p className={'text-sm text-ink'} id={`${id}-ranking`}>
          {group.ranking.length === 0
            ? 'Ranked nothing yet — this group is not counted.'
            : 'Ranked:'}
        </p>
        {group.ranking.length > 0 && (
          <ol aria-labelledby={`${id}-ranking`} className={'flex flex-wrap gap-1.5'}>
            {group.ranking.map((candidateId, index) => {
              const name = candidateName(byId.get(candidateId));
              return (
                <li
                  className={
                    'inline-flex items-center gap-1 rounded-md bg-accent/10 py-0.5 pr-0.5 pl-2 text-sm text-ink'
                  }
                  key={candidateId}
                >
                  <span className={'text-xs font-semibold text-accent'}>{ordinal(index + 1)}</span>
                  {name}
                  <button
                    aria-label={`Remove ${name} from group ${String(number)}`}
                    className={
                      'rounded p-1 text-ink-muted transition hover:bg-ink/10 hover:text-ink'
                    }
                    onClick={() => {
                      onChange({
                        ...group,
                        ranking: removeFromRanking(group.ranking, candidateId),
                      });
                    }}
                    type={'button'}
                  >
                    <Icon className={'h-3 w-3'} name={'x'} />
                  </button>
                </li>
              );
            })}
          </ol>
        )}
        {available.length > 0 && (
          <div>
            <label className={'sr-only'} htmlFor={`${id}-add`}>
              {`Add a ${ordinal(group.ranking.length + 1)} choice to group ${String(number)}`}
            </label>
            <select
              className={[INPUT, 'max-w-full py-1.5'].join(' ')}
              id={`${id}-add`}
              onChange={(event) => {
                const candidateId = Number(event.target.value);
                if (candidateId > 0)
                  onChange({ ...group, ranking: [...group.ranking, candidateId] });
              }}
              value={''}
            >
              <option value={''}>{`+ Add ${ordinal(group.ranking.length + 1)} choice…`}</option>
              {available.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidateName(candidate)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </li>
  );
}
