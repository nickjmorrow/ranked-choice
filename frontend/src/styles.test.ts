import { describe, expect, it } from 'vitest';
import { buttonClass } from 'src/styles';

describe('buttonClass', () => {
  it('defaults to a medium secondary button', () => {
    expect(buttonClass()).toContain('border-ink/15');
    expect(buttonClass()).toContain('px-4');
  });

  it('gives the primary button the accent fill', () => {
    expect(buttonClass('primary', 'sm')).toContain('bg-accent');
    expect(buttonClass('primary', 'sm')).toContain('text-xs');
  });
});
