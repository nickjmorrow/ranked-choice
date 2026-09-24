interface Props {
  /** Size and shape: a height and width, matching what will replace it. */
  className?: string;
}

/**
 * A placeholder shaped like its content, so the page does not jump when data
 * arrives. Hidden from screen readers; `Loading` announces the region.
 */
export default function Skeleton({ className = '' }: Props) {
  return (
    <span
      aria-hidden={'true'}
      className={['block rounded bg-ink/10 motion-safe:animate-pulse', className].join(' ')}
    />
  );
}
