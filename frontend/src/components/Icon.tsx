import type { ReactNode } from 'react';

export type IconName =
  'arrow-down' | 'arrow-right' | 'arrow-up' | 'check' | 'copy' | 'grip' | 'play' | 'plus' | 'x';

const PATHS: Record<IconName, ReactNode> = {
  'arrow-down': <path d={'M12 5v14M19 12l-7 7-7-7'} />,
  'arrow-right': <path d={'M5 12h14M12 5l7 7-7 7'} />,
  'arrow-up': <path d={'M12 19V5M5 12l7-7 7 7'} />,
  check: <path d={'M20 6 9 17l-5-5'} />,
  copy: (
    <>
      <rect height={13} rx={2} width={13} x={9} y={9} />
      <path d={'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'} />
    </>
  ),
  grip: (
    <>
      <circle cx={9} cy={6} r={1} />
      <circle cx={15} cy={6} r={1} />
      <circle cx={9} cy={12} r={1} />
      <circle cx={15} cy={12} r={1} />
      <circle cx={9} cy={18} r={1} />
      <circle cx={15} cy={18} r={1} />
    </>
  ),
  play: <path d={'M6 4l14 8-14 8z'} />,
  plus: <path d={'M12 5v14M5 12h14'} />,
  x: <path d={'M18 6 6 18M6 6l12 12'} />,
};

interface Props {
  className?: string;
  name: IconName;
}

/** A stroke icon from one small set. Decorative: the control around it carries the label. */
export default function Icon({ className = 'h-4 w-4', name }: Props) {
  return (
    <svg
      aria-hidden={'true'}
      className={className}
      fill={'none'}
      stroke={'currentColor'}
      strokeLinecap={'round'}
      strokeLinejoin={'round'}
      strokeWidth={2}
      viewBox={'0 0 24 24'}
    >
      {PATHS[name]}
    </svg>
  );
}
