export type SortMode = 'newest' | 'oldest' | 'downloads' | 'views' | 'likes';

export interface FilterState {
  category: string;
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
  downloads: number;
  views: number;
  likes: number;
  fileCount: number;
  version?: string;
}
