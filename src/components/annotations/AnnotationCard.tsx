import React, { useState } from 'react';
import { 
  MessageSquare, 
  CheckCircle, 
  Circle, 
  MoreVertical, 
  Trash2, 
  Reply,
  User,
  Calendar
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Annotation } from '../../types/annotations';
import { useAnnotations } from '../../hooks/useAnnotations';
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface AnnotationCardProps {
  annotation: Annotation;
  isSelected: boolean;
  onSelect: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
  chapterId: string;
}

export function AnnotationCard({ 
  annotation, 
  isSelected, 
  onSelect, 
  onToggleStatus, 
  onDelete,
  chapterId 
}: AnnotationCardProps) {
  const { createReply, deleteReply } = useAnnotations(chapterId);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const isResolved = annotation.status === 'resolved';
  const replyCount = annotation.replies?.length || 0;

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setIsSubmittingReply(true);
    const success = await createReply({
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
    if (window.confirm('Are you sure you want to delete this reply?')) {
      await deleteReply(replyId, annotation.id);
    }
  };

  return (
    <div 
      className={`border rounded-lg p-3 cursor-pointer transition-all ${
        isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : isResolved
          ? 'border-green-200 bg-green-50'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {isResolved ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <Circle className="w-4 h-4 text-yellow-600" />
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
            <span className="font-medium">{annotation.user?.full_name}</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(annotation.created_at), { addSuffix: true })}</span>
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
      <div className="mb-2 p-2 bg-gray-100 rounded text-sm italic text-gray-700">
        "{annotation.selected_text}"
      </div>

      {/* Content */}
      <div className="text-sm text-gray-900 mb-3">
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
                  <span className="font-medium">{reply.user?.full_name}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}</span>
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
              <div className="text-gray-900">{reply.content}</div>
            </div>
          ))}
        </div>
      )}

      {/* Reply Form */}
      {showReplyForm ? (
        <form onSubmit={handleSubmitReply} className="space-y-2" onClick={(e) => e.stopPropagation()}>
          <Input
            type="text"
            placeholder="Add a reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="text-sm"
            autoFocus
          />
          <div className="flex gap-2">
            <Button 
              type="submit" 
              size="sm" 
              disabled={!replyContent.trim() || isSubmittingReply}
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
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-gray-600 hover:text-gray-900"
          onClick={(e) => {
            e.stopPropagation();
            setShowReplyForm(true);
          }}
        >
          <Reply className="w-3 h-3 mr-1" />
          Reply
        </Button>
      )}
    </div>
  );
}