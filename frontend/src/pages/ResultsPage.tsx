import { useLocation, useParams } from 'react-router';
import { ApiError } from 'src/api/client';
import ButtonLink from 'src/components/ButtonLink';
import LoadFailed from 'src/components/LoadFailed';
import PollNotFound from 'src/components/PollNotFound';
import PollSkeleton from 'src/components/PollSkeleton';
import QuestionResults from 'src/components/QuestionResults';
import { plural } from 'src/format';
import useDocumentTitle from 'src/hooks/useDocumentTitle';
import usePollResults from 'src/hooks/usePollResults';
import useVotedPolls from 'src/hooks/useVotedPolls';
import { paths } from 'src/paths';
import { CARD } from 'src/styles';

/** A poll's results: every question's count, round by round. */
export default function ResultsPage() {
  const { link = '' } = useParams();
  const location = useLocation();
  const isJustVoted = (location.state as { voted?: boolean } | null)?.voted === true;
  const results = usePollResults(link);
  const { hasVoted } = useVotedPolls();
  useDocumentTitle(results.data === undefined ? 'Results' : `Results: ${results.data.poll.title}`);

  if (results.isPending) return <PollSkeleton />;
  if (results.isError) {
    if (results.error instanceof ApiError && results.error.status === 404) return <PollNotFound />;
    return (
      <LoadFailed
        error={results.error}
        onRetry={() => void results.refetch()}
        what={'the results'}
      />
    );
  }

  const { ballots, poll, questions } = results.data;
  const isVoted = isJustVoted || hasVoted(link);

  return (
    <div className={'flex flex-col gap-6'}>
      {isJustVoted && (
        <p className={'rounded-lg bg-success/10 px-4 py-3 text-sm text-ink'} role={'status'}>
          <span className={'font-medium'}>Your ballot was counted.</span> The results below include
          it.
        </p>
      )}

      <header className={'flex flex-col gap-3'}>
        <div>
          <p className={'text-xs font-medium tracking-wide text-ink-muted uppercase'}>Results</p>
          <h1 className={'text-2xl font-semibold tracking-tight text-ink sm:text-3xl'}>
            {poll.title}
          </h1>
        </div>
        {poll.description !== null && (
          <p className={'max-w-prose text-sm whitespace-pre-line text-ink-muted'}>
            {poll.description}
          </p>
        )}
        <div className={'flex flex-wrap items-center gap-x-4 gap-y-2'}>
          <p className={'text-sm text-ink'}>
            <span className={'font-semibold'}>{plural(ballots, 'ballot')}</span>
            <span className={'text-ink-muted'}> cast · updates as votes arrive</span>
          </p>
          <div className={'flex gap-2'}>
            <ButtonLink
              size={'sm'}
              to={paths.poll(link)}
              variant={isVoted ? 'secondary' : 'primary'}
            >
              {isVoted ? 'Vote again' : 'Vote'}
            </ButtonLink>
            <ButtonLink size={'sm'} to={paths.share(link)} variant={'ghost'}>
              Share
            </ButtonLink>
          </div>
        </div>
      </header>

      {poll.questions.map((question, index) => {
        const tally = questions.find((result) => result.questionId === question.questionId)?.tally;
        if (tally === undefined) return null;
        return (
          <section
            aria-labelledby={`result-${String(question.questionId)}`}
            className={[CARD, 'flex flex-col gap-5 p-5 sm:p-6'].join(' ')}
            key={question.questionId}
          >
            <header>
              <p className={'text-xs font-medium text-ink-muted'}>
                {`Question ${String(index + 1)} of ${String(poll.questions.length)}`}
              </p>
              <h2
                className={'text-base font-semibold text-ink'}
                id={`result-${String(question.questionId)}`}
              >
                {question.content}
              </h2>
            </header>
            <QuestionResults
              emptyAction={
                <ButtonLink size={'sm'} to={paths.poll(link)} variant={'primary'}>
                  Cast the first ballot
                </ButtonLink>
              }
              options={question.options}
              tally={tally}
            />
          </section>
        );
      })}
    </div>
  );
}
