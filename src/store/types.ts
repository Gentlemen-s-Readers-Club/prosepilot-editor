export type Status = 'draft' | 'writing' | 'reviewing' | 'published' | 'archived' | 'error';

export interface Book {
  id: string;
  title: string;
  cover_url: string | null;
  status: Status;
  languages: Language;
  categories: Category[];
  author_name: string;
  synopsis?: string;
  created_at: string;
  updated_at: string;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  type: 'chapter' | 'page';
}

export interface Category {
  id: string;
  name: string;
}

export interface BookCategory {
  categories: Category;
}

export interface Language {
  id: string;
  name: string;
  code: string;
}

export interface Tone {
  id: string;
  name: string;
  description?: string;
}

export interface Narrator {
  id: string;
  name: string;
  description?: string;
  voiceType?: string;
}

export interface LiteratureStyle {
  id: string;
  name: string;
  description?: string;
}

export interface ApiState {
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
}