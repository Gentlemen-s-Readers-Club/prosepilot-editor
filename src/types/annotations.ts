export interface Annotation {
  id: string;
  chapter_id: string;
  user_id: string;
  content: string;
  start_offset: number;
  end_offset: number;
  selected_text: string;
  status: 'open' | 'resolved';
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  replies?: AnnotationReply[];
}

export interface AnnotationReply {
  id: string;
  annotation_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

export interface CreateAnnotationData {
  chapter_id: string;
  content: string;
  start_offset: number;
  end_offset: number;
  selected_text: string;
}

export interface CreateReplyData {
  annotation_id: string;
  content: string;
}

export interface AnnotationFilters {
  status?: 'all' | 'open' | 'resolved';
  user_id?: string;
  date_range?: {
    start: string;
    end: string;
  };
}

export interface AnnotationExportData {
  chapter_title: string;
  annotations: Array<{
    id: string;
    content: string;
    selected_text: string;
    status: string;
    created_at: string;
    user_name: string;
    replies: Array<{
      content: string;
      created_at: string;
      user_name: string;
    }>;
  }>;
  exported_at: string;
}