import React from 'react';
import { LogOut, User, CreditCard, BookOpen, Users, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
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
import { Button } from './ui/button';
import { useAuth } from '../hooks/useAuth';

export function Navigation() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const {profile} = useSelector((state: RootState) => state.profile);
  const {session, loading} = useAuth();

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
            <div className="flex items-center gap-1 cursor-pointer" onClick={() => session ? navigate('/app') : navigate('/')}>
              <img src="/logo.png" alt="ProsePilot Logo" className="h-10 w-10" />
              <span className="ml-2 text-xl font-bold text-base-heading">ProsePilot</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/support')}
              className="flex items-center space-x-2 text-base-paragraph hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <MessageCircle className="h-4 w-4 text-brand-accent" />
              <span>Support</span>
            </button>

            {!loading && !session && (
              <button
                onClick={() => navigate('/pricing')}
                className="flex items-center space-x-2 text-base-paragraph hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <CreditCard className="h-4 w-4 text-brand-accent" />
                <span>Pricing</span>
              </button>
            )}

            <button
              onClick={() => navigate('/docs')}
              className="flex items-center space-x-2 text-base-paragraph hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <BookOpen className="h-4 w-4 text-brand-accent" />
              <span>Documentation</span>
            </button>
            
            {!loading && !session ? (
              <>
              <button
                onClick={() => navigate('/app/login')}
                className="flex items-center space-x-2 text-base-paragraph hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <User className="h-4 w-4 text-brand-accent" />
                <span>Login</span>
              </button>
                <Link to="/app/signup">
                  <Button className="bg-brand-primary hover:bg-brand-primary/90">Get Started</Button>
                </Link>
              </>
            ) : !loading && session && (
              <button
                onClick={() => navigate('/app/teams')}
                className="flex items-center space-x-2 text-base-paragraph hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <Users className="h-4 w-4 text-brand-accent" />
                <span>Teams</span>
              </button>
            )}

            {profile && (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-3 hover:bg-gray-50 rounded-full p-1 -mr-1 transition-colors focus:border-base-border focus:ring-1 focus:ring-brand-primary" >
                  {profile.avatar_url ? (
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={profile.avatar_url}
                        alt={profile.full_name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-brand-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-base-heading" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-base-paragraph">{profile.full_name}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="text-base-heading">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/app/profile')}>
                    <User className="mr-2 h-4 w-4 text-brand-accent" />
                    <span className="text-base-paragraph">Edit Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/app/subscription')}>
                    <CreditCard className="mr-2 h-4 w-4 text-brand-accent" />
                    <span className="text-base-paragraph">Manage Subscription</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4 text-brand-accent" />
                    <span className="text-base-paragraph">Log out</span>
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