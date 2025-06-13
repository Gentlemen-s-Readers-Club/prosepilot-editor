import React from 'react';
import { MessageSquare, Filter, Plus, Eye, Edit } from 'lucide-react';
import { Button } from '../ui/button';

interface AnnotationToolbarProps {
  mode: 'edit' | 'comments';
  annotationCount: number;
  openCount: number;
  onModeChange: (mode: 'edit' | 'comments') => void;
  onTogglePanel: () => void;
  onCreateAnnotation: () => void;
  isReadOnly?: boolean;
}

export function AnnotationToolbar({
  mode,
  annotationCount,
  onModeChange,
  onTogglePanel,
  onCreateAnnotation,
  isReadOnly = false
}: AnnotationToolbarProps) {
  return (
    <div className="flex items-center gap-2 border rounded-lg justify-between">
      <div className="flex">
        <Button
          variant={mode === 'edit' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onModeChange('edit')}
          className="flex items-center gap-2 rounded-r-none"
        >
          {isReadOnly ? (
            <>
              <Eye className="w-4 h-4" />
              View
            </>
          ) : (
            <>
              <Edit className="w-4 h-4" />
              Edit
            </>
          )}
        </Button>
        <Button
          variant={mode === 'comments' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onModeChange('comments')}
          className="flex items-center gap-2 rounded-none"
        >
          <MessageSquare className="w-4 h-4" />
          Annotations
          {annotationCount > 0 && (
            <span className="bg-gray-200 text-gray-600 px-2 rounded-full text-xs aspect-square flex items-center justify-center">
              {annotationCount}
            </span>
          )}
        </Button>
      </div>
      {mode === 'comments' && (
        <div className="flex items-center gap-1">
          {!isReadOnly && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCreateAnnotation}
              className="text-gray-600 hover:text-gray-900"
              title="Create annotation (Ctrl+Shift+A)"
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onTogglePanel}
            className="text-gray-600 hover:text-gray-900"
            title="Toggle annotation panel (Ctrl+Shift+P)"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}