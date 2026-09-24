import ButtonLink from 'src/components/ButtonLink';
import useDocumentTitle from 'src/hooks/useDocumentTitle';
import { paths } from 'src/paths';

export default function NotFoundPage() {
  useDocumentTitle('Page not found');
  return (
    <div className={'flex flex-col items-start gap-3 py-10'}>
      <h1 className={'text-2xl font-semibold tracking-tight text-ink'}>Page not found</h1>
      <p className={'text-sm text-ink-muted'}>There is nothing at this address.</p>
      <ButtonLink to={paths.home}>Go home</ButtonLink>
    </div>
  );
}
