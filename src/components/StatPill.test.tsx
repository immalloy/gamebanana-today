import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatPill } from './StatPill';

describe('StatPill', () => {
  it('exposes the metric label and value to assistive tech', () => {
    render(<StatPill type="downloads" value={1234} label="Downloads" />);

    expect(screen.getByLabelText('1,234 downloads')).not.toBeNull();
  });
});
