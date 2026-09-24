/**
 * Class strings shared by more than one component: buttons look the same
 * whether they are a <button> or a router <Link>, and cards the same wherever
 * they appear.
 */

export type ButtonVariant = 'danger' | 'ghost' | 'primary' | 'secondary';

const BUTTON_BASE =
  'inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition ' +
  'disabled:cursor-not-allowed aria-disabled:cursor-not-allowed';

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  // Disabled is a different fill, not a fainter one, so it never looks pressable.
  danger: 'text-danger hover:bg-danger/10 disabled:opacity-50',
  ghost: 'text-ink-muted hover:bg-ink/5 hover:text-ink disabled:opacity-50',
  primary:
    'bg-accent text-on-accent enabled:hover:opacity-90 disabled:bg-ink/10 disabled:text-ink-muted',
  secondary:
    'border border-ink/15 bg-surface text-ink hover:border-ink/30 hover:bg-surface-raised disabled:opacity-50',
};

export function buttonClass(variant: ButtonVariant = 'secondary', size: 'md' | 'sm' = 'md') {
  return [
    BUTTON_BASE,
    BUTTON_VARIANTS[variant],
    size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-4 py-2 text-sm',
  ].join(' ');
}

/** A square button holding only an icon. Always pair with an `aria-label`. */
export const ICON_BUTTON =
  'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-ink-muted transition ' +
  'hover:bg-ink/5 hover:text-ink disabled:pointer-events-none disabled:opacity-30';

export const CARD = 'rounded-xl border border-ink/10 bg-surface-raised/50';

/** A text input's look. No width: the caller says how wide (`w-full`, `w-16`). */
export const INPUT =
  'rounded-lg border border-ink/15 bg-surface px-3 py-2 text-sm text-ink ' +
  'placeholder:text-ink-muted/70 transition focus:border-accent focus:outline-none ' +
  'aria-invalid:border-danger';

export const LINK =
  'text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent';
