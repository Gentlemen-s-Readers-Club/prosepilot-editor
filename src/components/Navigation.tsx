import React, { useEffect, useState } from 'react';
import { LogOut, User, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
}

export function Navigation() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const { session } = useAuth();

  useEffect(() => {
    async function getProfile() {
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (data) {
          setProfile(data);
        }
      }
    }

    getProfile();
  }, [session]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/app/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/app')}>
              <img src="/logo.png" alt="Wraiter Logo" className="h-12 w-12" />
              <span className="ml-2 text-xl font-bold text-[#31606D]">Wraiter</span>
            </div>
          </div>
          <div className="flex items-center">
            {profile && (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-3 hover:bg-gray-50 rounded-full p-1 -mr-1 transition-colors">
                  {profile.avatar_url ? (
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      <img
                        src={profile.avatar_url}
                        alt={profile.full_name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-[#31606D]/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-[#31606D]" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">{profile.full_name}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/app/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Edit Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/app/subscription')}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Manage Subscription</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}