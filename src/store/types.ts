export type Status = 'draft' | 'writing' | 'reviewing' | 'published' | 'archived' | 'error';

export interface Book {
  id: string;
  title: string;
  cover_url: string | null;
  status: Status;
  languages: Language;
  categories: Category[];
  team_id?: string | null;
  team?: Team | null;
  author_name: string;
  synopsis?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
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

// Team Management Types
export type TeamRole = 'admin' | 'editor' | 'reader';
export type MemberStatus = 'active' | 'pending' | 'inactive';
export type InvitationStatus = 'pending' | 'accepted' | 'expired';

export interface Team {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  max_members: number;
  is_active: boolean;
  member_count?: number;
  user_role?: TeamRole;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: TeamRole;
  joined_at: string;
  invited_by?: string;
  status: MemberStatus;
  user?: {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
  };
  invited_by_user?: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface TeamInvitation {
  id: string;
  team_id: string;
  email: string;
  role: TeamRole;
  invited_by: string;
  message?: string;
  token: string;
  expires_at: string;
  accepted_at?: string;
  created_at: string;
  team?: {
    id: string;
    name: string;
    description?: string;
    logo_url?: string;
  };
  invited_by_user?: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface TeamActivityLog {
  id: string;
  team_id: string;
  user_id: string;
  action: string;
  details: Record<string, any>;
  created_at: string;
  user?: {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
  };
}

export interface CreateTeamData {
  name: string;
  description?: string;
  logo_url?: string;
}

export interface InviteMembersData {
  emails: string[];
  role: TeamRole;
  message?: string;
}

export interface UpdateMemberData {
  role?: TeamRole;
  status?: MemberStatus;
}