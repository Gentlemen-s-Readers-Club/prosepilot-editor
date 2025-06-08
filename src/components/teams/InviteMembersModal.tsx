import React, { useState } from 'react';
import { X, Mail, Plus, Trash2, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { CustomSelect, SelectOption } from '../ui/select';
import { useToast } from '../../hooks/use-toast';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { inviteMembers, fetchTeamInvitations } from '../../store/slices/teamsSlice';
import { TeamRole } from '../../store/types';

interface InviteMembersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: string;
}

const roleOptions: SelectOption[] = [
  { value: 'reader', label: 'Reader - View-only access, can comment' },
  { value: 'editor', label: 'Editor - Can create and edit books' },
  { value: 'admin', label: 'Admin - Full access including member management' }
];

export function InviteMembersModal({ open, onOpenChange, teamId }: InviteMembersModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  
  const [emails, setEmails] = useState<string[]>(['']);
  const [selectedRole, setSelectedRole] = useState<SelectOption>(roleOptions[1]); // Default to editor
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailErrors, setEmailErrors] = useState<boolean[]>([false]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const validEmails = emails.filter(email => email.trim() && validateEmail(email.trim()));
    const errors = emails.map(email => email.trim() && !validateEmail(email.trim()));
    setEmailErrors(errors);
    return validEmails.length > 0 && !errors.some(Boolean);
  };

  const addEmailField = () => {
    if (emails.length < 20) {
      setEmails([...emails, '']);
      setEmailErrors([...emailErrors, false]);
    }
  };

  const removeEmailField = (index: number) => {
    if (emails.length > 1) {
      setEmails(emails.filter((_, i) => i !== index));
      setEmailErrors(emailErrors.filter((_, i) => i !== index));
    }
  };

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
    
    // Clear error for this field
    const newErrors = [...emailErrors];
    newErrors[index] = false;
    setEmailErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter valid email addresses",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const validEmails = emails.filter(email => email.trim() && validateEmail(email.trim()));
      
      await dispatch(inviteMembers({
        teamId,
        inviteData: {
          emails: validEmails,
          role: selectedRole.value as TeamRole,
          message: message.trim() || undefined
        }
      })).unwrap();

      // Refresh invitations list
      await dispatch(fetchTeamInvitations(teamId));
      
      toast({
        title: "Success",
        description: `Sent ${validEmails.length} invitation${validEmails.length > 1 ? 's' : ''}`,
      });
      
      // Reset form
      setEmails(['']);
      setEmailErrors([false]);
      setMessage('');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error inviting members:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send invitations",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setEmails(['']);
      setEmailErrors([false]);
      setMessage('');
      onOpenChange(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg mx-4 my-8 flex flex-col max-h-[calc(100vh-4rem)]">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-primary">Invite Team Members</h2>
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
            {/* Email Addresses */}
            <div>
              <Label className="flex items-center gap-1 text-primary">
                Email Addresses
                <span className="text-red-500">*</span>
              </Label>
              <div className="mt-2 space-y-3">
                {emails.map((email, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1">
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => updateEmail(index, e.target.value)}
                        placeholder="colleague@company.com"
                        className={emailErrors[index] ? 'border-red-500 focus:ring-red-500' : ''}
                        disabled={isSubmitting}
                      />
                      {emailErrors[index] && (
                        <p className="mt-1 text-sm text-red-600">
                          Please enter a valid email address
                        </p>
                      )}
                    </div>
                    {emails.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEmailField(index)}
                        disabled={isSubmitting}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              {emails.length < 20 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addEmailField}
                  disabled={isSubmitting}
                  className="mt-3 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Email
                </Button>
              )}
              
              <p className="text-xs text-gray-500 mt-2">
                You can invite up to 20 people at once. ({emails.length}/20)
              </p>
            </div>

            {/* Role Selection */}
            <div>
              <Label className="text-primary">Role</Label>
              <div className="mt-2">
                <CustomSelect
                  value={selectedRole}
                  onChange={(newValue) => setSelectedRole(newValue as SelectOption)}
                  options={roleOptions}
                  placeholder="Select role..."
                  isDisabled={isSubmitting}
                />
              </div>
              <div className="mt-3 text-sm text-gray-600">
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Reader:</span> Can view books and leave comments
                  </div>
                  <div>
                    <span className="font-medium">Editor:</span> Can create, edit, and manage books
                  </div>
                  <div>
                    <span className="font-medium">Admin:</span> Full access including member management
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Message */}
            <div>
              <Label htmlFor="message" className="text-primary">
                Custom Message (Optional)
              </Label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a personal message to your invitation..."
                rows={3}
                maxLength={500}
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                {message.length}/500 characters
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800">How invitations work</h4>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Invitations are sent via email</li>
                    <li>• Recipients have 7 days to accept</li>
                    <li>• You can cancel pending invitations anytime</li>
                    <li>• Members can be promoted or demoted later</li>
                  </ul>
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
              disabled={isSubmitting || !emails.some(email => email.trim())}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </div>
              ) : (
                'Send Invitations'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}