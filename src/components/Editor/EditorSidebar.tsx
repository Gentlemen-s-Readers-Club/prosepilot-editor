import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, BookOpen, FileText, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { StatusBadge } from '../ui/status-badge';
import { NewContentModal } from '../NewContentModal';
import { useToast } from '../../hooks/use-toast';
import { supabase } from '../../lib/supabase';
import { Book } from '../../store/types';

interface EditorSidebarProps {
  book: Book;
  currentChapterId: string;
  isCollapsed: boolean;
  onToggle: () => void;
  isPublished?: boolean;
}

export function EditorSidebar({ book, currentChapterId, isCollapsed, onToggle, isPublished = false }: EditorSidebarProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const addNewItem = async (type: 'chapter' | 'page') => {
    try {
      const newOrder = book.chapters.length;
      const title = type === 'chapter' 
        ? `Chapter ${book.chapters.filter(c => c.type === 'chapter').length + 1}` 
        : 'New Page';

      const { data, error } = await supabase
        .from('chapters')
        .insert({
          book_id: book.id,
          title,
          order: newOrder,
          type
        })
        .select()
        .single();

      if (error) throw error;

      // Navigate to the new chapter
      navigate(`/app/chapter/${data.id}`);

      toast({
        title: "Success",
        description: `${type === 'chapter' ? 'Chapter' : 'Page'} created successfully`,
      });
    } catch (error) {
      console.error('Error creating chapter:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create chapter",
      });
    } finally {
      setShowAddDialog(false);
    }
  };

  return (
    <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-[50px]' : 'w-[300px]'
    }`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && <h2 className="font-semibold text-gray-900">Book Overview</h2>}
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto"
          onClick={onToggle}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      {!isCollapsed && (
        <>
          <div className="p-4 border-b border-gray-200">
            <div className="aspect-[10/16] rounded-lg overflow-hidden shadow-md mb-4 max-w-44 mx-auto">
              {book.cover_url ? (
                <img
                  src={book.cover_url}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{book.title}</h3>
            <StatusBadge status={book.status} />
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-500">Chapters & Pages</h4>
                {!isPublished && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setShowAddDialog(true)}
                  >
                    <Plus size={16} />
                  </Button>
                )}
              </div>
              <div className="space-y-1">
                {book.chapters.map((chapter) => (
                  <button
                    key={chapter.id}
                    onClick={() => navigate(`/app/chapter/${chapter.id}`)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                      chapter.id === currentChapterId
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {chapter.type === 'chapter' ? (
                      <BookOpen size={16} />
                    ) : (
                      <FileText size={16} />
                    )}
                    <span className="truncate text-left">{chapter.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <NewContentModal
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAdd={addNewItem}
      />
    </div>
  );
}