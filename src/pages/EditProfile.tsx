import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Navigation } from '../components/Navigation';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';
import { Upload, Facebook, AlertCircle, User, CreditCard, Bell, Shield, AlertTriangle, Loader2 } from 'lucide-react';
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
import { updateProfile } from '../store/slices/profileSlice';

export function EditProfile() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { profile, status } = useSelector((state: RootState) => state.profile);

  const [loading, setLoading] = useState(false);
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeSection, setActiveSection] = useState('profile');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [profileData, setProfileData] = useState({
    full_name: profile?.full_name || '',
    avatar_url: profile?.avatar_url || '',
    newsletter_product: true,
    newsletter_marketing: true,
    newsletter_writing: true,
  });
  const [connectedProviders, setConnectedProviders] = useState<string[]>([]);

  useEffect(() => {
    setProfileData({
      full_name: profile?.full_name || '',
      avatar_url: profile?.avatar_url || '',
      newsletter_product: profile?.newsletter_product || true,
      newsletter_marketing: profile?.newsletter_marketing || true,
      newsletter_writing: profile?.newsletter_writing || true,
    });
  }, [profile]);  

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(newPassword));
  }, [newPassword]);

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
      case 0: return 'bg-danger';
      case 1: return 'bg-danger';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-green-500';
      case 5: return 'bg-green-600';
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
    } catch (error: any) {
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
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialConnect(provider: 'google' | 'facebook') {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/app/profile`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
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
    } catch (error: any) {
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
              <Label htmlFor="avatar\" className="block text-sm font-medium text-gray-700">
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
                  <span className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isFileLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {isFileLoading ? (
                      <div className="flex items-center">
                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" />
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
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile?.email}
                disabled
                className="mt-1 bg-gray-50"
              />
            </div>

            <div>
              <Label htmlFor="fullName">Full Name</Label>
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                <span className="text-gray-700">Google</span>
              </div>
              <Button
                variant="outline"
                onClick={() => handleSocialConnect('google')}
                disabled={connectedProviders.includes('google')}
              >
                {connectedProviders.includes('google') ? 'Connected' : 'Connect'}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Facebook className="w-6 h-6 text-[#1877F2]" />
                <span className="text-gray-700">Facebook</span>
              </div>
              <Button
                variant="outline"
                onClick={() => handleSocialConnect('facebook')}
                disabled={connectedProviders.includes('facebook')}
              >
                {connectedProviders.includes('facebook') ? 'Connected' : 'Connect'}
              </Button>
            </div>
          </div>
        );

      case 'newsletters':
        return (
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="newsletter_product"
                  type="checkbox"
                  checked={profile.newsletter_product}
                  onChange={(e) => setProfileData({ ...profile, newsletter_product: e.target.checked })}
                  className="h-4 w-4 text-primary border-gray-300 rounded relative top-1"
                />
              </div>
              <div className="ml-3">
                <Label htmlFor="newsletter_product" className="font-medium text-gray-700">Product Updates</Label>
                <p className="text-gray-500 text-sm">Be the first to know about new AI capabilities, tools, and improvements in the platform.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="newsletter_writing"
                  type="checkbox"
                  checked={profile.newsletter_writing}
                  onChange={(e) => setProfileData({ ...profile, newsletter_writing: e.target.checked })}
                  className="h-4 w-4 text-primary border-gray-300 rounded relative top-1"
                />
              </div>
              <div className="ml-3">
                <Label htmlFor="newsletter_writing" className="font-medium text-gray-700">Writing Tips & Resources</Label>
                <p className="text-gray-500 text-sm">Get weekly inspiration, creative prompts, and storytelling advice to keep your writing flowing.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="newsletter_marketing"
                  type="checkbox"
                  checked={profile.newsletter_marketing}
                  onChange={(e) => setProfileData({ ...profile, newsletter_marketing: e.target.checked })}
                  className="h-4 w-4 text-primary border-gray-300 rounded relative top-1"
                />
              </div>
              <div className="ml-3">
                <Label htmlFor="newsletter_marketing" className="font-medium text-gray-700">Publishing & Marketing Advice</Label>
                <p className="text-gray-500 text-sm">Learn how to publish, promote, and sell your book—plus tips on reaching your audience.</p>
              </div>
            </div>

            <Button
              onClick={handleProfileSave}
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
              <h3 className="text-sm font-medium text-gray-900">Change Password</h3>
              <p className="mt-1 text-sm text-gray-500">
                Make sure your new password is at least 8 characters long and includes a mix of letters, numbers, and symbols.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
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
                      <span className="text-sm text-gray-500">Password strength:</span>
                      <span className="text-sm font-medium text-gray-700">{getStrengthText()}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${getStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      />
                    </div>
                    <ul className="mt-2 text-sm text-gray-500 space-y-1">
                      <li className={newPassword.length >= 8 ? "text-green-600" : ""}>• At least 8 characters</li>
                      <li className={newPassword.match(/[A-Z]/) ? "text-green-600" : ""}>• At least one uppercase letter</li>
                      <li className={newPassword.match(/[a-z]/) ? "text-green-600" : ""}>• At least one lowercase letter</li>
                      <li className={newPassword.match(/[0-9]/) ? "text-green-600" : ""}>• At least one number</li>
                      <li className={newPassword.match(/[^A-Za-z0-9]/) ? "text-green-600" : ""}>• At least one special character</li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
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
                Once you delete your account, there is no going back. Please be certain.
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
    <div className="bg-background pt-16">
      <Navigation />
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="w-64 shrink-0">
              <div className="sticky top-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">Settings</h2>
                <nav className="flex flex-col gap-1">
                  {sections.map(({ id, label, icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveSection(id)}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${
                        activeSection === id
                          ? 'bg-primary text-white'
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
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  {sections.find(s => s.id === activeSection)?.label}
                </h2>
                {renderSection()}
              </div>
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
    </div>
  );
}