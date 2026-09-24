import { Link, type LinkProps } from 'react-router';
import { buttonClass, type ButtonVariant } from 'src/styles';

interface Props extends LinkProps {
  size?: 'md' | 'sm';
  variant?: ButtonVariant;
}

/** Navigation that looks like a button. Still a link: it goes somewhere, it does not do something. */
export default function ButtonLink({
  className = '',
  size = 'md',
  variant = 'secondary',
  ...props
}: Props) {
  return <Link className={[buttonClass(variant, size), className].join(' ')} {...props} />;
}
