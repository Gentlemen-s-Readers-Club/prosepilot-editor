import React, { useState } from 'react';
import { LogOut, User, CreditCard, BookOpen, Users, MessageCircle, Menu, X, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useDispatch, useSelector } from 'react-redux';
import { clearProfile } from '../store/slices/profileSlice';
import { hasStudioPlan } from '../store/slices/subscriptionSlice';
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
  const hasStudio = useSelector(hasStudioPlan);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(clearProfile());
    navigate('/workspace/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex items-center gap-1 cursor-pointer" onClick={() => { navigate('/'); closeMobileMenu(); }}>
              <img src="/logo.png" alt="ProsePilot Logo" className="h-10 w-10" />
              <span className="ml-2 text-xl font-bold text-base-heading hidden sm:block">ProsePilot</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">

            {!loading && !session ? (
              <button
                onClick={() => navigate('/pricing')}
                className="flex items-center space-x-2 text-base-paragraph hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <CreditCard className="h-4 w-4 text-brand-accent" />
                <span>Pricing</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/app')}
                className="flex items-center space-x-2 text-base-paragraph hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <LayoutDashboard className="h-4 w-4 text-brand-accent" />
                <span>Dashboard</span>
              </button>
            )}

            <button
              onClick={() => navigate('/docs')}
              className="flex items-center space-x-2 text-base-paragraph hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <BookOpen className="h-4 w-4 text-brand-accent" />
              <span>Documentation</span>
            </button>

            <button
              onClick={() => navigate('/support')}
              className="flex items-center space-x-2 text-base-paragraph hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <MessageCircle className="h-4 w-4 text-brand-accent" />
              <span>Support</span>
            </button>
            
            {!loading && !session && (
              <>
                <button
                  onClick={() => navigate('/workspace/login')}
                  className="flex items-center space-x-2 text-base-paragraph hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <User className="h-4 w-4 text-brand-accent" />
                  <span>Login</span>
                </button>
                <Link to="/workspace/signup">
                  <Button className="bg-brand-primary hover:bg-brand-primary/90">Get Started</Button>
                </Link>
              </>
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
                  <span className="text-sm font-medium text-base-paragraph hidden sm:block">{profile.full_name}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="text-base-heading">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/workspace/profile')}>
                    <User className="mr-2 h-4 w-4 text-brand-accent" />
                    <span className="text-base-paragraph">Edit Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/workspace/subscription')}>
                    <CreditCard className="mr-2 h-4 w-4 text-brand-accent" />
                    <span className="text-base-paragraph">Manage Subscription</span>
                  </DropdownMenuItem>
                  {hasStudio && (
                    <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/workspace/teams')}>
                      <Users className="mr-2 h-4 w-4 text-brand-accent" />
                      <span className="text-base-paragraph">Manage Teams</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4 text-brand-accent" />
                    <span className="text-base-paragraph">Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-base-heading hover:text-brand-accent hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-primary"
            >
              <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
          <button
            onClick={() => { navigate('/support'); closeMobileMenu(); }}
            className="flex items-center w-full text-left space-x-2 text-base-paragraph hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium transition-colors"
          >
            <MessageCircle className="h-5 w-5 text-brand-accent" />
            <span>Support</span>
          </button>

          {!loading && !session && (
            <button
              onClick={() => { navigate('/pricing'); closeMobileMenu(); }}
              className="flex items-center w-full text-left space-x-2 text-base-paragraph hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              <CreditCard className="h-5 w-5 text-brand-accent" />
              <span>Pricing</span>
            </button>
          )}

          <button
            onClick={() => { navigate('/docs'); closeMobileMenu(); }}
            className="flex items-center w-full text-left space-x-2 text-base-paragraph hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium transition-colors"
          >
            <BookOpen className="h-5 w-5 text-brand-accent" />
            <span>Documentation</span>
          </button>
          
          {!loading && !session ? (
            <>
              <button
                onClick={() => { navigate('/workspace/login'); closeMobileMenu(); }}
                className="flex items-center w-full text-left space-x-2 text-base-paragraph hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium transition-colors"
              >
                <User className="h-5 w-5 text-brand-accent" />
                <span>Login</span>
              </button>
              <button
                onClick={() => { navigate('/workspace/signup'); closeMobileMenu(); }}
                className="flex items-center w-full text-left space-x-2 bg-brand-primary text-white px-3 py-2 rounded-md text-base font-medium"
              >
                <span>Get Started</span>
              </button>
            </>
          ) : !loading && session && (
            <>
              {hasStudio && (
                <button
                  onClick={() => { navigate('/workspace/teams'); closeMobileMenu(); }}
                  className="flex items-center w-full text-left space-x-2 text-base-paragraph hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  <Users className="h-5 w-5 text-brand-accent" />
                  <span>Teams</span>
                </button>
              )}
              
              {profile && (
                <>
                  <div className="border-t border-gray-200 my-2 pt-2">
                    <div className="flex items-center px-3 py-2">
                      {profile.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt={profile.full_name}
                          className="h-8 w-8 rounded-full mr-3"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-brand-primary/10 flex items-center justify-center mr-3">
                          <User className="h-5 w-5 text-base-heading" />
                        </div>
                      )}
                      <span className="font-medium text-base-heading">{profile.full_name}</span>
                    </div>
                    
                    <button
                      onClick={() => { navigate('/workspace/profile'); closeMobileMenu(); }}
                      className="flex items-center w-full text-left space-x-2 text-base-paragraph hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      <User className="h-4 w-4 text-brand-accent" />
                      <span>Edit Profile</span>
                    </button>
                    
                    <button
                      onClick={() => { navigate('/workspace/subscription'); closeMobileMenu(); }}
                      className="flex items-center w-full text-left space-x-2 text-base-paragraph hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      <CreditCard className="h-4 w-4 text-brand-accent" />
                      <span>Manage Subscription</span>
                    </button>
                    
                    <button
                      onClick={() => { handleLogout(); closeMobileMenu(); }}
                      className="flex items-center w-full text-left space-x-2 text-base-paragraph hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      <LogOut className="h-4 w-4 text-brand-accent" />
                      <span>Log out</span>
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}