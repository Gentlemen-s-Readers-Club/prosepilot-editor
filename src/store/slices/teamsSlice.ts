import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';
import { 
  ApiState, 
  Team, 
  TeamMember, 
  TeamInvitation, 
  TeamActivityLog,
  CreateTeamData,
  InviteMembersData,
  UpdateMemberData,
  TeamRole
} from '../types';

interface TeamsState extends ApiState {
  teams: Team[];
  currentTeam: Team | null;
  members: TeamMember[];
  invitations: TeamInvitation[];
  activityLogs: TeamActivityLog[];
}

const initialState: TeamsState = {
  teams: [],
  currentTeam: null,
  members: [],
  invitations: [],
  activityLogs: [],
  status: 'idle',
  error: null,
};

// Fetch user's teams
export const fetchUserTeams = createAsyncThunk(
  'teams/fetchUserTeams',
  async () => {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        team_members!inner(role, status),
        _team_member_count:team_members(count)
      `)
      .eq('team_members.user_id', (await supabase.auth.getUser()).data.user?.id)
      .eq('team_members.status', 'active')
      .eq('is_active', true)
      .order('updated_at', { ascending: false });

    if (error) throw new Error(error.message);

    return data.map(team => ({
      ...team,
      member_count: team._team_member_count?.[0]?.count || 0,
      user_role: team.team_members[0]?.role
    }));
  }
);

// Create new team
export const createTeam = createAsyncThunk(
  'teams/createTeam',
  async (teamData: CreateTeamData) => {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Add the created_by field to the team data
    const teamDataWithCreator = {
      ...teamData,
      created_by: user.id
    };

    const { data, error } = await supabase
      .from('teams')
      .insert(teamDataWithCreator)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
);

// Update team
export const updateTeam = createAsyncThunk(
  'teams/updateTeam',
  async ({ teamId, updates }: { teamId: string; updates: Partial<CreateTeamData> }) => {
    const { data, error } = await supabase
      .from('teams')
      .update(updates)
      .eq('id', teamId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
);

// Delete team
export const deleteTeam = createAsyncThunk(
  'teams/deleteTeam',
  async (teamId: string) => {
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', teamId);

    if (error) throw new Error(error.message);
    return teamId;
  }
);

// Fetch team members
export const fetchTeamMembers = createAsyncThunk(
  'teams/fetchTeamMembers',
  async (teamId: string) => {
    const { data, error } = await supabase
      .from('team_members')
      .select(`
        *,
        user:profiles!team_members_user_id_fkey(id, full_name, avatar_url),
        invited_by_user:profiles!team_members_invited_by_fkey(id, full_name)
      `)
      .eq('team_id', teamId)
      .order('joined_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }
);

// Invite members
export const inviteMembers = createAsyncThunk(
  'teams/inviteMembers',
  async ({ teamId, inviteData }: { teamId: string; inviteData: InviteMembersData }) => {
    const invitations = inviteData.emails.map(email => ({
      team_id: teamId,
      email,
      role: inviteData.role,
      message: inviteData.message
    }));

    const { data, error } = await supabase
      .from('team_invitations')
      .insert(invitations)
      .select();

    if (error) throw new Error(error.message);
    return data;
  }
);

// Update member role/status
export const updateTeamMember = createAsyncThunk(
  'teams/updateTeamMember',
  async ({ memberId, updates }: { memberId: string; updates: UpdateMemberData }) => {
    const { data, error } = await supabase
      .from('team_members')
      .update(updates)
      .eq('id', memberId)
      .select(`
        *,
        user:profiles!team_members_user_id_fkey(id, full_name, avatar_url),
        invited_by_user:profiles!team_members_invited_by_fkey(id, full_name)
      `)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
);

// Remove team member
export const removeTeamMember = createAsyncThunk(
  'teams/removeTeamMember',
  async (memberId: string) => {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', memberId);

    if (error) throw new Error(error.message);
    return memberId;
  }
);

// Fetch team invitations
export const fetchTeamInvitations = createAsyncThunk(
  'teams/fetchTeamInvitations',
  async (teamId: string) => {
    const { data, error } = await supabase
      .from('team_invitations')
      .select(`
        *,
        invited_by_user:profiles!team_invitations_invited_by_fkey(id, full_name)
      `)
      .eq('team_id', teamId)
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }
);

// Cancel invitation
export const cancelInvitation = createAsyncThunk(
  'teams/cancelInvitation',
  async (invitationId: string) => {
    const { error } = await supabase
      .from('team_invitations')
      .delete()
      .eq('id', invitationId);

    if (error) throw new Error(error.message);
    return invitationId;
  }
);

// Accept invitation
export const acceptInvitation = createAsyncThunk(
  'teams/acceptInvitation',
  async (token: string) => {
    const { data, error } = await supabase.rpc('accept_team_invitation', {
      invitation_token: token
    });

    if (error) throw new Error(error.message);
    if (!data.success) throw new Error(data.error);
    
    return data;
  }
);

// Fetch team activity logs
export const fetchTeamActivity = createAsyncThunk(
  'teams/fetchTeamActivity',
  async ({ teamId, limit = 50 }: { teamId: string; limit?: number }) => {
    const { data, error } = await supabase
      .from('team_activity_logs')
      .select(`
        *,
        user:profiles!team_activity_logs_user_id_fkey(id, full_name, avatar_url)
      `)
      .eq('team_id', teamId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);
    return data;
  }
);

// Get user's pending invitations
export const fetchUserInvitations = createAsyncThunk(
  'teams/fetchUserInvitations',
  async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) throw new Error('No user email found');

    const { data, error } = await supabase
      .from('team_invitations')
      .select(`
        *,
        team:team_id(id, name, description, logo_url),
        invited_by_user:profiles!team_invitations_invited_by_fkey(id, full_name)
      `)
      .eq('email', user.email)
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }
);

const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    setCurrentTeam: (state, action: PayloadAction<Team | null>) => {
      state.currentTeam = action.payload;
    },
    clearTeamData: (state) => {
      state.currentTeam = null;
      state.members = [];
      state.invitations = [];
      state.activityLogs = [];
    },
    updateMemberRole: (state, action: PayloadAction<{ memberId: string; role: TeamRole }>) => {
      const member = state.members.find(m => m.id === action.payload.memberId);
      if (member) {
        member.role = action.payload.role;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user teams
      .addCase(fetchUserTeams.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserTeams.fulfilled, (state, action) => {
        state.status = 'success';
        state.teams = action.payload;
      })
      .addCase(fetchUserTeams.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message || 'Failed to fetch teams';
      })
      
      // Create team
      .addCase(createTeam.fulfilled, (state, action) => {
        state.teams.unshift(action.payload);
      })
      
      // Update team
      .addCase(updateTeam.fulfilled, (state, action) => {
        const index = state.teams.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.teams[index] = { ...state.teams[index], ...action.payload };
        }
        if (state.currentTeam?.id === action.payload.id) {
          state.currentTeam = { ...state.currentTeam, ...action.payload };
        }
      })
      
      // Delete team
      .addCase(deleteTeam.fulfilled, (state, action) => {
        state.teams = state.teams.filter(t => t.id !== action.payload);
        if (state.currentTeam?.id === action.payload) {
          state.currentTeam = null;
        }
      })
      
      // Fetch team members
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.members = action.payload;
      })
      
      // Update team member
      .addCase(updateTeamMember.fulfilled, (state, action) => {
        const index = state.members.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.members[index] = action.payload;
        }
      })
      
      // Remove team member
      .addCase(removeTeamMember.fulfilled, (state, action) => {
        state.members = state.members.filter(m => m.id !== action.payload);
      })
      
      // Fetch team invitations
      .addCase(fetchTeamInvitations.fulfilled, (state, action) => {
        state.invitations = action.payload;
      })
      
      // Cancel invitation
      .addCase(cancelInvitation.fulfilled, (state, action) => {
        state.invitations = state.invitations.filter(i => i.id !== action.payload);
      })
      
      // Fetch team activity
      .addCase(fetchTeamActivity.fulfilled, (state, action) => {
        state.activityLogs = action.payload;
      });
  },
});

export const { setCurrentTeam, clearTeamData, updateMemberRole } = teamsSlice.actions;
export default teamsSlice.reducer;