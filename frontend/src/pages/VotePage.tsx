import { useParams } from 'react-router';
import { ApiError } from 'src/api/client';
import Ballot from 'src/components/Ballot';
import LoadFailed from 'src/components/LoadFailed';
import PollNotFound from 'src/components/PollNotFound';
import PollSkeleton from 'src/components/PollSkeleton';
import useDocumentTitle from 'src/hooks/useDocumentTitle';
import usePoll from 'src/hooks/usePoll';

/** The ballot for one poll, once the poll has loaded. */
export default function VotePage() {
  const { link = '' } = useParams();
  const poll = usePoll(link);
  useDocumentTitle(poll.data === undefined ? 'Vote' : `Vote: ${poll.data.title}`);

  if (poll.isPending) return <PollSkeleton />;
  if (poll.isError) {
    if (poll.error instanceof ApiError && poll.error.status === 404) return <PollNotFound />;
    return <LoadFailed error={poll.error} onRetry={() => void poll.refetch()} what={'this poll'} />;
  }
  return <Ballot poll={poll.data} />;
}
