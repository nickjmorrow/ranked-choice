import { type SubmitEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import type { Poll } from 'src/api/types';
import Button from 'src/components/Button';
import RankingQuestion from 'src/components/RankingQuestion';
import useCastBallot from 'src/hooks/useCastBallot';
import useVotedPolls from 'src/hooks/useVotedPolls';
import { paths } from 'src/paths';
import { LINK } from 'src/styles';

interface Props {
  poll: Poll;
}

/**
 * A poll's ballot: every question, a ranking for each, and the submit button.
 * Checks required questions before sending, and sends the voter to the
 * results once their ballot is counted.
 */
export default function Ballot({ poll }: Props) {
  const navigate = useNavigate();
  const castBallot = useCastBallot(poll.link);
  const { hasVoted, markVoted } = useVotedPolls();
  const [rankings, setRankings] = useState<Record<number, number[]>>({});
  const [showErrors, setShowErrors] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const errors = new Map<number, string>();
  for (const question of poll.questions) {
    if (question.isRequired && (rankings[question.questionId] ?? []).length === 0) {
      errors.set(question.questionId, 'Rank at least one option.');
    }
  }

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (errors.size > 0) {
      setShowErrors(true);
      const first = poll.questions.find((question) => errors.has(question.questionId));
      if (first !== undefined) {
        document.getElementById(`question-${String(first.questionId)}`)?.focus();
      }
      return;
    }
    castBallot.mutate(
      {
        rankings: poll.questions.map((question) => ({
          optionIds: rankings[question.questionId] ?? [],
          questionId: question.questionId,
        })),
      },
      {
        onSuccess: () => {
          markVoted(poll.link);
          void navigate(paths.results(poll.link), { state: { voted: true } });
        },
      },
    );
  };

  return (
    <form className={'flex flex-col gap-6'} noValidate onSubmit={submit}>
      <header className={'flex flex-col gap-2'}>
        <h1 className={'text-2xl font-semibold tracking-tight text-ink sm:text-3xl'}>
          {poll.title}
        </h1>
        {poll.description !== null && (
          <p className={'max-w-prose text-sm whitespace-pre-line text-ink-muted'}>
            {poll.description}
          </p>
        )}
        <p className={'text-sm text-ink-muted'}>
          Rank the options you like, favourite first. You do not have to rank them all.{' '}
          <Link className={LINK} to={paths.results(poll.link)}>
            See results so far
          </Link>
        </p>
        {hasVoted(poll.link) && (
          <p className={'rounded-lg bg-accent/10 px-3 py-2 text-sm text-ink'} role={'status'}>
            You have already voted on this poll from this browser. Another ballot will count as
            another voter.
          </p>
        )}
      </header>

      {poll.questions.map((question, index) => (
        <RankingQuestion
          announce={setAnnouncement}
          error={showErrors ? errors.get(question.questionId) : undefined}
          key={question.questionId}
          number={index + 1}
          onChange={(ranking) => {
            setRankings((current) => ({ ...current, [question.questionId]: ranking }));
          }}
          question={question}
          ranking={rankings[question.questionId] ?? []}
          total={poll.questions.length}
        />
      ))}

      <div aria-live={'polite'} className={'sr-only'}>
        {announcement}
      </div>

      <div className={'flex flex-col gap-3'}>
        {showErrors && errors.size > 0 && (
          <p className={'text-sm text-danger'} role={'alert'}>
            {errors.size === 1
              ? 'One question still needs a ranking.'
              : `${String(errors.size)} questions still need a ranking.`}
          </p>
        )}
        {castBallot.isError && (
          <p className={'text-sm text-danger'} role={'alert'}>
            {`Your ballot was not counted: ${castBallot.error.message}`}
          </p>
        )}
        <div className={'flex flex-wrap items-center gap-3'}>
          <Button disabled={castBallot.isPending} type={'submit'} variant={'primary'}>
            {castBallot.isPending ? 'Casting ballot…' : 'Cast ballot'}
          </Button>
          <p className={'text-xs text-ink-muted'}>Ballots are anonymous and cannot be changed.</p>
        </div>
      </div>
    </form>
  );
}
