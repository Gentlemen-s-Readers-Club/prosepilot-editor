import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { 
  ArrowLeft,
  Users, 
  Settings, 
  UserPlus,
  Activity,
  Crown,
  Edit3,
  Eye,
  MoreVertical,
  Mail,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import {
  fetchUserTeams,
  fetchTeamMembers, 
  fetchTeamInvitations, 
  fetchTeamActivity,
  setCurrentTeam,
  updateTeamMember,
  removeTeamMember,
  cancelInvitation,
} from '../store/slices/teamsSlice';
import { useToast } from '../hooks/use-toast';
import { TeamMember, TeamInvitation, TeamRole } from '../store/types';
import { InviteMembersModal } from '../components/teams/InviteMembersModal';
import { TeamSettingsModal } from '../components/teams/TeamSettingsModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

const roleIcons = {
  admin: <Crown className="w-4 h-4 text-yellow-500" />,
  editor: <Edit3 className="w-4 h-4 text-blue-500" />,
  reader: <Eye className="w-4 h-4 text-gray-500" />
};

const roleLabels = {
  admin: 'Admin',
  editor: 'Editor', 
  reader: 'Reader'
};

const roleColors = {
  admin: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  editor: 'bg-blue-100 text-blue-800 border-blue-200',
  reader: 'bg-gray-100 text-gray-800 border-gray-200'
};

export function TeamDetails() {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const {
    status,
    teams,
    currentTeam, 
    members, 
    invitations, 
    activityLogs
  } = useSelector((state: RootState) => state.teams);

  const [activeTab, setActiveTab] = useState<'members' | 'activity'>('members');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null);
  const [invitationToCancel, setInvitationToCancel] = useState<TeamInvitation | null>(null);
  const [loading, setLoading] = useState(true);

  // Use currentTeam from state
  const userRole = currentTeam?.user_role;
  const isAdmin = userRole === 'admin';

  useEffect(() => {
    if (!teamId) return;

    const loadTeamData = async () => {
      try {
        setLoading(true);
        
        // Fetch team by ID and set as current team
        if (status === 'idle') {
          await dispatch(fetchUserTeams()).unwrap();
        }

        // Load team data
        await Promise.all([
          dispatch(fetchTeamMembers(teamId)).unwrap(),
          dispatch(fetchTeamInvitations(teamId)).unwrap(),
          dispatch(fetchTeamActivity({ teamId })).unwrap(),
        ]);
      } catch (err) {
        console.error('Error loading team data:', err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load team data",
        });
      } finally {
        setLoading(false);
      }
    };

    loadTeamData();
  }, [teamId, dispatch, toast, status]);

  useEffect(() => {
    if (teams.length > 0) {
      dispatch(setCurrentTeam(teams.find(team => team.id === teamId) || null));
    }
  }, [teams, dispatch, teamId]);

  const handleRemoveMember = async () => {
    if (!memberToRemove) return;

    try {
      await dispatch(removeTeamMember(memberToRemove.id)).unwrap();
      setMemberToRemove(null);
      toast({
        title: "Success",
        description: "Member removed successfully",
      });
    } catch (err) {
      console.error('Error removing member:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove member",
      });
    }
  };

  const handleCancelInvitation = async () => {
    if (!invitationToCancel) return;

    try {
      await dispatch(cancelInvitation(invitationToCancel.id)).unwrap();
      setInvitationToCancel(null);
      toast({
        title: "Success",
        description: "Invitation cancelled successfully",
      });
    } catch (err) {
      console.error('Error cancelling invitation:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to cancel invitation",
      });
    }
  };

  const handleRoleChange = async (memberId: string, newRole: TeamRole) => {
    try {
      await dispatch(updateTeamMember({ 
        memberId, 
        updates: { role: newRole } 
      })).unwrap();
      toast({
        title: "Success",
        description: "Member role updated successfully",
      });
    } catch (err) {
      console.error('Error updating member role:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update member role",
      });
    }
  };

  const formatActivityAction = (action: string) => {
    const actionMap: Record<string, string> = {
      'team_created': 'created the team',
      'member_joined': 'joined the team',
      'member_invited': 'was invited to the team',
      'member_removed': 'was removed from the team',
      'role_changed': 'had their role changed',
      'member_activated': 'was activated',
      'member_deactivated': 'was deactivated',
    };
    return actionMap[action] || action;
  };

  if (loading || status === 'loading') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentTeam) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Team not found</h1>
          <Button onClick={() => navigate('/app/teams')}>
            Back to Teams
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/app/teams')}
          className="flex items-center text-base-heading hover:text-brand-accent transition-colors mr-4"
        >
          <ArrowLeft className="mr-2" size={20} />
          <span className="font-medium">Back to Teams</span>
        </button>
      </div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          {currentTeam.logo_url ? (
            <img
              src={currentTeam.logo_url}
              alt={currentTeam.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-base-heading" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-base-heading">{currentTeam.name}</h1>
            {currentTeam.description && (
              <p className="text-gray-600">{currentTeam.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <>
              <Button
                variant="secondary"
                onClick={() => setShowInviteModal(true)}
                className="flex items-center gap-2"
              >
                <UserPlus size={16} />
                Invite Members
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowSettingsModal(true)}
                className="flex items-center gap-2"
              >
                <Settings size={16} />
                Settings
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'members' as const, label: 'Members', icon: Users },
              { id: 'activity' as const, label: 'Activity', icon: Activity },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === id
                    ? 'border-base-border text-base-heading'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Members Tab */}
          {activeTab === 'members' && (
            <div className="space-y-6">
              {/* Active Members */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Team Members ({members.filter(m => m.status === 'active').length})
                </h3>
                <div className="space-y-3">
                  {members.filter(m => m.status === 'active').map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {member.user?.avatar_url ? (
                          <img
                            src={member.user.avatar_url}
                            alt={member.user.full_name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <Users className="w-5 h-5 text-gray-500" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{member.user?.full_name}</p>
                          <p className="text-sm text-gray-500">{member.user?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleColors[member.role]}`}>
                          {roleIcons[member.role]}
                          {roleLabels[member.role]}
                        </span>
                        <span className="text-sm text-gray-500">
                          Joined {new Date(member.joined_at).toLocaleDateString()}
                        </span>
                        {isAdmin && member.user?.id !== currentTeam.created_by && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'admin')}>
                                <Crown className="w-4 h-4 mr-2" />
                                Make Admin
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'editor')}>
                                <Edit3 className="w-4 h-4 mr-2" />
                                Make Editor
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'reader')}>
                                <Eye className="w-4 h-4 mr-2" />
                                Make Reader
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => setMemberToRemove(member)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove Member
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Invitations */}
              {invitations.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Pending Invitations ({invitations.length})
                  </h3>
                  <div className="space-y-3">
                    {invitations.map((invitation) => (
                      <div
                        key={invitation.id}
                        className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                            <Mail className="w-5 h-5 text-yellow-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{invitation.email}</p>
                            <p className="text-sm text-gray-500">
                              Invited by {invitation.invited_by_user?.full_name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleColors[invitation.role]}`}>
                            {roleIcons[invitation.role]}
                            {roleLabels[invitation.role]}
                          </span>
                          <span className="text-sm text-gray-500">
                            Expires {new Date(invitation.expires_at).toLocaleDateString()}
                          </span>
                          {isAdmin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setInvitationToCancel(invitation)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {activityLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                      <Activity className="w-4 h-4 text-base-heading" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{log.user?.full_name}</span>{' '}
                        {formatActivityAction(log.action)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(log.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                {activityLogs.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No recent activity
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <InviteMembersModal
        open={showInviteModal}
        onOpenChange={setShowInviteModal}
        teamId={teamId!}
      />

      <TeamSettingsModal
        open={showSettingsModal}
        onOpenChange={setShowSettingsModal}
        team={currentTeam}
      />

      {/* Remove Member Dialog */}
      <Dialog open={!!memberToRemove} onOpenChange={() => setMemberToRemove(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Team Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {memberToRemove?.user?.full_name} from the team? 
              They will lose access to all team books and resources.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  This action cannot be undone
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  The member will need to be re-invited to regain access to the team.
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setMemberToRemove(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemoveMember}
            >
              Remove Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Invitation Dialog */}
      <Dialog open={!!invitationToCancel} onOpenChange={() => setInvitationToCancel(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Invitation</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel the invitation for {invitationToCancel?.email}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setInvitationToCancel(null)}
            >
              Keep Invitation
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelInvitation}
            >
              Cancel Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}