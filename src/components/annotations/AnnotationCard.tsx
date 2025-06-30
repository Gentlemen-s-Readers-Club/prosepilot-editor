import React, { useState } from 'react';
import { 
  CheckCircle, 
  Circle, 
  MoreVertical, 
  Trash2, 
  Reply,
  User
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Annotation, CreateReplyData, AnnotationReply } from '../../types/annotations';
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

interface AnnotationCardProps {
  annotation: Annotation;
  isSelected: boolean;
  onSelect: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
  onCreateReply: (data: CreateReplyData) => Promise<AnnotationReply | null>;
  onDeleteReply: (replyId: string, annotationId: string) => Promise<boolean>;
}

export function AnnotationCard({ 
  annotation, 
  isSelected, 
  onSelect, 
  onToggleStatus, 
  onDelete,
  onCreateReply,
  onDeleteReply
}: AnnotationCardProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [replyToDelete, setReplyToDelete] = useState<string | null>(null);

  const isResolved = annotation.status === 'resolved';
  const replyCount = annotation.replies?.length || 0;

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || isResolved) return;

    setIsSubmittingReply(true);
    const success = await onCreateReply({
      annotation_id: annotation.id,
      content: replyContent.trim()
    });

    if (success) {
      setReplyContent('');
      setShowReplyForm(false);
    }
    setIsSubmittingReply(false);
  };

  const handleDeleteReply = async (replyId: string) => {
    setReplyToDelete(replyId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteReply = async () => {
    if (replyToDelete) {
      await onDeleteReply(replyToDelete, annotation.id);
      setShowDeleteDialog(false);
      setReplyToDelete(null);
    }
  };

  return (
    <div 
      className={`border rounded-lg p-3 cursor-pointer transition-all ${
        isSelected 
          ? 'border-state-info bg-state-info-light' 
          : isResolved
          ? 'border-state-success bg-state-success-light'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {isResolved ? ( 
            <CheckCircle className="w-4 h-4 text-state-success" />
          ) : (
            <Circle className="w-4 h-4 text-state-warning" />
          )}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {annotation.user?.avatar_url ? (
              <img
                src={annotation.user.avatar_url}
                alt={annotation.user.full_name}
                className="w-5 h-5 rounded-full"
              />
            ) : (
              <User className="w-4 h-4" />
            )}
            <span className="font-medium font-copy">{annotation.user?.full_name}</span>
            <span className="font-copy">•</span>
            <span className="font-copy">{formatDistanceToNow(new Date(annotation.created_at), { addSuffix: true })}</span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onToggleStatus(); }}>
              {isResolved ? (
                <>
                  <Circle className="w-4 h-4 mr-2" />
                  Mark as Open
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Resolved
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Selected Text */}
      <div className="mb-2 p-2 bg-gray-100 rounded text-sm italic text-gray-700 font-copy">
        "{annotation.selected_text}"
      </div>

      {/* Content */}
      <div className="text-sm text-gray-900 mb-3 font-copy">
        {annotation.content}
      </div>

      {/* Replies */}
      {replyCount > 0 && (
        <div className="space-y-2 mb-3">
          {annotation.replies?.map((reply) => (
            <div key={reply.id} className="bg-gray-50 rounded p-2 text-sm">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  {reply.user?.avatar_url ? (
                    <img
                      src={reply.user.avatar_url}
                      alt={reply.user.full_name}
                      className="w-4 h-4 rounded-full"
                    />
                  ) : (
                    <User className="w-3 h-3" />
                  )}
                  <span className="font-medium font-copy">{reply.user?.full_name}</span>
                  <span className="font-copy">•</span>
                  <span className="font-copy">{formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 text-gray-400 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteReply(reply.id);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
              <div className="text-gray-900 font-copy">{reply.content}</div>
            </div>
          ))}
        </div>
      )}

      {/* Reply Form */}
      {showReplyForm ? (
        <form onSubmit={handleSubmitReply} className="space-y-2" onClick={(e) => e.stopPropagation()}>
          {isResolved && (
            <div className="text-xs text-red-600 mb-2 font-copy">
              Cannot add replies to resolved annotations
            </div>
          )}
          <Input
            type="text"
            placeholder={isResolved ? "Replies disabled for resolved annotations" : "Add a reply..."}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="text-sm bg-white"
            autoFocus
            disabled={isResolved}
          />
          <div className="flex gap-2">
            <Button 
              type="submit" 
              size="sm" 
              disabled={!replyContent.trim() || isSubmittingReply || isResolved}
            >
              {isSubmittingReply ? 'Sending...' : 'Reply'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => {
                setShowReplyForm(false);
                setReplyContent('');
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        !isResolved ? (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-gray-600 hover:text-gray-900"
            onClick={(e) => {
              e.stopPropagation();
              setShowReplyForm(true);
            }}
            title="Add a reply"
          >
            <Reply className="w-3 h-3 mr-1" />
            Reply
          </Button>
        ) : null
      )}

      {/* Delete Reply Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">Delete Reply</DialogTitle>
            <DialogDescription className="font-copy">
              Are you sure you want to delete this reply? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setReplyToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteReply}
            >
              Delete Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}