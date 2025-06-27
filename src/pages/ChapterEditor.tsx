import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { EnhancedEditor } from '../components/Editor/EnhancedEditor';
import { EditorSidebar } from '../components/Editor/EditorSidebar';
import { ChapterToolbar } from '../components/Editor/ChapterToolbar';
import { Button } from '../components/ui/button';
import { ArrowLeft, Loader2, AlertCircle, CreditCard } from 'lucide-react';
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
import { Book, Chapter } from '../store/types';
import { RootState } from '../store';
import { useSelector } from 'react-redux';
import { selectHasActiveSubscription } from '../store/slices/subscriptionSlice';

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
  const { session } = useSelector((state: RootState) => (state.auth));
  const hasActiveSubscription = useSelector(selectHasActiveSubscription);
  const [content, setContent] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [chapterTitle, setChapterTitle] = useState('');
  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [versions, setVersions] = useState<Version[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  // Determine if editor should be read-only based on published status and subscription
  const isReadOnly = isPublished || !hasActiveSubscription;

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        // First, get the chapter with book info
        const { data: chapter, error: chapterError } = await supabase
          .from('chapters')
          .select('*, books!inner(*)')
          .eq('id', id)
          .single();
  
        if (chapterError) throw chapterError;
        if (!chapter) throw new Error('Chapter not found');

        // Load versions, book details, and chapters in parallel
        const [versionsResult, bookResult, chaptersResult] = await Promise.all([
          supabase
            .from('chapter_versions')
            .select('*')
            .eq('chapter_id', id)
            .order('created_at', { ascending: false }),
          
          supabase
            .from('books')
            .select('*')
            .eq('id', chapter.book_id)
            .single(),
          
          supabase
            .from('chapters')
            .select('*')
            .eq('book_id', chapter.book_id)
            .order('order')
        ]);

        // Check for errors in parallel results
        if (versionsResult.error) throw versionsResult.error;
        if (bookResult.error) throw bookResult.error;
        if (chaptersResult.error) throw chaptersResult.error;
        if (!bookResult.data) throw new Error('Book not found');

        // Set state with results
        setBook(bookResult.data);
        setIsPublished(bookResult.data.status === 'published');
        setChapters(chaptersResult.data);

        const formattedVersions = versionsResult.data.map((v, i) => ({
          id: v.id,
          createdAt: v.created_at,
          content: v.content,
          isCurrent: i === 0
        }));
        setVersions(formattedVersions);

        setContent(versionsResult.data[0]?.content || '');
        setChapterTitle(chapter.title);
      } catch (error) {
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
  }, [id, navigate, toast]);

  const handleTitleChange = async (newTitle: string) => {
    if (!id || isReadOnly) return;

    try {
      const { error } = await supabase
        .from('chapters')
        .update({ title: newTitle })
        .eq('id', id);

      if (error) throw error;

      setChapterTitle(newTitle);
      
      if (chapters) {
        setChapters(chapters.map((chapter: Chapter) =>
          chapter.id === id
            ? { ...chapter, title: newTitle }
            : chapter
        ));
      }
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
    if (!id || isReadOnly) return;

    try {
      const { data: newVersion, error: versionError } = await supabase
        .from('chapter_versions')
        .insert({
          chapter_id: id,
          content: versionContent,
          created_by: session?.user.id
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
    } catch (error) {
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
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save content",
      });
    }
  };

  const handleRestoreVersion = async (version: Version) => {
    try {
      setIsLoading(true);
      await createNewVersion(version.content);
      setContent(version.content);
    } catch (error) {
      console.error('Error restoring version:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to restore version",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>ProsePilot{book?.title && book.title ? ` - ${book.title}: ${chapterTitle}` : ''}</title>
      </Helmet>
      <div className="h-[calc(100vh-64px)]">
        <div className="flex flex-1 h-full">
          {book && (
            <EditorSidebar
              book={book}
              chapters={chapters}
              currentChapterId={id || ''}
              isCollapsed={isSidebarCollapsed}
              onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              isPublished={isPublished}
              hasActiveSubscription={hasActiveSubscription}
            />
          )}
          
          <main className="flex-1 p-8 overflow-y-auto">
            <div>
            <div className="max-w-5xl mx-auto flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => navigate(`/workspace/book/${book?.id}`)}
                  className="flex items-center text-base-heading hover:text-base-heading/80"
                >
                  <ArrowLeft className="mr-2" size={20} />
                  Back to Book Details
                </button>
                  
                  {!isReadOnly && (
                    <Button onClick={handleSave}>Save Changes</Button>
                  )}
              </div>

              {isPublished && (
                <div className="mb-6 bg-state-success-light border border-state-success rounded-lg p-4">
                  <div className="flex">
                    <div className="shrink-0">
                      <AlertCircle className="h-5 w-5 text-state-success" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-state-success font-heading">
                        Published Book
                      </h3>
                      <div className="mt-2 text-sm text-state-success font-copy">
                        This chapter is part of a published book and cannot be edited. To make changes, the book needs to be unpublished first.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!hasActiveSubscription && !isPublished && (
                <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="shrink-0">
                      <CreditCard className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-800 font-heading">
                        Subscription Required
                      </h3>
                      <div className="mt-2 text-sm text-amber-700 font-copy">
                        You need an active subscription to edit chapters. Please subscribe to continue writing.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isLoading ? (
                <div className="bg-white rounded-lg shadow-lg p-6 flex-1">
                  <div className="h-[calc(100vh-300px)] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-8 h-8 text-base-heading animate-spin" />
                      <p className="text-gray-600 font-copy">Loading chapter content...</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  <ChapterToolbar
                    title={chapterTitle}
                    onTitleChange={handleTitleChange}
                    versions={versions}
                    onRestore={handleRestoreVersion}
                    readOnly={isReadOnly}
                  />
                  <div className="bg-white rounded-lg shadow-lg p-6 flex-1">
                    <EnhancedEditor
                      chapterId={id || ''}
                      chapterTitle={chapterTitle}
                      initialContent={content}
                      onChange={setContent}
                      readOnly={isReadOnly}
                    />
                  </div>
                </div>
              )}
            </div>
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
    </>
  );
}

export function ChapterEditor() {
  return (
      <ChapterProvider>
        <ChapterEditorContent />
      </ChapterProvider>
  );
}