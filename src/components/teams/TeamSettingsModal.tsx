import React, { useState } from 'react';
import { X, Upload, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { FileUpload } from '../ui/file-upload';
import { useToast } from '../../hooks/use-toast';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { updateTeam, deleteTeam } from '../../store/slices/teamsSlice';
import { supabase } from '../../lib/supabase';
import { Team } from '../../store/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { useNavigate } from 'react-router-dom';

interface TeamSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: Team;
}

export function TeamSettingsModal({ open, onOpenChange, team }: TeamSettingsModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: team.name,
    description: team.description || '',
    logo_url: team.logo_url || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [errors, setErrors] = useState({
    name: false
  });

  const validateForm = () => {
    const newErrors = {
      name: formData.name.trim().length < 3 || formData.name.trim().length > 50
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleLogoUpload = async (file: File) => {
    try {
      setIsUploadingLogo(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Delete old logo if exists
      if (formData.logo_url) {
        try {
          const oldFileName = formData.logo_url.split('/').pop();
          if (oldFileName) {
            await supabase.storage
              .from('avatars')
              .remove([`team-logos/${user.id}/${oldFileName}`]);
          }
        } catch (error) {
          // Ignore deletion errors for old files
          console.warn('Could not delete old logo:', error);
        }
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `team-logos/${user.id}/${Date.now()}.${fileExt}`;

      // Use avatars bucket for team logo uploads
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { 
          upsert: true,
          contentType: file.type 
        });

      if (uploadError) throw uploadError;

      // Get public URL from avatars bucket
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setFormData({ ...formData, logo_url: publicUrl });
      
      toast({
        title: "Success",
        description: "Team logo updated successfully",
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload team logo. Please try again.",
      });
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleRemoveLogo = async () => {
    try {
      if (formData.logo_url) {
        try {
          const fileName = formData.logo_url.split('/').pop();
          if (fileName) {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              await supabase.storage
                .from('avatars')
                .remove([`team-logos/${user.id}/${fileName}`]);
            }
          }
        } catch (error) {
          // Ignore deletion errors
          console.warn('Could not delete logo file:', error);
        }
      }
      setFormData({ ...formData, logo_url: '' });
      toast({
        title: "Success",
        description: "Team logo removed successfully",
      });
    } catch (error) {
      console.error('Error removing logo:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove team logo",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fix the form errors",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const updates = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        logo_url: formData.logo_url || undefined
      };
      
      await dispatch(updateTeam({ teamId: team.id, updates })).unwrap();
      
      toast({
        title: "Success",
        description: "Team settings updated successfully",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating team:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update team settings",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (deleteConfirmation !== team.name) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Team name confirmation does not match",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await dispatch(deleteTeam(team.id)).unwrap();
      
      toast({
        title: "Success",
        description: "Team deleted successfully",
      });
      
      navigate('/app/teams');
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting team:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete team",
      });
    } finally {
      setIsSubmitting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: team.name,
        description: team.description || '',
        logo_url: team.logo_url || ''
      });
      setErrors({ name: false });
      onOpenChange(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-md mx-4 my-8 flex flex-col max-h-[calc(100vh-4rem)]">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold text-primary">Team Settings</h2>
            <button 
              onClick={handleClose} 
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isSubmitting}
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Team Logo */}
              <div>
                <Label className="text-primary">Team Logo</Label>
                <div className="mt-2">
                  {formData.logo_url ? (
                    <div className="relative inline-block">
                      <img
                        src={formData.logo_url}
                        alt="Team logo"
                        className="w-24 h-24 rounded-lg object-cover border"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        disabled={isSubmitting}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <FileUpload 
                        onFileSelect={handleLogoUpload}
                        className="w-40 h-40"
                        showInstructions={false}
                      />
                      {isUploadingLogo && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                          <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Team Name */}
              <div>
                <Label htmlFor="teamName" className="flex items-center gap-1 text-primary">
                  Team Name
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="teamName"
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    setErrors({ ...errors, name: false });
                  }}
                  placeholder="Enter team name (3-50 characters)"
                  className={`mt-1 ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                  disabled={isSubmitting}
                  maxLength={50}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    Team name must be between 3 and 50 characters
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {formData.name.length}/50 characters
                </p>
              </div>

              {/* Team Description */}
              <div>
                <Label htmlFor="teamDescription" className="text-primary">
                  Description
                </Label>
                <textarea
                  id="teamDescription"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your team's purpose and goals..."
                  rows={3}
                  maxLength={200}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/200 characters
                </p>
              </div>

              {/* Danger Zone */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-red-800">Delete Team</h4>
                      <p className="text-sm text-red-700 mt-1">
                        Permanently delete this team and all associated data. This action cannot be undone.
                      </p>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => setShowDeleteDialog(true)}
                        disabled={isSubmitting}
                        className="mt-3"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Team
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>

          <div className="border-t p-6">
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.name.trim() || formData.name.trim().length < 3}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </div>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Team</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the team "{team.name}" 
              and remove all associated data including books, members, and activity logs.
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
                    This will permanently delete:
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>All team books and chapters</li>
                      <li>All member access and roles</li>
                      <li>All activity logs and history</li>
                      <li>All pending invitations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deleteConfirmation">
                Type the team name <span className="font-medium">"{team.name}"</span> to confirm
              </Label>
              <Input
                id="deleteConfirmation"
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder={team.name}
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
              onClick={handleDeleteTeam}
              disabled={deleteConfirmation !== team.name || isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </div>
              ) : (
                'Delete Team'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}