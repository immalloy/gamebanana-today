import { HeaderBar } from 'web-toolkit';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
}

export function AppHeader({ title, subtitle = 'Daily GameBanana mods by game' }: AppHeaderProps): JSX.Element {
  return (
    <HeaderBar titlebar className="app-header">
      <HeaderBar.Title subtitle={subtitle}>{title}</HeaderBar.Title>
    </HeaderBar>
  );
}
