import React, { useState } from 'react';
import { X, MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { CreateAnnotationData } from '../../types/annotations';

interface CreateAnnotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAnnotationData) => void;
  selectedText: string;
  chapterId: string;
  startOffset: number;
  endOffset: number;
}

export function CreateAnnotationModal({
  isOpen,
  onClose,
  onSubmit,
  selectedText,
  chapterId,
  startOffset,
  endOffset
}: CreateAnnotationModalProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    await onSubmit({
      chapter_id: chapterId,
      content: content.trim(),
      start_offset: startOffset,
      end_offset: endOffset,
      selected_text: selectedText
    });
    
    setContent('');
    setIsSubmitting(false);
    onClose();
  };

  const handleClose = () => {
    setContent('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 my-8 flex flex-col max-h-[calc(100vh-4rem)]">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-primary">Add Annotation</h2>
          </div>
          <button 
            onClick={handleClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {/* Selected Text */}
            <div>
              <Label className="text-primary">Selected Text</Label>
              <div className="mt-1 p-3 bg-gray-100 rounded-md text-sm italic text-gray-700 border">
                "{selectedText}"
              </div>
            </div>

            {/* Comment */}
            <div>
              <Label htmlFor="content" className="flex items-center gap-1 text-primary">
                Your Comment
                <span className="text-red-500">*</span>
              </Label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Add your comment or question about this text..."
                rows={4}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSubmitting}
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1">
                {content.length}/1000 characters
              </p>
            </div>

            {/* Keyboard Shortcuts Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="text-sm font-medium text-blue-800 mb-1">Keyboard Shortcuts</h4>
              <div className="text-xs text-blue-700 space-y-1">
                <div><kbd className="bg-blue-100 px-1 rounded">Ctrl+Enter</kbd> - Submit annotation</div>
                <div><kbd className="bg-blue-100 px-1 rounded">Esc</kbd> - Cancel</div>
              </div>
            </div>
          </div>
        </form>

        <div className="border-t p-4">
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
              disabled={!content.trim() || isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Annotation'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}