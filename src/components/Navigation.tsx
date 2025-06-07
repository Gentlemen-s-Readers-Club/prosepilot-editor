import React from 'react';
import { LogOut, User, CreditCard, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useDispatch, useSelector } from 'react-redux';
import { clearProfile } from '../store/slices/profileSlice';
import type { RootState, AppDispatch } from '../store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function Navigation() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const profile = useSelector((state: RootState) => state.profile.profile);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(clearProfile());
    navigate('/app/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/app')}>
              <img src="/logo.png" alt="ProsePilot Logo" className="h-12 w-12" />
              <span className="ml-2 text-xl font-bold text-primary">ProsePilot</span>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={() => navigate('/docs')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              <span>Documentation</span>
            </button>
            {profile && (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-3 hover:bg-gray-50 rounded-full p-1 -mr-1 transition-colors focus:border-primary focus:ring-1 focus:ring-primary" >
                  {profile.avatar_url ? (
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={profile.avatar_url}
                        alt={profile.full_name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-secondary">{profile.full_name}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="text-primary">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/app/profile')}>
                    <User className="mr-2 h-4 w-4 text-accent" />
                    <span className="text-secondary">Edit Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/app/subscription')}>
                    <CreditCard className="mr-2 h-4 w-4 text-accent" />
                    <span className="text-secondary">Manage Subscription</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4 text-accent" />
                    <span className="text-secondary">Log out</span>
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