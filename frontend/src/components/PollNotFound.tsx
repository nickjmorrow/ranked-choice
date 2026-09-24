import ButtonLink from 'src/components/ButtonLink';
import { paths } from 'src/paths';

/** What a mistyped or expired poll link shows, instead of a bare error. */
export default function PollNotFound() {
  return (
    <div className={'flex flex-col items-start gap-3 py-10'}>
      <h1 className={'text-2xl font-semibold tracking-tight text-ink'}>No poll at this link</h1>
      <p className={'max-w-prose text-sm text-ink-muted'}>
        Check the link for typos. Poll links are ten letters and numbers, like{' '}
        <code className={'rounded bg-ink/5 px-1 font-mono'}>k7m2qhx9ta</code>.
      </p>
      <div className={'flex flex-wrap gap-2'}>
        <ButtonLink to={paths.newPoll} variant={'primary'}>
          Create a poll
        </ButtonLink>
        <ButtonLink to={paths.results('example')}>See the example poll</ButtonLink>
      </div>
    </div>
  );
}
