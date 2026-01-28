export enum ResourceType {
  Paper = 'paper',
  Book = 'book'
}

export interface Author {
  id?: string;
  name: string;
}

export interface Paper {
  id: string;
  type: ResourceType.Paper;
  title: string;
  authors: Author[];
  year: number;
  abstract?: string;
  citationCount: number;
  isOpenAccess: boolean;
  journal?: string;
  topics: string[];
  pdfUrl?: string;
  doi?: string;
}

export interface Book {
  id: string;
  type: ResourceType.Book;
  title: string;
  authors: Author[];
  year: number;
  publisher?: string;
  editionCount: number;
  coverId?: number;
  subjects: string[];
  rating?: number;
}

export type UnifiedResult = Paper | Book;

export interface SearchState {
  query: string;
  results: UnifiedResult[];
  isLoading: boolean;
  error: string | null;
  filters: {
    types: ResourceType[];
    minYear: number | null;
    openAccessOnly: boolean;
  };
  hasSearched: boolean;
}

export interface TopicNode {
  id: string;
  group: number;
  val: number; // size
}

export interface TopicLink {
  source: string;
  target: string;
}

export interface TopicData {
  nodes: TopicNode[];
  links: TopicLink[];
}
