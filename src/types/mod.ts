export type SortMode = 'newest' | 'oldest' | 'downloads' | 'views' | 'likes' | 'score';
export type ViewMode = 'grid' | 'list';

export interface FilterState {
  category: string;
  rootCategory: string;
  onlyWithImages: boolean;
  onlyWithDescription: boolean;
  compact: boolean;
}

export interface ModSummary {
  id: number;
  name: string;
  url: string;
  addedAt: Date;
  addedTimestamp: number;
  submitterName: string;
  submitterUrl?: string;
  category: string;
  rootCategory: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  description: string;
  text: string;
  downloads: number;
  views: number;
  likes: number;
  fileCount: number;
  version?: string;
}
