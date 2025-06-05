import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, FileEdit, ExternalLink, Trash2, FileText, Pencil, BookOpen } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface Chapter {
  id: string;
  title: string;
  order: number;
  type: 'chapter' | 'page';
}

interface Props {
  chapter: Chapter;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (title: string) => void;
  onCancel: () => void;
  onNavigate: () => void;
  onDelete: () => void;
  disabled?: boolean;
}

export function SortableChapter({ 
  chapter, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onNavigate,
  onDelete,
  disabled = false
}: Props) {
  const [editedTitle, setEditedTitle] = useState(chapter.title);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: chapter.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (isEditing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200"
      >
        <div className="cursor-move text-gray-400" {...attributes} {...listeners}>
          <GripVertical size={20} />
        </div>
        <Input
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          className="flex-1"
          autoFocus
        />
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => onSave(editedTitle)}
          >
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200 hover:bg-gray-50 group"
    >
      {!disabled && (
        <div className="cursor-move text-gray-400" {...attributes} {...listeners}>
          <GripVertical size={20} />
        </div>
      )}
      <div className="text-gray-400">
        {chapter.type === 'chapter' ? (
          <BookOpen size={20} />
        ) : (
          <FileText size={20} />
        )}
      </div>
      <span className="flex-1 font-medium text-gray-700">
        {chapter.title}
      </span>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {!disabled && (
          <button
            onClick={onEdit}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
            title="Rename"
          >
            <Pencil size={16} />
          </button>
        )}
        <button
          onClick={onNavigate}
          className="p-1 text-gray-400 hover:text-blue-600 rounded-md hover:bg-gray-100"
          title={disabled ? "View content" : "Edit content"}
        >
          <FileEdit size={16} />
        </button>
        
        {!disabled && (
          <button
            onClick={onDelete}
            className="p-1 text-gray-400 hover:text-red-600 rounded-md hover:bg-gray-100"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}