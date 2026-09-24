import type { ReactNode } from 'react';
import useTheme, { type ThemePreference } from 'src/hooks/useTheme';

/** Light, system, dark: `system` is in the middle because it is the default. */
const OPTIONS: { icon: ReactNode; label: string; value: ThemePreference }[] = [
  {
    icon: (
      <>
        <circle cx={12} cy={12} r={4} />
        <path
          d={
            'M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41'
          }
        />
      </>
    ),
    label: 'Light',
    value: 'light',
  },
  {
    icon: (
      <>
        <rect height={13} rx={2} width={20} x={2} y={4} />
        <path d={'M8 21h8M12 17v4'} />
      </>
    ),
    label: 'System',
    value: 'system',
  },
  {
    icon: <path d={'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'} />,
    label: 'Dark',
    value: 'dark',
  },
];

/**
 * Three toggle buttons, so the current preference is always visible. `aria-pressed`
 * rather than a radio group, which would need arrow-key handling.
 */
export default function ThemeToggle() {
  const { choose, preference } = useTheme();

  return (
    <div
      aria-label={'Theme'}
      className={'flex items-center gap-0.5 rounded-lg border border-ink/10 p-0.5'}
      role={'group'}
    >
      {OPTIONS.map((option) => {
        const isActive = option.value === preference;
        return (
          <button
            aria-label={option.label}
            aria-pressed={isActive}
            className={[
              'rounded-md p-1.5 transition',
              isActive ? 'bg-surface-raised text-ink' : 'text-ink-muted hover:text-ink',
            ].join(' ')}
            key={option.value}
            onClick={() => {
              choose(option.value);
            }}
            title={option.label}
            type={'button'}
          >
            <svg
              aria-hidden={'true'}
              className={'h-3.5 w-3.5'}
              fill={'none'}
              stroke={'currentColor'}
              strokeLinecap={'round'}
              strokeLinejoin={'round'}
              strokeWidth={2}
              viewBox={'0 0 24 24'}
            >
              {option.icon}
            </svg>
          </button>
        );
      })}
    </div>
  );
}
