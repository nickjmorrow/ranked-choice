import { Link, NavLink } from 'react-router';
import ThemeToggle from 'src/components/ThemeToggle';
import { paths } from 'src/paths';

const NAV = [
  { label: 'Simulator', to: paths.simulator },
  { label: 'Example poll', to: paths.results('example') },
  { label: 'New poll', to: paths.newPoll },
];

/** The brand, three destinations and the theme. Wraps onto two lines on a phone. */
export default function AppHeader() {
  return (
    <header className={'border-b border-ink/10'}>
      <div
        className={
          'mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6 sm:py-4'
        }
      >
        <Link
          className={'flex items-center gap-2 text-sm font-semibold tracking-tight text-ink'}
          to={paths.home}
        >
          <span
            aria-hidden={'true'}
            className={
              'flex h-6 w-6 items-center justify-center rounded-md bg-accent text-xs font-bold text-on-accent'
            }
          >
            1
          </span>
          Ranked Choice
        </Link>
        {/* On a phone: brand and theme on the first line, the links on their own
            full-width line below. From `sm` up: one line, links before theme. */}
        <nav aria-label={'Main'} className={'order-last w-full sm:order-none sm:ml-auto sm:w-auto'}>
          <ul className={'-mx-2.5 flex items-center gap-1 sm:mx-0'}>
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  className={({ isActive }) =>
                    [
                      'rounded-md px-2.5 py-1.5 text-sm whitespace-nowrap transition',
                      isActive ? 'bg-ink/5 font-medium text-ink' : 'text-ink-muted hover:text-ink',
                    ].join(' ')
                  }
                  to={item.to}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
