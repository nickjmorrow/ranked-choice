import Skeleton from 'src/components/Skeleton';
import { CARD } from 'src/styles';

/** A poll-shaped placeholder while one loads, announced once. */
export default function PollSkeleton() {
  return (
    <div aria-busy={'true'} aria-live={'polite'} className={'flex flex-col gap-6'}>
      <span className={'sr-only'}>Loading the poll…</span>
      <div className={'flex flex-col gap-2'}>
        <Skeleton className={'h-8 w-2/3'} />
        <Skeleton className={'h-4 w-full max-w-lg'} />
      </div>
      {[0, 1].map((index) => (
        <div className={[CARD, 'flex flex-col gap-3 p-5'].join(' ')} key={index}>
          <Skeleton className={'h-3 w-24'} />
          <Skeleton className={'h-5 w-1/2'} />
          <Skeleton className={'h-10 w-full'} />
          <Skeleton className={'h-10 w-full'} />
          <Skeleton className={'h-10 w-4/5'} />
        </div>
      ))}
    </div>
  );
}
