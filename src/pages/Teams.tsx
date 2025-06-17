import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { 
  Users, 
  Plus, 
  Settings, 
  Crown, 
  Edit3, 
  Eye,
  Calendar,
  Activity,
  BookOpen,
  UserPlus,
  MoreVertical,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchUserTeams, createTeam } from '../store/slices/teamsSlice';
import { useToast } from '../hooks/use-toast';
import { CreateTeamModal } from '../components/teams/CreateTeamModal';
import { Team, TeamRole } from '../store/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Helmet } from 'react-helmet';

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

export function Teams() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  
  const { teams, status } = useSelector((state: RootState) => state.teams);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        if (status === 'idle') {
          await dispatch(fetchUserTeams()).unwrap();
        }
      } catch (err) {
        console.error('Error loading teams:', err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load teams",
        });
      } finally {
        setLoading(false);
      }
    };

    loadTeams();
  }, [dispatch, status, toast]);

  const handleTeamClick = (team: Team) => {
    navigate(`/workspace/teams/${team.id}`);
  };

  const handleCreateTeam = async (teamData: { name: string; description?: string; logo_url?: string }) => {
    try {
      const newTeam = await dispatch(createTeam(teamData)).unwrap();
      setShowCreateModal(false);
      toast({
        title: "Success",
        description: "Team created successfully",
      });
      // Navigate to the new team
      navigate(`/workspace/teams/${newTeam.id}`);
    } catch (err) {
      console.error('Error creating team:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create team",
      });
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-lg shadow-lg p-6">
                <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>ProsePilot - Teams</title>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-base-heading">My Teams</h1>
            <p className="text-gray-600 mt-2">Collaborate with others on your writing projects</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2"
          >
            <Plus size={20} />
            Create Team
          </Button>
        </div>

        {/* Teams Grid */}
        {teams.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-base-background rounded-full p-4 mb-4">
                <Users className="w-12 h-12 text-base-heading" />
              </div>
              <h3 className="text-lg font-medium text-base-heading mb-2">No teams yet</h3>
              <p className="text-base-paragraph max-w-md mb-6">
              Create your first team to start collaborating with others.
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                Create Your First Team
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div
                key={team.id}
                className="bg-white rounded-lg shadow-lg transition-shadow group"
              >
                <div className="p-6">
                  {/* Team Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {team.logo_url ? (
                        <img
                          src={team.logo_url}
                          alt={team.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-base-background flex items-center justify-center">
                          <Users className="w-6 h-6 text-base-heading" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-base-heading  transition-colors">
                          {team.name}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-base-paragraph">
                          {roleIcons[team.user_role as TeamRole]}
                          <span>{roleLabels[team.user_role as TeamRole]}</span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="w-4 h-4 text-brand-accent" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleTeamClick(team);
                        }}>
                          <Settings className="w-4 h-4 mr-2 text-brand-accent" />
                          Manage Team
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleTeamClick(team);
                        }}>
                          <UserPlus className="w-4 h-4 mr-2 text-brand-accent" />
                          Invite
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Team Description */}
                  {team.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {team.description}
                    </p>
                  )}

                  {/* Team Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-brand-accent" />
                        <span className="text-base-paragraph">{team.member_count || 0} members</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-brand-accent" />
                        <span className="text-base-paragraph">{new Date(team.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="w-4 h-4 text-brand-accent" />
                      <span className="text-base-paragraph">Active</span>
                    </div>
                  </div>
                </div>

                {/* Team Actions Footer */}
                <div className="border-t bg-gray-50 px-6 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen className="w-4 h-4" />
                      <span>View Books</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Team Modal */}
        <CreateTeamModal
          open={showCreateModal}
          onOpenChange={setShowCreateModal}
          onCreateTeam={handleCreateTeam}
        />
      </div>
    </>
  );
}