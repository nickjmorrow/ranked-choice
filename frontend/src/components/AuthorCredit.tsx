interface Props {
  className?: string;
}

const LINKS = [
  { href: 'https://nickjmorrow.com', label: 'Portfolio' },
  { href: 'https://github.com/nickjmorrow', label: 'GitHub' },
  { href: 'https://github.com/nickjmorrow/ranked-choice', label: 'Source' },
];

/**
 * Who built this, and where the code is. In the footer of every page, and on
 * the home page where a visitor arrives. The links open a new tab so the demo
 * is still there when you come back to it.
 */
export default function AuthorCredit({ className = '' }: Props) {
  return (
    <p className={['text-xs leading-5 text-ink-muted', className].join(' ')}>
      Built by Nicholas Morrow
      {LINKS.map((link) => (
        <span key={link.href}>
          <span aria-hidden={'true'}> · </span>
          <a
            className={'underline decoration-ink/20 underline-offset-2 transition hover:text-ink'}
            href={link.href}
            rel={'noreferrer'}
            target={'_blank'}
          >
            {link.label}
            <span className={'sr-only'}> (opens in a new tab)</span>
          </a>
        </span>
      ))}
    </p>
  );
}
