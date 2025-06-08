import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { 
  Users, 
  Plus, 
  Search, 
  Settings, 
  Crown, 
  Edit3, 
  Eye,
  Calendar,
  Activity,
  BookOpen,
  UserPlus,
  MoreVertical,
  Loader2
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchUserTeams, createTeam, setCurrentTeam } from '../store/slices/teamsSlice';
import { useToast } from '../hooks/use-toast';
import { CreateTeamModal } from '../components/teams/CreateTeamModal';
import { Team, TeamRole } from '../store/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

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
  
  const { teams, status, error } = useSelector((state: RootState) => state.teams);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        await dispatch(fetchUserTeams()).unwrap();
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
  }, [dispatch, toast]);

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTeamClick = (team: Team) => {
    dispatch(setCurrentTeam(team));
    navigate(`/app/teams/${team.id}`);
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
      dispatch(setCurrentTeam(newTeam));
      navigate(`/app/teams/${newTeam.id}`);
    } catch (err) {
      console.error('Error creating team:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create team",
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-background pt-16 min-h-screen">
        <Navigation />
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
      </div>
    );
  }

  return (
    <div className="bg-background pt-16 min-h-screen">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">My Teams</h1>
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

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        </div>

        {/* Teams Grid */}
        {filteredTeams.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {teams.length === 0 ? 'No teams yet' : 'No teams found'}
            </h3>
            <p className="text-gray-500 mb-6">
              {teams.length === 0 
                ? 'Create your first team to start collaborating with others.'
                : 'Try adjusting your search criteria.'
              }
            </p>
            {teams.length === 0 && (
              <Button onClick={() => setShowCreateModal(true)}>
                Create Your First Team
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team) => (
              <div
                key={team.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
                onClick={() => handleTeamClick(team)}
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
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                          {team.name}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
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
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleTeamClick(team);
                        }}>
                          <Settings className="w-4 h-4 mr-2" />
                          Manage Team
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
                        <Users className="w-4 h-4" />
                        <span>{team.member_count || 0} members</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(team.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="w-4 h-4" />
                      <span>Active</span>
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
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <UserPlus className="w-4 h-4" />
                      <span>Invite</span>
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
    </div>
  );
}