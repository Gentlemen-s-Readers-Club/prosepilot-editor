import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { useToast } from '../hooks/use-toast';
import { Upload, Facebook, AlertCircle, User, CreditCard, Bell, Shield, AlertTriangle, Loader2, Mail } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { updateProfile, updateNewsletterPreferences } from '../store/slices/profileSlice';
import { Helmet } from 'react-helmet';

export function EditProfile() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { profile } = useSelector((state: RootState) => state.profile);

  const [loading, setLoading] = useState(false);
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUnlinkDialog, setShowUnlinkDialog] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeSection, setActiveSection] = useState('profile');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [profileData, setProfileData] = useState({
    full_name: profile?.full_name || '',
    avatar_url: profile?.avatar_url || '',
  });

  const [newsletterPreferences, setNewsletterPreferences] = useState({
    newsletter_product: profile?.newsletter_product ?? true,
    newsletter_marketing: profile?.newsletter_marketing ?? true,
    newsletter_writing: profile?.newsletter_writing ?? true,
  });

  const [connectedProviders, setConnectedProviders] = useState<string[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(true);

  useEffect(() => {
    setProfileData({
      full_name: profile?.full_name || '',
      avatar_url: profile?.avatar_url || '',
    });
    setNewsletterPreferences({
      newsletter_product: profile?.newsletter_product ?? true,
      newsletter_marketing: profile?.newsletter_marketing ?? true,
      newsletter_writing: profile?.newsletter_writing ?? true,
    });
  }, [profile]);  

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(newPassword));
  }, [newPassword]);

  // Fetch connected providers
  useEffect(() => {
    const fetchUserIdentities = async () => {
      try {
        setLoadingProviders(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user && user.identities) {
          // Extract provider names from identities
          const providers = user.identities.map(identity => identity.provider);
          setConnectedProviders(providers);
        }
      } catch (error) {
        console.error('Error fetching user identities:', error);
      } finally {
        setLoadingProviders(false);
      }
    };

    fetchUserIdentities();
  }, []);

  const calculatePasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength += 1;
    if (pass.match(/[A-Z]/)) strength += 1;
    if (pass.match(/[a-z]/)) strength += 1;
    if (pass.match(/[0-9]/)) strength += 1;
    if (pass.match(/[^A-Za-z0-9]/)) strength += 1;
    return strength;
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 0: return 'bg-state-error';
      case 1: return 'bg-state-error';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-state-success';
      case 5: return 'bg-state-success';
      default: return 'bg-gray-200';
    }
  };

  const getStrengthText = () => {
    switch (passwordStrength) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      case 5: return 'Very Strong';
      default: return '';
    }
  };

  async function handleProfileSave() {
    try {
      setLoading(true);
      await dispatch(updateProfile({
        full_name: profileData.full_name,
        avatar_url: profileData.avatar_url
      }));
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (err) {
      console.error('Error updating profile:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error updating profile",
      });
    } finally { 
      setLoading(false);
    }
  }

  async function handleNewsletterSave() {
    try {
      setLoading(true);
      await dispatch(updateNewsletterPreferences(newsletterPreferences));
      toast({
        title: "Success",
        description: "Newsletter preferences updated successfully",
      });
    } catch (err) {
      console.error('Error updating newsletter preferences:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error updating newsletter preferences",
      });
    } finally { 
      setLoading(false);
    }
  }

  async function handleAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setIsFileLoading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${session.user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      console.log(publicUrl);
      setProfileData({ ...profileData, avatar_url: publicUrl });
      
      toast({
        title: "Success",
        description: "Avatar uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error uploading avatar",
      });
    } finally {
      setIsFileLoading(false);
    }
  }

  async function handlePasswordUpdate() {
    if (newPassword.length < 8) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Password must be at least 8 characters long",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match",
      });
      return;
    }

    if (passwordStrength < 3) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Password is not strong enough",
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password updated successfully",
      });
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialConnect(provider: 'google' | 'facebook') {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/app/profile`,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with social provider:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async function handleSocialUnlink(provider: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      setLoading(true);
      
      // Check if this is the only auth method
      if (!user?.identities?.length) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must have at least one login method. Add another method before removing this one.",
        });
        return;
      }

      // find the identity
      const identity = user?.identities?.find(
        identity => identity.provider === provider
      )

      if(!identity) {
        throw new Error('Identity not found');
      }
      
      // Call the unlink endpoint
      const { error } = await supabase.auth.unlinkIdentity(identity);

      if (error) throw error;

      // Update the UI
      setConnectedProviders(connectedProviders.filter(p => p !== provider));
      
      toast({
        title: "Success",
        description: `Successfully unlinked ${provider} account`,
      });
      
      setShowUnlinkDialog(null);
    } catch (error) {
      console.error('Error unlinking provider:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to unlink account',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteAccount() {
    if (deleteConfirmation !== profile?.email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Email confirmation does not match",
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.admin.deleteUser(
        (await supabase.auth.getUser()).data.user?.id || ''
      );

      if (error) throw error;

      await supabase.auth.signOut();
      navigate('/');
      
      toast({
        title: "Success",
        description: "Your account has been deleted",
      });
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete account",
      });
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  }

  const sections = [
    { id: 'profile', label: 'Profile Information', icon: <User className="w-4 h-4" /> },
    { id: 'connected', label: 'Connected Accounts', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'newsletters', label: 'Newsletter Preferences', icon: <Bell className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'danger', label: 'Danger Zone', icon: <AlertTriangle className="w-4 h-4" /> },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="avatar\" className="block text-sm font-medium text-base-heading">
                Profile Picture
              </Label>
              <div className="mt-2 flex items-center space-x-4">
                <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-100">
                  {profileData.avatar_url ? (
                    <img
                      src={profileData.avatar_url}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-200">
                      <Upload className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <label className="cursor-pointer">
                  <span className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-base-heading bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isFileLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {isFileLoading ? (
                      <div className="flex items-center">
                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-base-heading" />
                        Uploading...
                      </div>
                    ) : (
                      'Change'
                    )}
                  </span>
                  <input
                    type="file"
                    id="avatar"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={loading}
                  />
                </label>
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-base-heading">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile?.email}
                disabled
                className="mt-1 bg-gray-50"
              />
            </div>

            <div>
              <Label htmlFor="fullName" className="block text-sm font-medium text-base-heading">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={profileData.full_name}
                onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                className="mt-1"
                disabled={loading}
              />
            </div>

            <Button
              onClick={handleProfileSave}
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        );

      case 'connected':
        return (
          <div className="space-y-3">
            {loadingProviders ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-6 h-6 text-brand-primary animate-spin mr-2" />
                <span className="text-base-paragraph">Loading connected accounts...</span>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                    <span className="text-base-heading">Google</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {connectedProviders.includes('google') ? (
                      <Button
                        variant="outline"
                        onClick={() => setShowUnlinkDialog('google')}
                        className="text-state-error border-state-error hover:bg-state-error"
                      >
                        Connected
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => handleSocialConnect('google')}
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Facebook className="w-6 h-6 text-[#1877F2]" />
                    <span className="text-base-heading">Facebook</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {connectedProviders.includes('facebook') ? (
                      <Button
                        variant="outline"
                        onClick={() => setShowUnlinkDialog('facebook')}
                        className="text-state-error border-state-error hover:bg-state-error"
                      >
                        Connected
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => handleSocialConnect('facebook')}
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Email provider is always connected since it's the primary auth method */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-6 h-6 text-brand-accent" />
                    <span className="text-base-heading">Email</span>
                  </div>
                  <Button
                    variant="outline"
                    disabled={true}
                  >
                    Connected
                  </Button>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Connecting social accounts allows for easier login and account recovery options.
                  </p>
                </div>
              </>
            )}
          </div>
        );

      case 'newsletters':
        return (
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="newsletter_product"
                checked={newsletterPreferences.newsletter_product}
                onChange={(checked) => setNewsletterPreferences({ 
                  ...newsletterPreferences, 
                  newsletter_product: checked 
                })}
                className="mt-1"
              />
              <div>
                <Label htmlFor="newsletter_product" className="font-medium text-base-heading">Product Updates</Label>
                <p className="text-gray-500 text-sm">Be the first to know about new AI capabilities, tools, and improvements in the platform.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="newsletter_writing"
                checked={newsletterPreferences.newsletter_writing}
                onChange={(checked) => setNewsletterPreferences({ 
                  ...newsletterPreferences, 
                  newsletter_writing: checked 
                })}
                className="mt-1"
              />
              <div>
                <Label htmlFor="newsletter_writing" className="font-medium text-base-heading">Writing Tips & Resources</Label>
                <p className="text-gray-500 text-sm">Get weekly inspiration, creative prompts, and storytelling advice to keep your writing flowing.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="newsletter_marketing"
                checked={newsletterPreferences.newsletter_marketing}
                onChange={(checked) => setNewsletterPreferences({ 
                  ...newsletterPreferences, 
                  newsletter_marketing: checked 
                })}
                className="mt-1"
              />
              <div>
                <Label htmlFor="newsletter_marketing" className="font-medium text-base-heading">Publishing & Marketing Advice</Label>
                <p className="text-gray-500 text-sm">Learn how to publish, promote, and sell your book—plus tips on reaching your audience.</p>
              </div>
            </div>

            <Button
              onClick={handleNewsletterSave}
              className="w-full mt-6"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-base-heading">Change Password</h3>
              <p className="mt-1 text-sm text-base-paragraph">
                Make sure your new password is at least 8 characters long and includes a mix of letters, numbers, and symbols.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="block text-sm font-medium text-base-heading">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  minLength={8}
                />
                {newPassword && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-base-paragraph">Password strength:</span>
                      <span className="text-sm font-medium text-base-heading">{getStrengthText()}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${getStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      />
                    </div>
                    <ul className="mt-2 text-sm text-base-paragraph space-y-1">
                      <li className={newPassword.length >= 8 ? "text-state-success" : ""}>• At least 8 characters</li>
                      <li className={newPassword.match(/[A-Z]/) ? "text-state-success" : ""}>• At least one uppercase letter</li>
                      <li className={newPassword.match(/[a-z]/) ? "text-state-success" : ""}>• At least one lowercase letter</li>
                      <li className={newPassword.match(/[0-9]/) ? "text-state-success" : ""}>• At least one number</li>
                      <li className={newPassword.match(/[^A-Za-z0-9]/) ? "text-state-success" : ""}>• At least one special character</li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="block text-sm font-medium text-base-heading">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  minLength={8}
                />
              </div>

              <Button
                onClick={handlePasswordUpdate}
                disabled={!newPassword || !confirmPassword || loading || passwordStrength < 3 || newPassword.length < 8}
                className="w-full"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </div>
        );

      case 'danger':
        return (
          <div className="space-y-4">
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-sm text-red-700">
                <strong>Warning:</strong> Once you delete your account, there is no going back. This action will permanently delete:
              </p>
              <ul className="text-sm text-red-700 mt-2 ml-4 list-disc space-y-1">
                <li>All your books and chapters</li>
                <li>Your writing progress and drafts</li>
                <li>Account settings and preferences</li>
                <li>Subscription and billing information</li>
                <li>All associated data and files</li>
              </ul>
              <p className="text-sm text-red-700 mt-2">
                This action cannot be undone. Please be absolutely certain before proceeding.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              className="w-full"
            >
              Delete Account
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>ProsePilot - Edit Profile</title>
      </Helmet>
      <div className="min-h-screen bg-base-background">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-64 shrink-0">
              <div className="md:sticky md:top-8">
                <h2 className="text-2xl font-semibold text-base-heading mb-4">Settings</h2>
                <nav className="flex flex-col gap-1">
                  {sections.map(({ id, label, icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveSection(id)}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${
                        activeSection === id
                          ? 'bg-brand-primary text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {icon}
                      <span>{label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-base-heading mb-6">
                  {sections.find(s => s.id === activeSection)?.label}
                </h2>
                {renderSection()}
              </div>
            </div>
          </div>
        </div>

        {/* Delete Account Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Account</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Warning
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>All your books and writing will be permanently deleted</li>
                        <li>Your subscription will be cancelled immediately</li>
                        <li>This action cannot be reversed</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deleteConfirmation">
                  Type your email <span className="font-medium">{profile?.email}</span> to confirm
                </Label>
                <Input
                  id="deleteConfirmation"
                  type="email"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder={profile?.email}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteDialog(false);
                  setDeleteConfirmation('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmation !== profile?.email || loading}
              >
                Delete Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Unlink Provider Dialog */}
        <Dialog open={!!showUnlinkDialog} onOpenChange={() => setShowUnlinkDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Unlink {showUnlinkDialog?.charAt(0).toUpperCase()}{showUnlinkDialog?.slice(1)} Account</DialogTitle>
              <DialogDescription>
                Are you sure you want to unlink your {showUnlinkDialog} account? You will no longer be able to sign in using this method.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <div className="shrink-0">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Important
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>Make sure you have at least one other way to sign in to your account.</p>
                      {connectedProviders.length <= 1 && (
                        <p className="mt-1 font-semibold">You currently have only one sign-in method. You must add another method before you can remove this one.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowUnlinkDialog(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => showUnlinkDialog && handleSocialUnlink(showUnlinkDialog)}
                disabled={loading || connectedProviders.length <= 1}
              >
                {loading ? 'Unlinking...' : 'Unlink Account'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}