export type Language = 'TypeScript' | 'JavaScript' | 'Python' | 'CSS' | 'HTML';

export type Rating = 'Good' | 'Needs Improvement' | 'Has Issues';

export interface InlineComment {
  line: number;
  comment: string;
}

export interface Review {
  id: string;
  snippetId?: string; // If it was reviewed from a snippet
  code: string;
  language: Language;
  rating: Rating;
  inlineComments: InlineComment[];
  suggestions: string[];
  securityNotes?: string[];
  createdAt: string;
}

export interface Snippet {
  id: string;
  title: string;
  code: string;
  language: Language;
  createdAt: string;
}

export interface AppState {
  reviews: Review[];
  snippets: Snippet[];
  theme: 'dark' | 'light';
}
