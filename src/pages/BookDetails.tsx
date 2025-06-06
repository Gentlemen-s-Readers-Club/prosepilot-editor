import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Navigation } from '../components/Navigation';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { FileUpload } from '../components/ui/file-upload';
import { ChapterList } from '../components/ChapterList';
import { StatusBadge } from '../components/ui/status-badge';
import { useToast } from '../hooks/use-toast';
import { ArrowLeft, Trash2, Archive, Download, AlertCircle } from 'lucide-react';
import { CustomSelect, SelectOption, mapToSelectOptions } from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Status } from '../store/types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchCategories } from '../store/slices/categoriesSlice';
import { fetchLanguages } from '../store/slices/languagesSlice';

interface BookFormData {
  title: string;
  authorName: string;
  isbn: string;
  coverUrl: string;
  synopsis: string;
  categories: SelectOption[];
  language: SelectOption | null;
  status: Status;
}

export function BookDetails() {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { items: categories, status: categoriesStatus } = useSelector((state: RootState) => state.categories);
  const { items: languages, status: languagesStatus } = useSelector((state: RootState) => state.languages);


  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formErrors, setFormErrors] = useState({
    title: false,
    authorName: false,
    categories: false,
    language: false,
  });
  
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    authorName: '',
    isbn: '',
    coverUrl: '',
    synopsis: '',
    categories: [],
    language: null,
    status: 'draft'
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [bookData] = await Promise.all([
          supabase
            .from('books')
            .select(`
              *,
              languages (
                id,
                name
              ),
              book_categories (
                categories (
                  id,
                  name
                )
              )
            `)
            .eq('id', id)
            .single(),
          categoriesStatus === 'idle' ? dispatch(fetchCategories()).unwrap() : Promise.resolve(),
          languagesStatus === 'idle' ? dispatch(fetchLanguages()).unwrap() : Promise.resolve()
        ]);

        const { data: book, error: bookError } = bookData;
        if (bookError) throw bookError;

        // Transform book data for form
        setFormData({
          title: book.title,
          authorName: book.author_name,
          isbn: book.isbn || '',
          coverUrl: book.cover_url || '',
          synopsis: book.synopsis || '',
          status: book.status as Status,
          language: {
            value: book.languages.id,
            label: book.languages.name
          },
          categories: book.book_categories.map((bc: any) => ({
            value: bc.categories.id,
            label: bc.categories.name
          }))
        });
      } catch (err) {
        console.error('Error loading book details:', err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load book details",
        });
        navigate('/app');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, navigate, toast, categoriesStatus, languagesStatus, dispatch]);

  const handleFileSelect = async (file: File) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const fileExt = file.name.split('.').pop();
      const fileName = `${id}/cover.${fileExt}`;

      // Delete existing cover if any
      if (formData.coverUrl) {
        const oldFileName = formData.coverUrl.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('covers')
            .remove([`${id}/${oldFileName}`]);
        }
      }

      // Upload new cover
      const { error: uploadError } = await supabase.storage
        .from('covers')
        .upload(fileName, file, { 
          upsert: true,
          contentType: file.type 
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('covers')
        .getPublicUrl(fileName);

      // Update book cover URL in database
      const { error: updateError } = await supabase
        .from('books')
        .update({ cover_url: publicUrl })
        .eq('id', id);

      if (updateError) throw updateError;

      setFormData({ ...formData, coverUrl: publicUrl });
      
      toast({
        title: "Success",
        description: "Cover image updated successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload cover image",
      });
    }
  };

  const handleDeleteCover = async () => {
    try {
      if (formData.coverUrl) {
        const fileName = formData.coverUrl.split('/').pop();
        if (fileName) {
          // Delete file from storage
          const { error: deleteError } = await supabase.storage
            .from('covers')
            .remove([`${id}/${fileName}`]);

          if (deleteError) throw deleteError;
        }
      }

      // Update book cover URL in database
      const { error: updateError } = await supabase
        .from('books')
        .update({ cover_url: null })
        .eq('id', id);

      if (updateError) throw updateError;

      setFormData({ ...formData, coverUrl: '' });
      
      toast({
        title: "Success",
        description: "Cover image removed successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove cover image",
      });
    }
  };

  const validateForm = () => {
    const errors = {
      title: !formData.title.trim(),
      authorName: !formData.authorName.trim(),
      categories: formData.categories.length === 0,
      language: !formData.language,
    };
    setFormErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    try {
      // Update book details
      const { error: bookError } = await supabase
        .from('books')
        .update({
          title: formData.title,
          author_name: formData.authorName,
          isbn: formData.isbn || null,
          synopsis: formData.synopsis || null,
          language_id: formData.language?.value,
          status: formData.status
        })
        .eq('id', id);

      if (bookError) throw bookError;

      // Update categories
      const { error: deleteError } = await supabase
        .from('book_categories')
        .delete()
        .eq('book_id', id);

      if (deleteError) throw deleteError;

      if (formData.categories.length > 0) {
        const { error: categoriesError } = await supabase
          .from('book_categories')
          .insert(
            formData.categories.map(category => ({
              book_id: id,
              category_id: category.value
            }))
          );

        if (categoriesError) throw categoriesError;
      }

      toast({
        title: "Success",
        description: "Book details updated successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update book details",
      });
    }
  };

  const handleArchiveToggle = async () => {
    try {
      const newStatus = formData.status === 'archived' ? 'draft' : 'archived';
      
      const { error } = await supabase
        .from('books')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setFormData({ ...formData, status: newStatus });
      
      toast({
        title: "Success",
        description: `Book ${newStatus === 'archived' ? 'archived' : 'unarchived'} successfully`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${formData.status === 'archived' ? 'unarchive' : 'archive'} book`,
      });
    }
  };

  const handleDeleteBook = async () => {
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Book deleted successfully",
      });
      navigate('/app');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete book",
      });
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-[255px,1fr] gap-8">
              <div>
                <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-9 bg-gray-200 rounded"></div>
                  <div className="h-9 bg-gray-200 rounded"></div>
                  <div className="h-9 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="space-y-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
                  <div className="space-y-4">
                    <div className="h-9 bg-gray-200 rounded"></div>
                    <div className="h-9 bg-gray-200 rounded"></div>
                    <div className="h-9 bg-gray-200 rounded"></div>
                    <div className="h-32 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  const isPublished = formData.status === 'published';
  const hasError = formData.status === 'error';

  return (
    <div className="bg-background pt-16">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/app')}
          className="flex items-center text-primary hover:text-accent mb-6"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Books
        </button>

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
                  This book is published and cannot be edited. To make changes, you need to unpublish it first.
                </div>
              </div>
            </div>
          </div>
        )}

        {hasError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Generation Error
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  We apologize, but there was an error generating your book. Please be assured that no credits have been deducted from your account. You can try generating the book again, or contact our support team if the issue persists.
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-[255px,1fr] gap-8">
          <div className="space-y-6">
            <div className="max-w-[255px] sticky top-[88px]">
              <div className="mb-4">
                {formData.coverUrl ? (
                  <div className="relative">
                    <div className="aspect-[10/16] rounded-sm overflow-hidden shadow-lg">
                      <img
                        src={formData.coverUrl}
                        alt={formData.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {!isPublished && (
                      <button
                        onClick={handleDeleteCover}
                        className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                        title="Delete cover image"
                      >
                        <Trash2 className="w-5 h-5 text-danger" />
                      </button>
                    )}
                  </div>
                ) : (
                  <FileUpload 
                    onFileSelect={handleFileSelect} 
                    className={isPublished ? 'opacity-50 cursor-not-allowed' : ''}
                  />
                )}
              </div>

              <div className="space-y-2">
                <Button
                  onClick={() => {}}
                  variant="secondary"
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50"
                >
                  <Download className="w-4 h-4" />
                  Generate EPUB
                </Button>
                
                <Button
                  onClick={handleArchiveToggle}
                  variant="secondary"
                  className={`w-full flex items-center justify-center gap-2 ${
                    formData.status === 'archived'
                      && 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200'
                  }`}
                >
                  <Archive className="w-4 h-4" />
                  {formData.status === 'archived' ? 'Unarchive Book' : 'Archive Book'}
                </Button>

                <Button
                  onClick={() => setShowDeleteDialog(true)}
                  variant="destructive"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Book
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <h1 className="text-3xl font-bold text-primary">Book Details</h1>
                <StatusBadge status={formData.status} />
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title" className="flex items-center gap-1 mb-1 text-primary">
                    Book Title
                    <span className="text-danger">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      setFormErrors({ ...formErrors, title: false });
                    }}
                    className={`bg-card ${formErrors.title ? 'border-danger focus:ring-danger' : ''}`}
                    disabled={isPublished}
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-sm text-danger">Title is required</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="authorName" className="flex items-center gap-1 mb-1 text-primary">
                    Author Name
                    <span className="text-danger">*</span>
                  </Label>
                  <Input
                    id="authorName"
                    value={formData.authorName}
                    onChange={(e) => {
                      setFormData({ ...formData, authorName: e.target.value });
                      setFormErrors({ ...formErrors, authorName: false });
                    }}
                    className={`bg-card ${formErrors.authorName ? 'border-danger focus:ring-danger' : ''}`}
                    disabled={isPublished}
                  />
                  {formErrors.authorName && (
                    <p className="mt-1 text-sm text-danger">Author name is required</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="isbn" className="flex items-center gap-1 mb-1 text-primary">ISBN</Label>
                  <Input
                    id="isbn"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    className="bg-card"
                    placeholder="Enter ISBN (optional)"
                    disabled={isPublished}
                  />
                </div>

                <div>
                  <Label htmlFor="categories" className="flex items-center gap-1 mb-1 text-primary">
                    Categories
                    <span className="text-danger">*</span>
                  </Label>
                  <CustomSelect
                    id="categories"
                    isMulti
                    value={formData.categories}
                    onChange={(newValue) => {
                      setFormData({ ...formData, categories: newValue as SelectOption[] });
                      setFormErrors({ ...formErrors, categories: false });
                    }}
                    options={mapToSelectOptions(categories, 'category')}
                    placeholder="Select categories..."
                    isDisabled={isPublished}
                    error={formErrors.categories ? 'At least one category is required' : undefined}
                  />
                </div>

                <div>
                  <Label htmlFor="language" className="flex items-center gap-1 mb-1 text-primary">
                    Language
                    <span className="text-danger">*</span>
                  </Label>
                  <CustomSelect
                    id="language"
                    value={formData.language}
                    onChange={(newValue) => {
                      setFormData({ ...formData, language: newValue as SelectOption });
                      setFormErrors({ ...formErrors, language: false });
                    }}
                    options={mapToSelectOptions(languages, 'language')}
                    placeholder="Select language..."
                    isDisabled={isPublished}
                    error={formErrors.language ? 'Language is required' : undefined}
                  />
                </div>

                <div>
                  <Label htmlFor="synopsis" className="flex items-center gap-1 mb-1 text-primary">Synopsis</Label>
                  <textarea
                    id="synopsis"
                    value={formData.synopsis}
                    onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                    rows={4}
                    className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    disabled={isPublished}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isPublished}
                >
                  Save Changes
                </Button>
              </form>
            </div>

            <ChapterList bookId={id} isPublished={isPublished} />
          </div>
        </div>

        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Book</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{formData.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                className="bg-white hover:bg-gray-50 hover:text-gray-900 border-gray-200"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setShowDeleteDialog(false);
                  handleDeleteBook();
                }}
                className="bg-danger hover:bg-red-600 text-white"
              >
                Delete Book
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}