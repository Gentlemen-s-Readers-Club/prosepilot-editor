import React, { useState } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { FileUpload } from '../ui/file-upload';
import { useToast } from '../../hooks/use-toast';
import { supabase } from '../../lib/supabase';

interface CreateTeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTeam: (teamData: { name: string; description?: string; logo_url?: string }) => void;
}

export function CreateTeamModal({ open, onOpenChange, onCreateTeam }: CreateTeamModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo_url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
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

      const fileExt = file.name.split('.').pop();
      const fileName = `team-logos/${user.id}/${Date.now()}.${fileExt}`;

      // Try to upload to team-assets bucket, fallback to avatars bucket if it doesn't exist
      let uploadResult;
      try {
        uploadResult = await supabase.storage
          .from('team-assets')
          .upload(fileName, file, { 
            upsert: true,
            contentType: file.type 
          });
      } catch (bucketError: any) {
        // If team-assets bucket doesn't exist, try avatars bucket as fallback
        if (bucketError.message?.includes('Bucket not found')) {
          uploadResult = await supabase.storage
            .from('avatars')
            .upload(fileName, file, { 
              upsert: true,
              contentType: file.type 
            });
        } else {
          throw bucketError;
        }
      }

      if (uploadResult.error) throw uploadResult.error;

      // Get public URL from the appropriate bucket
      let publicUrl;
      try {
        const { data: { publicUrl: teamAssetsUrl } } = supabase.storage
          .from('team-assets')
          .getPublicUrl(fileName);
        publicUrl = teamAssetsUrl;
      } catch {
        // Fallback to avatars bucket
        const { data: { publicUrl: avatarsUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);
        publicUrl = avatarsUrl;
      }

      setFormData({ ...formData, logo_url: publicUrl });
      
      toast({
        title: "Success",
        description: "Team logo uploaded successfully",
      });
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload team logo. Please try again or contact support if the issue persists.",
      });
    } finally {
      setIsUploadingLogo(false);
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
      const teamData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        logo_url: formData.logo_url || undefined
      };
      
      await onCreateTeam(teamData);
      
      // Reset form
      setFormData({ name: '', description: '', logo_url: '' });
      setErrors({ name: false });
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ name: '', description: '', logo_url: '' });
      setErrors({ name: false });
      onOpenChange(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 my-8 flex flex-col max-h-[calc(100vh-4rem)]">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-primary">Create New Team</h2>
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
              <Label className="text-primary">Team Logo (Optional)</Label>
              <div className="mt-2">
                {formData.logo_url ? (
                  <div className="relative">
                    <img
                      src={formData.logo_url}
                      alt="Team logo"
                      className="w-24 h-24 rounded-lg object-cover border"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, logo_url: '' })}
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
                      className="w-24 h-24"
                    />
                    {isUploadingLogo && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      </div>
                    )}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Supports JPG, PNG (max 5MB)
              </p>
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
                Description (Optional)
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

            {/* Team Limits Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Team Limits</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Maximum 50 members per team</li>
                <li>• Invite up to 20 users at once</li>
                <li>• Unlimited collaborative books</li>
                <li>• Full activity tracking</li>
              </ul>
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
                  Creating...
                </div>
              ) : (
                'Create Team'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}