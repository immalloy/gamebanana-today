export type GameSortMode = 'Game_MostSubmissions' | 'Game_Name' | 'Game_Latest';
export type GameNameOperator = 'contains' | 'equals' | 'starts';
export type RangeMode = 'daily' | 'weekly' | 'monthly';

export interface GameSummary {
  id: number;
  name: string;
  url: string;
  imageUrl?: string;
  submissionCount?: number;
}

export interface GameFilterState {
  name: string;
  nameOperator: GameNameOperator;
  sort: GameSortMode;
}
