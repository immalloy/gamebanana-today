import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Box, Button, Dropdown, HeaderBar, Input, Spinner, Switch } from './webToolkit';

describe('local web toolkit components', () => {
  it('renders header titles with the expected structure', () => {
    render(
      <HeaderBar titlebar>
        <HeaderBar.Title subtitle="Daily mods">GameBanana Daily</HeaderBar.Title>
      </HeaderBar>,
    );

    expect(screen.getByText('GameBanana Daily').className).toContain('title');
    expect(screen.getByText('Daily mods').className).toContain('subtitle');
  });

  it('uses web-toolkit-compatible box layout classes', () => {
    render(
      <Box horizontal align fill className="custom-box">
        Content
      </Box>,
    );

    expect(screen.getByText('Content').className).toContain('Box');
    expect(screen.getByText('Content').className).toContain('horizontal');
    expect(screen.getByText('Content').className).toContain('align');
    expect(screen.getByText('Content').className).toContain('fill');
    expect(screen.getByText('Content').className).toContain('custom-box');
  });

  it('supports regular button and input events', () => {
    const onClick = vi.fn();
    const onChange = vi.fn();

    render(
      <>
        <Button onClick={onClick}>Apply</Button>
        <Input aria-label="Search" onChange={onChange} />
      </>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'funkin' } });

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('maps dropdown and switch changes to value callbacks', () => {
    const onSelect = vi.fn();
    const onToggle = vi.fn();

    render(
      <>
        <Dropdown
          aria-label="Sort"
          options={[
            { value: 'newest', label: 'Newest' },
            { value: 'likes', label: 'Likes' },
          ]}
          value="newest"
          onChange={onSelect}
        />
        <Switch label="No duplicate highlights" value={false} onChange={onToggle} />
      </>,
    );

    fireEvent.change(screen.getByLabelText('Sort'), { target: { value: 'likes' } });
    fireEvent.click(screen.getByLabelText('No duplicate highlights'));

    expect(onSelect).toHaveBeenCalledWith('likes');
    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it('exposes spinner status semantics', () => {
    render(<Spinner />);

    expect(screen.getByRole('status', { name: 'Loading' })).not.toBeNull();
  });
});
