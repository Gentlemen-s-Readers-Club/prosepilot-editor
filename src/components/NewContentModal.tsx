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
          <DialogTitle>Add New Content</DialogTitle>
          <DialogDescription>
            Choose whether to add a new chapter or a single page.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <button
            onClick={() => onAdd('chapter')}
            className="flex flex-col items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-[#2D626D] hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-[#2D626D]/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-[#2D626D]" />
            </div>
            <div className="text-center">
              <h3 className="font-medium text-gray-900">New Chapter</h3>
              <p className="text-sm text-gray-500">Create a new chapter</p>
            </div>
          </button>
          <button
            onClick={() => onAdd('page')}
            className="flex flex-col items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-[#2D626D] hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-[#2D626D]/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-[#2D626D]" />
            </div>
            <div className="text-center">
              <h3 className="font-medium text-gray-900">Single Page</h3>
              <p className="text-sm text-gray-500">Add a standalone page</p>
            </div>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}