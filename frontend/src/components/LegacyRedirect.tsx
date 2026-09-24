import { Navigate, useParams } from 'react-router';

interface Props {
  to: (link: string) => string;
}

/**
 * The 2020 version's poll addresses, which may still be linked from somewhere.
 * A component rather than a plain `<Navigate>`: the poll link has to be read
 * from the old URL.
 */
export default function LegacyRedirect({ to }: Props) {
  const { link = '' } = useParams();
  return <Navigate replace to={to(link)} />;
}
