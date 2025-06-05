import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { Editor } from '../components/Editor';
import { EditorSidebar } from '../components/Editor/EditorSidebar';
import { ChapterToolbar } from '../components/Editor/ChapterToolbar';
import { Button } from '../components/ui/button';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../lib/supabase';
import { ChapterProvider } from '../contexts/ChapterContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

interface Version {
  id: string;
  createdAt: string;
  content: string;
  isCurrent?: boolean;
}

function ChapterEditorContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [chapterTitle, setChapterTitle] = useState('');
  const [book, setBook] = useState<any>(null);
  const [versions, setVersions] = useState<Version[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const { data: chapter, error: chapterError } = await supabase
          .from('chapters')
          .select('*, books!inner(*)')
          .eq('id', id)
          .single();

        if (chapterError) throw chapterError;
        if (!chapter) throw new Error('Chapter not found');

        setIsPublished(chapter.books.status === 'published');

        const { data: bookData, error: bookError } = await supabase
          .from('books')
          .select(`
            *,
            chapters (
              id,
              title,
              type,
              "order"
            )
          `)
          .eq('id', chapter.book_id)
          .single();

        if (bookError) throw bookError;
        if (!bookData) throw new Error('Book not found');

        const { data: versionsData, error: versionsError } = await supabase
          .from('chapter_versions')
          .select('*')
          .eq('chapter_id', id)
          .order('created_at', { ascending: false });

        if (versionsError) throw versionsError;

        setBook(bookData);

        const formattedVersions = versionsData.map((v, i) => ({
          id: v.id,
          createdAt: v.created_at,
          content: v.content,
          isCurrent: i === 0
        }));
        setVersions(formattedVersions);

        setContent(versionsData[0]?.content || '');
        setChapterTitle(chapter.title);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load chapter data",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, toast]);

  const handleTitleChange = async (newTitle: string) => {
    if (!id || isPublished) return;

    try {
      const { error } = await supabase
        .from('chapters')
        .update({ title: newTitle })
        .eq('id', id);

      if (error) throw error;

      setChapterTitle(newTitle);
      
      if (book) {
        setBook({
          ...book,
          chapters: book.chapters.map((chapter: any) =>
            chapter.id === id
              ? { ...chapter, title: newTitle }
              : chapter
          )
        });
      }

      toast({
        title: "Success",
        description: "Chapter title updated successfully",
      });
    } catch (error) {
      console.error('Error updating chapter title:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update chapter title",
      });
    }
  };

  const createNewVersion = async (versionContent: string) => {
    if (!id) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data: newVersion, error: versionError } = await supabase
        .from('chapter_versions')
        .insert({
          chapter_id: id,
          content: versionContent,
          created_by: user.id
        })
        .select()
        .single();

      if (versionError) throw versionError;

      setVersions(prev => [{
        id: newVersion.id,
        createdAt: newVersion.created_at,
        content: newVersion.content,
        isCurrent: true
      }, ...prev.map(v => ({ ...v, isCurrent: false }))]);

      toast({
        title: "Success",
        description: "New version created successfully",
      });
    } catch (error: any) {
      console.error('Error creating version:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    setShowSaveDialog(true);
  };

  const confirmSave = async () => {
    try {
      await createNewVersion(content);
      setShowSaveDialog(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save content",
      });
    }
  };

  const handleRestoreVersion = async (version: Version) => {
    try {
      await createNewVersion(version.content);
      setContent(version.content);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to restore version",
      });
    }
  };

  return (
    <div className="h-screen bg-background pt-16">
      <Navigation />
      <div className="flex flex-1 h-full">
        {book && (
          <EditorSidebar
            book={book}
            currentChapterId={id || ''}
            isCollapsed={isSidebarCollapsed}
            onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            isPublished={isPublished}
          />
        )}
        
        <main className="flex-1 p-8 bg-background overflow-y-auto">
          <div className="max-w-5xl mx-auto flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigate(`/app/book/${book?.id}`)}
                className="flex items-center text-textblue hover:text-accent"
              >
                <ArrowLeft className="mr-2" size={20} />
                Back to Book Details
              </button>
              {!isPublished && (
                <Button onClick={handleSave}>Save Changes</Button>
              )}
            </div>

            {isPublished && (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <div className="shrink-0">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Published Book
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      This chapter is part of a published book and cannot be edited. To make changes, the book needs to be unpublished first.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="bg-white rounded-lg shadow-lg p-6 flex-1">
                <div className="h-[calc(100vh-300px)] flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-[#2D626D] animate-spin" />
                    <p className="text-gray-600">Loading chapter content...</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <ChapterToolbar
                  title={chapterTitle}
                  onTitleChange={handleTitleChange}
                  versions={versions}
                  onRestore={handleRestoreVersion}
                  isPublished={isPublished}
                />
                <div className="bg-white rounded-lg shadow-lg p-6 flex-1">
                  <Editor
                    key={id}
                    initialContent={content}
                    onChange={setContent}
                    readOnly={isPublished}
                  />
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Changes</DialogTitle>
            <DialogDescription>
              This will create a new version of your chapter. Previous versions will still be available in the version history.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmSave}>
              Save New Version
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function ChapterEditor() {
  return (
    <ChapterProvider>
      <ChapterEditorContent />
    </ChapterProvider>
  );
}