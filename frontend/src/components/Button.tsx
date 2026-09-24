import type { ButtonHTMLAttributes } from 'react';
import { buttonClass, type ButtonVariant } from 'src/styles';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'md' | 'sm';
  variant?: ButtonVariant;
}

/** A button. `type` defaults to "button": a form's submit button says so explicitly. */
export default function Button({
  className = '',
  size = 'md',
  type = 'button',
  variant = 'secondary',
  ...props
}: Props) {
  return (
    <button
      className={[buttonClass(variant, size), className].join(' ')}

      type={type}
      {...props}
    />
  );
}
