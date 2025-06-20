import React from 'react';
import { BookOpen, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface NewContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (type: 'chapter' | 'page') => void;
}

export function NewContentModal({ open, onOpenChange, onAdd }: NewContentModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle className="font-heading">Add New Content</DialogTitle>
          <DialogDescription className="text-base-paragraph font-copy">
            Choose the type of content you want to add to your book.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <button
            onClick={() => onAdd('chapter')}
            className="flex flex-col items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-base-border hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-base-heading" />
            </div>
            <div className="text-center">
              <h3 className="font-medium text-gray-900 font-heading">New Chapter</h3>
              <p className="text-sm text-base-paragraph font-copy">
                Add a new chapter to your book with AI-generated content.
              </p>
            </div>
          </button>
          <button
            onClick={() => onAdd('page')}
            className="flex flex-col items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-base-border hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-base-heading" />
            </div>
            <div className="text-center">
              <h3 className="font-medium text-gray-900 font-heading">New Page</h3>
              <p className="text-sm text-base-paragraph font-copy">
                Add a standalone page with custom content.
              </p>
            </div>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}