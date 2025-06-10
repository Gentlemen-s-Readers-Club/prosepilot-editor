import React, { useState } from 'react';
import { 
  MessageSquare, 
  Filter,
  X,
  CheckCircle,
  Circle,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Annotation } from '../../types/annotations';
import { useAnnotations } from '../../hooks/useAnnotations';
import { AnnotationCard } from './AnnotationCard';

interface AnnotationPanelProps {
  chapterId: string;
  isOpen: boolean;
  onClose: () => void;
  selectedAnnotation?: Annotation | null;
  onAnnotationSelect: (annotation: Annotation | null) => void;
}

export function AnnotationPanel({ 
  chapterId, 
  isOpen, 
  onClose, 
  selectedAnnotation,
  onAnnotationSelect,
}: AnnotationPanelProps) {
  const { 
    annotations, 
    loading, 
    filters, 
    setFilters, 
    toggleAnnotationStatus,
    deleteAnnotation,
    getAnnotationStats 
  } = useAnnotations(chapterId);
  
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const stats = getAnnotationStats();

  const filteredAnnotations = annotations.filter(annotation => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        annotation.content.toLowerCase().includes(query) ||
        annotation.selected_text.toLowerCase().includes(query) ||
        annotation.user?.full_name.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const handleStatusFilter = (status: 'all' | 'open' | 'resolved') => {
    setFilters({ ...filters, status });
  };

  const handleToggleStatus = async (annotation: Annotation) => {
    await toggleAnnotationStatus(annotation.id);
  };

  const handleDeleteAnnotation = async (annotation: Annotation) => {
    if (window.confirm('Are you sure you want to delete this annotation?')) {
      const success = await deleteAnnotation(annotation.id);
      if (success && selectedAnnotation?.id === annotation.id) {
        onAnnotationSelect(null);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-16 bottom-0 w-96 bg-white border-l border-gray-200 shadow-lg z-40 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-primary">Annotations</h3>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
            {stats.total}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Filter className="w-4 h-4" />
          </Button>
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

      {/* Stats */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Circle className="w-3 h-3 text-yellow-600" />
              <span className="text-gray-600">Open: {stats.open}</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-600" />
              <span className="text-gray-600">Resolved: {stats.resolved}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <Input
                type="text"
                placeholder="Search annotations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <div className="flex gap-2">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'open', label: 'Open' },
                  { value: 'resolved', label: 'Resolved' }
                ].map(({ value, label }) => (
                  <Button
                    key={value}
                    variant={filters.status === value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusFilter(value as 'all' | 'open' | 'resolved')}
                    className="text-xs"
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Annotations List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500">
            Loading annotations...
          </div>
        ) : filteredAnnotations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchQuery ? 'No annotations match your search.' : 'No annotations yet.'}
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
                chapterId={chapterId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}