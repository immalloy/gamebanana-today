import { HeaderBar } from 'web-toolkit';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
}

export function AppHeader({ title, subtitle = 'Daily GameBanana mods by game' }: AppHeaderProps): JSX.Element {
  return (
    <HeaderBar titlebar className="app-header">
      <div className="brand-title">
        <img src={`${import.meta.env.BASE_URL}brand/gamebanana-daily-icon.png`} alt="" aria-hidden="true" />
        <HeaderBar.Title subtitle={subtitle}>{title}</HeaderBar.Title>
      </div>
    </HeaderBar>
  );
}
