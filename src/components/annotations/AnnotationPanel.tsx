import React, { useState } from 'react';
import { 
  MessageSquare, 
  X,
} from 'lucide-react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Annotation, CreateReplyData, AnnotationReply, AnnotationFilters } from '../../types/annotations';
import { AnnotationCard } from './AnnotationCard';

interface AnnotationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAnnotation?: Annotation | null;
  onAnnotationSelect: (annotation: Annotation | null) => void;
  onAnnotationStatusChange?: (annotationId: string) => void;
  // Annotation data and functions from parent
  annotations: Annotation[];
  loading: boolean;
  filters: AnnotationFilters;
  setFilters: (filters: AnnotationFilters) => void;
  toggleAnnotationStatus: (id: string) => Promise<boolean>;
  deleteAnnotation: (id: string) => Promise<boolean>;
  createReply: (data: CreateReplyData) => Promise<AnnotationReply | null>;
  deleteReply: (replyId: string, annotationId: string) => Promise<boolean>;
  getAnnotationStats: () => { total: number; open: number; resolved: number };
}

export function AnnotationPanel({ 
  isOpen, 
  onClose, 
  selectedAnnotation,
  onAnnotationSelect,
  onAnnotationStatusChange,
  annotations,
  loading,
  filters,
  setFilters,
  toggleAnnotationStatus,
  deleteAnnotation,
  createReply,
  deleteReply,
  getAnnotationStats
}: AnnotationPanelProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [annotationToDelete, setAnnotationToDelete] = useState<Annotation | null>(null);

  const stats = getAnnotationStats();

  const filteredAnnotations = annotations.filter(annotation => {
    // Apply status filter
    if (filters.status !== 'all' && annotation.status !== filters.status) {
      return false;
    }
    
    // Apply user filter
    if (filters.user_id && annotation.user_id !== filters.user_id) {
      return false;
    }
    
    // Apply date range filter
    if (filters.date_range) {
      const annotationDate = new Date(annotation.created_at);
      const startDate = new Date(filters.date_range.start);
      const endDate = new Date(filters.date_range.end);
      
      if (annotationDate < startDate || annotationDate > endDate) {
        return false;
      }
    }
    
    return true;
  });

  const handleStatusFilter = (status: 'all' | 'open' | 'resolved') => {
    setFilters({ ...filters, status });
  };

  const handleToggleStatus = async (annotation: Annotation) => {
    if (onAnnotationStatusChange) {
      await onAnnotationStatusChange(annotation.id);
    } else {
      await toggleAnnotationStatus(annotation.id);
    }
  };

  const handleDeleteAnnotation = async (annotation: Annotation) => {
    setAnnotationToDelete(annotation);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!annotationToDelete) return;
    
    const success = await deleteAnnotation(annotationToDelete.id);
    if (success && selectedAnnotation?.id === annotationToDelete.id) {
      onAnnotationSelect(null);
    }
    setDeleteDialogOpen(false);
    setAnnotationToDelete(null);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setAnnotationToDelete(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-16 bottom-0 w-96 bg-white border-l border-gray-200 shadow-lg z-40 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-base-heading" />
          <h3 className="font-semibold text-base-heading">Annotations</h3>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
            {stats.open}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="p-4 border-b border-gray-200 bg-base-background">
        <div className="space-y-3">
          <div className="flex gap-2">
            {[
              { value: 'open', label: 'Open' },
              { value: 'resolved', label: 'Resolved' },
              { value: 'all', label: 'All' },
            ].map(({ value, label }) => (
              <Button
                key={value}
                variant={filters.status === value ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusFilter(value as 'all' | 'open' | 'resolved')}
                className="text-xs flex items-center gap-2"
              >
                {label}
                {stats[value as 'open' | 'resolved'] ? (
                  <span className="bg-gray-200 text-gray-600 px-1 rounded-full text-xs aspect-square flex shrink-0 items-center justify-center">
                    {stats[value as 'open' | 'resolved']}
                  </span>
                ) : null}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Annotations List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500">
            Loading annotations...
          </div>
        ) : filteredAnnotations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {filters.status !== 'all' ? 'No annotations match your search.' : 'No annotations yet.'}
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {filteredAnnotations.map((annotation) => (
              <AnnotationCard
                key={annotation.id}
                annotation={annotation}
                isSelected={selectedAnnotation?.id === annotation.id}
                onSelect={() => onAnnotationSelect(annotation)}
                onToggleStatus={() => handleToggleStatus(annotation)}
                onDelete={() => handleDeleteAnnotation(annotation)}
                onCreateReply={createReply}
                onDeleteReply={deleteReply}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={handleCloseDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this annotation?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="reset" variant="outline" onClick={handleCloseDeleteDialog}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" onClick={handleConfirmDelete}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}