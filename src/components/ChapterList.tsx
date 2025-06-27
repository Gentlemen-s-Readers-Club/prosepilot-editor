import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableChapter } from './SortableChapter';
import { Button } from './ui/button';
import { Plus, FileText, Loader2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../lib/supabase';
import { NewContentModal } from './NewContentModal';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface Chapter {
  id: string;
  title: string;
  order: number;
  type: 'chapter' | 'page';
}

interface ChapterListProps {
  bookId: string;
  isPublished?: boolean;
}

export function ChapterList({ bookId, isPublished = false }: ChapterListProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [chapterToDelete, setChapterToDelete] = useState<Chapter | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('chapters')
          .select('*')
          .eq('book_id', bookId)
          .order('order');
  
        if (error) throw error;
  
        setChapters(data);
      } catch (err) {
        console.error('Error fetching chapters:', err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load chapters",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookId, toast]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = chapters.findIndex((item) => item.id === active.id);
      const newIndex = chapters.findIndex((item) => item.id === over.id);
      
      const reorderedChapters = arrayMove(chapters, oldIndex, newIndex).map(
        (item, index) => ({ ...item, order: index })
      );

      setChapters(reorderedChapters);

      try {
        const updates = reorderedChapters.map((chapter) => ({
          ...chapter,
          order: chapter.order
        }));

        const { error } = await supabase
          .from('chapters')
          .upsert(updates);

        if (error) throw error;
      } catch (error) {
        console.error('Error updating chapter:', error);
        toast({
          title: "Error",
          description: "Failed to update chapter",
        });
      }
    }
  };

  const addNewItem = async (type: 'chapter' | 'page') => {
    try {
      const newOrder = chapters.length;
      const title = type === 'chapter' 
        ? `Chapter ${chapters.filter(c => c.type === 'chapter').length + 1}` 
        : 'New Page';

      const { data, error } = await supabase
        .from('chapters')
        .insert({
          book_id: bookId,
          title,
          order: newOrder,
          type
        })
        .select()
        .single();

      if (error) throw error;

      setChapters([...chapters, data]);
      setEditingId(data.id);
      setShowAddDialog(false);

      toast({
        title: "Success",
        description: `${type === 'chapter' ? 'Chapter' : 'Page'} created successfully`,
      });
    } catch (error) {
      console.error('Error creating chapter:', error);
      toast({
        title: "Error",
        description: "Failed to create chapter",
      });
    }
  };

  const updateChapterTitle = async (id: string, newTitle: string) => {
    try {
      const { error } = await supabase
        .from('chapters')
        .update({ title: newTitle })
        .eq('id', id);

      if (error) throw error;

      setChapters(chapters.map(chapter => 
        chapter.id === id ? { ...chapter, title: newTitle } : chapter
      ));
    } catch (error) {
      console.error('Error updating chapter title:', error);
      toast({
        title: "Error",
        description: "Failed to update chapter title",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (chapterToDelete) {
      try {
        const { error } = await supabase
          .from('chapters')
          .delete()
          .eq('id', chapterToDelete.id);

        if (error) throw error;

        setChapters(chapters.filter(chapter => chapter.id !== chapterToDelete.id));
      } catch (error) {
        console.error('Error deleting chapter:', error);
        toast({
          title: "Error",
          description: "Failed to delete chapter",
        });
      } finally {
        setChapterToDelete(null);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-base-heading font-heading">Book Content</h2>
        {!isPublished && (
          <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
            <Plus size={16} />
            Add New
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-base-heading animate-spin" />
            <p className="text-gray-600 font-copy">Loading chapters...</p>
          </div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={chapters}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {chapters.map((chapter) => (
                <SortableChapter
                  key={chapter.id}
                  chapter={chapter}
                  isEditing={editingId === chapter.id}
                  onEdit={() => setEditingId(chapter.id)}
                  onSave={(title) => {
                    updateChapterTitle(chapter.id, title);
                    setEditingId(null);
                  }}
                  onCancel={() => setEditingId(null)}
                  onNavigate={() => navigate(`/workspace/chapter/${chapter.id}`)}
                  onDelete={() => setChapterToDelete(chapter)}
                  disabled={isPublished}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {chapters.length === 0 && !isPublished && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <FileText className="w-8 h-8 text-brand-accent" />
          </div>
          <h3 className="text-lg font-medium text-base-heading font-heading mb-2">No chapters yet</h3>
          <p className="text-base-paragraph font-copy mb-4">
            Create your first chapter to get started with your book.
          </p>
          <Button onClick={() => setShowAddDialog(true)}>
            Add Your First Chapter
          </Button>
        </div>
      )}

      <NewContentModal
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAdd={addNewItem}
      />

      <Dialog open={!!chapterToDelete} onOpenChange={() => setChapterToDelete(null)}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="font-heading">Delete {chapterToDelete?.type === 'chapter' ? 'Chapter' : 'Page'}</DialogTitle>
            <DialogDescription className="font-copy">
              Are you sure you want to delete "{chapterToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setChapterToDelete(null)}
              className="bg-white hover:bg-gray-50 hover:text-gray-900 border-gray-200"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              className="bg-state-error hover:bg-red-600 text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}