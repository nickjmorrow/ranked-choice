import { Link } from 'react-router';
import AuthorCredit from 'src/components/AuthorCredit';
import ButtonLink from 'src/components/ButtonLink';
import Icon from 'src/components/Icon';
import useDocumentTitle from 'src/hooks/useDocumentTitle';
import { paths } from 'src/paths';
import { CARD } from 'src/styles';

const STEPS = [
  {
    body: 'Voters rank as many options as they like, favourite first.',
    title: 'Rank',
  },
  {
    body: 'Every ballot counts for its highest-ranked option still in the race. More than half of the votes wins.',
    title: 'Count',
  },
  {
    body: 'No majority? The option with the fewest votes is eliminated, and its ballots move to their next choice. Repeat.',
    title: 'Transfer',
  },
];

const PLACES = [
  {
    body: 'Rank the example poll’s options, then see where your ballot went in each round.',
    cta: 'Vote on the example',
    to: paths.poll('example'),
  },
  {
    body: 'Make up the ballots and watch the count change as you edit. Four scenarios to start from.',
    cta: 'Open the simulator',
    to: paths.simulator,
  },
  {
    body: 'Write your questions and options, and share one link. No sign-in, for you or your voters.',
    cta: 'Create a poll',
    to: paths.newPoll,
  },
];

/** What ranked choice is, in three steps, and the three ways to try it. */
export default function HomePage() {
  useDocumentTitle(null);

  return (
    <div className={'flex flex-col gap-12'}>
      <section className={'flex flex-col gap-5 pt-4 sm:pt-10'}>
        <h1 className={'max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-5xl'}>
          Polls you answer by ranking.
        </h1>
        <p className={'max-w-xl text-base text-ink-muted sm:text-lg'}>
          Vote for your favourite without wasting your vote. If it cannot win, your ballot moves to
          your next choice — and you can watch it happen, round by round.
        </p>
        <div className={'flex flex-wrap gap-3'}>
          <ButtonLink to={paths.results('example')} variant={'primary'}>
            See a count, round by round
            <Icon name={'arrow-right'} />
          </ButtonLink>
          <ButtonLink to={paths.newPoll}>Create a poll</ButtonLink>
        </div>
        <AuthorCredit />
      </section>

      <section aria-labelledby={'how-title'} className={'flex flex-col gap-4'}>
        <h2
          className={'text-sm font-semibold tracking-wide text-ink-muted uppercase'}
          id={'how-title'}
        >
          How the count works
        </h2>
        <ol className={'grid gap-4 sm:grid-cols-3'}>
          {STEPS.map((step, index) => (
            <li className={[CARD, 'flex flex-col gap-2 p-5'].join(' ')} key={step.title}>
              <span
                aria-hidden={'true'}
                className={
                  'flex h-7 w-7 items-center justify-center rounded-md bg-accent text-sm font-semibold text-on-accent'
                }
              >
                {index + 1}
              </span>
              <h3 className={'text-base font-semibold text-ink'}>{step.title}</h3>
              <p className={'text-sm text-ink-muted'}>{step.body}</p>
            </li>
          ))}
        </ol>
        <p className={'text-sm text-ink-muted'}>
          This is instant-runoff voting, the counting method behind ranked-choice elections in
          Australia, Ireland, Maine and New York City.
        </p>
      </section>

      <section aria-labelledby={'try-title'} className={'flex flex-col gap-4'}>
        <h2
          className={'text-sm font-semibold tracking-wide text-ink-muted uppercase'}
          id={'try-title'}
        >
          Try it
        </h2>
        <ul className={'grid gap-4 sm:grid-cols-3'}>
          {PLACES.map((place) => (
            <li key={place.to}>
              <Link
                className={[
                  CARD,
                  'group flex h-full flex-col gap-3 p-5 transition hover:border-accent/60 hover:bg-accent/5',
                ].join(' ')}
                to={place.to}
              >
                <span
                  className={'inline-flex items-center gap-1.5 text-base font-semibold text-ink'}
                >
                  {place.cta}
                  <Icon
                    className={'h-4 w-4 text-accent transition group-hover:translate-x-0.5'}
                    name={'arrow-right'}
                  />
                </span>
                <span className={'text-sm text-ink-muted'}>{place.body}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
