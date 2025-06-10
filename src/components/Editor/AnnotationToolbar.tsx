import React from 'react';
import { MessageSquare, Filter, Plus } from 'lucide-react';
import { Button } from '../ui/button';

interface AnnotationToolbarProps {
  annotationCount: number;
  openCount: number;
  onTogglePanel: () => void;
  onCreateAnnotation: () => void;
  isReadOnly?: boolean;
}

export function AnnotationToolbar({
  annotationCount,
  onTogglePanel,
  onCreateAnnotation,
  isReadOnly = false
}: AnnotationToolbarProps) {
  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 border rounded-lg">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-gray-700">Annotations</span>
        {annotationCount && (
        <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs aspect-square">
          {annotationCount}
        </span>
        )}
      </div>
      
      <div className="flex-1" />
      
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
    </div>
  );
}