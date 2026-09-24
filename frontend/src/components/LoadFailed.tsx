import Button from 'src/components/Button';

interface Props {
  error: Error;
  onRetry: () => void;
  /** What could not be loaded: "this poll". */
  what: string;
}

/** A failed read, said plainly, with a way to try again. */
export default function LoadFailed({ error, onRetry, what }: Props) {
  return (
    <div
      className={'flex flex-col items-start gap-3 rounded-xl border border-danger/30 p-5'}
      role={'alert'}
    >
      <p className={'text-sm font-medium text-ink'}>{`Could not load ${what}.`}</p>
      <p className={'text-sm text-ink-muted'}>{error.message}</p>
      <Button onClick={onRetry} size={'sm'}>
        Try again
      </Button>
    </div>
  );
}
