import { useState } from 'react';
import BallotGroupEditor from 'src/components/BallotGroupEditor';
import Button from 'src/components/Button';
import Icon from 'src/components/Icon';
import LoadFailed from 'src/components/LoadFailed';
import QuestionResults from 'src/components/QuestionResults';
import Skeleton from 'src/components/Skeleton';
import { plural } from 'src/format';
import useDocumentTitle from 'src/hooks/useDocumentTitle';
import useTally from 'src/hooks/useTally';
import {
  candidateName,
  DEFAULT_SCENARIO,
  MAX_CANDIDATES,
  MAX_GROUPS,
  MIN_CANDIDATES,
  nextId,
  removeCandidate,
  SCENARIOS,
  type Simulation,
  toTallyRequest,
} from 'src/scenarios';
import { CARD, ICON_BUTTON, INPUT } from 'src/styles';

/**
 * Try the counting rules on ballots you make up. Nothing is saved; every edit
 * is counted again, by the same code that counts real polls.
 */
export default function SimulatorPage() {
  useDocumentTitle('Simulator');
  const [scenarioKey, setScenarioKey] = useState(DEFAULT_SCENARIO.key);
  const [simulation, setSimulation] = useState<Simulation>(DEFAULT_SCENARIO);
  const [edited, setEdited] = useState(false);
  const scenario = SCENARIOS.find((s) => s.key === scenarioKey) ?? DEFAULT_SCENARIO;

  const update = (next: Simulation) => {
    setSimulation(next);
    setEdited(true);
  };
  const load = (key: string) => {
    const chosen = SCENARIOS.find((s) => s.key === key) ?? DEFAULT_SCENARIO;
    setScenarioKey(chosen.key);
    setSimulation(chosen);
    setEdited(false);
  };

  const { candidates, groups } = simulation;
  const prepared = toTallyRequest(simulation);
  const tally = useTally(prepared.request ?? null);
  const voters = groups.reduce(
    (total, group) => total + (group.ranking.length > 0 ? group.voters : 0),
    0,
  );

  return (
    <div className={'flex flex-col gap-6'}>
      <header>
        <h1 className={'text-2xl font-semibold tracking-tight text-ink sm:text-3xl'}>Simulator</h1>
        <p className={'mt-1 max-w-prose text-sm text-ink-muted'}>
          Make up an election and watch it counted. Start from a scenario, then change anything —
          the count updates as you edit.
        </p>
      </header>

      <section aria-labelledby={'scenario-title'} className={'flex flex-col gap-3'}>
        <h2 className={'text-sm font-semibold text-ink'} id={'scenario-title'}>
          Scenario
        </h2>
        <div aria-labelledby={'scenario-title'} className={'flex flex-wrap gap-2'} role={'group'}>
          {SCENARIOS.map((s) => (
            <button
              aria-pressed={s.key === scenarioKey && !edited}
              className={[
                'rounded-lg border px-3 py-1.5 text-sm transition',
                s.key === scenarioKey
                  ? 'border-accent bg-accent/10 font-medium text-ink'
                  : 'border-ink/15 text-ink-muted hover:border-ink/30 hover:text-ink',
              ].join(' ')}
              key={s.key}
              onClick={() => {
                load(s.key);
              }}
              type={'button'}
            >
              {s.name}
            </button>
          ))}
        </div>
        <p className={'max-w-prose text-sm text-ink'}>
          {edited ? (
            <>
              <span className={'text-ink-muted'}>{`Edited from “${scenario.name}”. `}</span>
              <button
                className={'text-accent underline underline-offset-2'}
                onClick={() => {
                  load(scenario.key);
                }}
                type={'button'}
              >
                Reset it
              </button>
            </>
          ) : (
            scenario.lesson
          )}
        </p>
      </section>

      <div className={'grid items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]'}>
        <div className={'flex flex-col gap-6'}>
          <section aria-labelledby={'candidates-title'} className={'flex flex-col gap-3'}>
            <h2 className={'text-sm font-semibold text-ink'} id={'candidates-title'}>
              {`Candidates (${String(candidates.length)})`}
            </h2>
            <ol className={'flex flex-col gap-2'}>
              {candidates.map((candidate, index) => (
                <li className={'flex items-center gap-2'} key={candidate.id}>
                  <label className={'sr-only'} htmlFor={`candidate-${String(candidate.id)}`}>
                    {`Candidate ${String(index + 1)} name`}
                  </label>
                  <input
                    className={[INPUT, 'w-full'].join(' ')}
                    id={`candidate-${String(candidate.id)}`}
                    maxLength={60}
                    onChange={(event) => {
                      update({
                        ...simulation,
                        candidates: candidates.map((c) =>
                          c.id === candidate.id ? { ...c, name: event.target.value } : c,
                        ),
                      });
                    }}
                    placeholder={`Candidate ${String(index + 1)}`}
                    value={candidate.name}
                  />
                  <button
                    aria-label={`Remove ${candidateName(candidate)}`}
                    className={ICON_BUTTON}
                    disabled={candidates.length <= MIN_CANDIDATES}
                    onClick={() => {
                      update(removeCandidate(simulation, candidate.id));
                    }}
                    type={'button'}
                  >
                    <Icon name={'x'} />
                  </button>
                </li>
              ))}
            </ol>
            {candidates.length < MAX_CANDIDATES && (
              <div>
                <Button
                  onClick={() => {
                    update({
                      ...simulation,
                      candidates: [...candidates, { id: nextId(candidates), name: '' }],
                    });
                  }}
                  size={'sm'}
                  variant={'ghost'}
                >
                  <Icon className={'h-3.5 w-3.5'} name={'plus'} />
                  Add candidate
                </Button>
              </div>
            )}
          </section>

          <section aria-labelledby={'ballots-title'} className={'flex flex-col gap-3'}>
            <div>
              <h2 className={'text-sm font-semibold text-ink'} id={'ballots-title'}>
                {`Ballots (${plural(voters, 'voter')})`}
              </h2>
              <p className={'text-xs text-ink-muted'}>
                Each group is some number of voters who all ranked the same way.
              </p>
            </div>
            <ul className={'flex flex-col gap-3'}>
              {groups.map((group, index) => (
                <BallotGroupEditor
                  candidates={candidates}
                  group={group}
                  key={group.id}
                  number={index + 1}
                  onChange={(changed) => {
                    update({
                      ...simulation,
                      groups: groups.map((g) => (g.id === changed.id ? changed : g)),
                    });
                  }}
                  onRemove={() => {
                    update({ ...simulation, groups: groups.filter((g) => g.id !== group.id) });
                  }}
                />
              ))}
            </ul>
            {groups.length < MAX_GROUPS && (
              <div>
                <Button
                  onClick={() => {
                    update({
                      ...simulation,
                      groups: [...groups, { id: nextId(groups), ranking: [], voters: 1 }],
                    });
                  }}
                  size={'sm'}
                  variant={'ghost'}
                >
                  <Icon className={'h-3.5 w-3.5'} name={'plus'} />
                  Add ballot group
                </Button>
              </div>
            )}
          </section>
        </div>

        <section
          aria-labelledby={'count-title'}
          className={[CARD, 'flex flex-col gap-4 p-5 lg:sticky lg:top-6'].join(' ')}
        >
          <div className={'flex items-center justify-between gap-3'}>
            <h2 className={'text-sm font-semibold text-ink'} id={'count-title'}>
              The count
            </h2>
            <span aria-hidden={'true'} className={'text-xs text-ink-muted'}>
              {tally.isFetching ? 'Counting…' : ''}
            </span>
          </div>
          {prepared.error === undefined ? (
            tally.isError && tally.data === undefined ? (
              <LoadFailed
                error={tally.error}
                onRetry={() => void tally.refetch()}
                what={'the count'}
              />
            ) : tally.data === undefined ? (
              <div aria-busy={'true'} className={'flex flex-col gap-3'}>
                <Skeleton className={'h-6 w-1/2'} />
                <Skeleton className={'h-4 w-full'} />
                <Skeleton className={'h-4 w-5/6'} />
                <Skeleton className={'h-4 w-2/3'} />
              </div>
            ) : (
              // Dimmed while a newer count is on its way: the one on screen may
              // name a candidate that has just been removed.
              <div className={tally.isPlaceholderData ? 'opacity-60 transition' : 'transition'}>
                <QuestionResults
                  options={candidates.map((candidate) => ({
                    label: candidateName(candidate),
                    optionId: candidate.id,
                    sublabel: null,
                  }))}
                  tally={tally.data}
                />
              </div>
            )
          ) : (
            <p className={'text-sm text-ink-muted'}>{prepared.error}</p>
          )}
        </section>
      </div>
    </div>
  );
}
