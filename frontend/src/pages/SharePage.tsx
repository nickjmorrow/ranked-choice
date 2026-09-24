import { useParams } from 'react-router';
import { ApiError } from 'src/api/client';
import ButtonLink from 'src/components/ButtonLink';
import CopyLinkField from 'src/components/CopyLinkField';
import LoadFailed from 'src/components/LoadFailed';
import PollNotFound from 'src/components/PollNotFound';
import PollSkeleton from 'src/components/PollSkeleton';
import useDocumentTitle from 'src/hooks/useDocumentTitle';
import usePoll from 'src/hooks/usePoll';
import useRetentionNote from 'src/hooks/useRetentionNote';
import { absoluteUrl, paths } from 'src/paths';

/** Where a new poll lands: the two links to hand out, and where to go next. */
export default function SharePage() {
  const { link = '' } = useParams();
  const poll = usePoll(link);
  useDocumentTitle(poll.data === undefined ? 'Share' : `Share: ${poll.data.title}`);
  const retention = useRetentionNote();

  if (poll.isPending) return <PollSkeleton />;
  if (poll.isError) {
    if (poll.error instanceof ApiError && poll.error.status === 404) return <PollNotFound />;
    return <LoadFailed error={poll.error} onRetry={() => void poll.refetch()} what={'this poll'} />;
  }

  const origin = window.location.origin;
  return (
    <div className={'flex max-w-xl flex-col gap-6'}>
      <header>
        <p className={'text-xs font-medium tracking-wide text-ink-muted uppercase'}>Share</p>
        <h1 className={'text-2xl font-semibold tracking-tight text-ink sm:text-3xl'}>
          {poll.data.title}
        </h1>
        <p className={'mt-1 text-sm text-ink-muted'}>
          Your poll is live. Anyone with the voting link can vote; there is no sign-in.
        </p>
        {retention !== null && <p className={'mt-1 text-sm text-ink-muted'}>{retention}</p>}
      </header>
      <CopyLinkField
        hint={'Send this to voters.'}
        id={'vote-link'}
        label={'Voting link'}
        url={absoluteUrl(paths.poll(link), origin)}
      />
      <CopyLinkField
        hint={'Anyone can watch the count here, round by round.'}
        id={'results-link'}
        label={'Results link'}
        url={absoluteUrl(paths.results(link), origin)}
      />
      <div className={'flex flex-wrap gap-2'}>
        <ButtonLink to={paths.poll(link)} variant={'primary'}>
          Vote now
        </ButtonLink>
        <ButtonLink to={paths.results(link)}>View results</ButtonLink>
      </div>
    </div>
  );
}
