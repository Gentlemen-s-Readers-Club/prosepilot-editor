import React from 'react';
import { MessageSquare, Filter, Download, Plus, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/button';
import { Annotation } from '../../types/annotations';

interface AnnotationToolbarProps {
  annotationCount: number;
  openCount: number;
  resolvedCount: number;
  showAnnotations: boolean;
  onToggleAnnotations: () => void;
  onTogglePanel: () => void;
  onCreateAnnotation: () => void;
  onExportAnnotations: () => void;
  isReadOnly?: boolean;
}

export function AnnotationToolbar({
  annotationCount,
  openCount,
  resolvedCount,
  showAnnotations,
  onToggleAnnotations,
  onTogglePanel,
  onCreateAnnotation,
  onExportAnnotations,
  isReadOnly = false
}: AnnotationToolbarProps) {
  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 border rounded-lg">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-gray-700">Annotations</span>
        <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
          {annotationCount}
        </span>
      </div>
      
      <div className="h-4 w-px bg-gray-300" />
      
      <div className="flex items-center gap-1 text-xs text-gray-600">
        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
          Open: {openCount}
        </span>
        <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
          Resolved: {resolvedCount}
        </span>
      </div>
      
      <div className="flex-1" />
      
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleAnnotations}
          className="text-gray-600 hover:text-gray-900"
          title={showAnnotations ? 'Hide annotations' : 'Show annotations'}
        >
          {showAnnotations ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
        
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
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onExportAnnotations}
          className="text-gray-600 hover:text-gray-900"
          title="Export annotations"
        >
          <Download className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}