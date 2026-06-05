import { HeaderBar } from 'web-toolkit';

export function AppHeader(): JSX.Element {
  return (
    <HeaderBar titlebar className="app-header">
      <HeaderBar.Title subtitle="GameBanana mods by game">
        Funkin Today
      </HeaderBar.Title>
    </HeaderBar>
  );
}
