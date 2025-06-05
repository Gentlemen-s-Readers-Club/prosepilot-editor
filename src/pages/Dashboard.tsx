import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search, ChevronDown, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Navigation } from '../components/Navigation';
import { BookList } from '../components/BookList';
import { NewBookModal } from '../components/NewBookModal';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import { type Status } from '../components/ui/status-badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

interface Book {
  id: string;
  title: string;
  coverUrl: string | null;
  state: Status;
  category: string;
  language: string;
}

interface Category {
  id: string;
  name: string;
}

interface Language {
  id: string;
  name: string;
  code: string;
}

interface Narrator {
  id: string;
  name: string;
}

interface LiteratureStyle {
  id: string;
  name: string;
}

interface Tone {
  id: string;
  name: string;
}

interface Profile {
  id: string;
  full_name: string;
}

interface ValidationIssue {
  type: string;
  message: string;
}

const BOOK_STATES: Status[] = ['writing', 'draft', 'reviewing', 'published', 'archived', 'error'];
const BOOKS_PER_PAGE = 30;

export function Dashboard() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [categories, setCategories] = useState<Category[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Get user profile
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, full_name')
            .eq('id', user.id)
            .single();
          
          if (profileData) {
            setProfile(profileData);
          }
        }

        // Fetch categories and languages
        const [categoriesResponse, languagesResponse] = await Promise.all([
          supabase.from('categories').select('*').order('name'),
          supabase.from('languages').select('*').order('name')
        ]);

        if (categoriesResponse.error) throw categoriesResponse.error;
        if (languagesResponse.error) throw languagesResponse.error;

        setCategories(categoriesResponse.data);
        setLanguages(languagesResponse.data);

        // Fetch user's books with related data
        const { data: booksData, error: booksError } = await supabase
          .from('books')
          .select(`
            id,
            title,
            cover_url,
            status,
            languages (name),
            book_categories (
              categories (name)
            )
          `)
          .order('updated_at', { ascending: false });

        if (booksError) throw booksError;

        const formattedBooks = booksData.map(book => ({
          id: book.id,
          title: book.title,
          coverUrl: book.cover_url,
          state: book.status as Status,
          category: book.book_categories
            .map((bc: any) => bc.categories.name)
            .join(', '),
          language: book.languages.name
        }));

        setBooks(formattedBooks);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load data",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [toast]);

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All Categories' || book.category.includes(selectedCategory);
      const matchesLanguage = selectedLanguage === 'All Languages' || book.language === selectedLanguage;
      const matchesStatus = selectedStatus === 'All Statuses' || book.state === selectedStatus.toLowerCase();
      
      // Only show archived books if explicitly selected
      if (book.state === 'archived' && selectedStatus !== 'archived') {
        return false;
      }
      
      return matchesSearch && matchesCategory && matchesLanguage && matchesStatus;
    });
  }, [books, searchQuery, selectedCategory, selectedLanguage, selectedStatus]);

  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
    return filteredBooks.slice(startIndex, startIndex + BOOKS_PER_PAGE);
  }, [filteredBooks, currentPage]);

  const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedLanguage, selectedStatus]);

  const handleNewBook = async ({ 
    prompt, 
    categories, 
    language,
    narrator,
    literatureStyle,
    tone 
  }: { 
    prompt: string; 
    categories: Category[]; 
    language: Language;
    narrator?: Narrator;
    literatureStyle?: LiteratureStyle;
    tone?: Tone;
  }) => {
    try {
      if (!profile) {
        throw new Error('User profile not found');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session found');

      // Call the API to generate the book
      const response = await fetch(`${import.meta.env.VITE_API_URL}/generate-book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          prompt,
          language,
          categories,
          narrator,
          tone,
          literature_style: literatureStyle,
          author_name: profile.full_name
        })
      });

      const result = await response.json();

      if (!result.is_valid) {
        setValidationIssues(result.issues || null);
        return result;
      }

      if (!result.book) {
        throw new Error('No book data received');
      }

      // Create the book in Supabase
      const { data: book, error: bookError } = await supabase
        .from('books')
        .insert({
          title: result.book.title,
          author_name: result.book.author_name,
          synopsis: result.book.synopsis,
          status: result.book.status,
          language_id: result.book.language_id,
          user_id: user.id,
          narrator_id: result.book.narrator_id,
          tone_id: result.book.tone_id,
          literature_style_id: result.book.literature_style_id
        })
        .select()
        .single();

      if (bookError) throw bookError;

      // Add categories
      if (categories.length > 0) {
        const categoryLinks = categories.map(category => ({
          book_id: book.id,
          category_id: category.id
        }));

        const { error: categoriesError } = await supabase
          .from('book_categories')
          .insert(categoryLinks);

        if (categoriesError) throw categoriesError;
      }

      // Refresh books list
      const { data: updatedBook, error: fetchError } = await supabase
        .from('books')
        .select(`
          id,
          title,
          cover_url,
          status,
          languages (name),
          book_categories (
            categories (name)
          )
        `)
        .eq('id', book.id)
        .single();

      if (fetchError) throw fetchError;

      const newBook = {
        id: updatedBook.id,
        title: updatedBook.title,
        coverUrl: updatedBook.cover_url,
        state: updatedBook.status as Status,
        category: updatedBook.book_categories
          .map((bc: any) => bc.categories.name)
          .join(', '),
        language: updatedBook.languages.name
      };

      setBooks(prevBooks => [newBook, ...prevBooks]);

      toast({
        title: "Success",
        description: "Book created successfully",
      });

      return result;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create book",
      });
      throw error;
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="h-full">
          <div className="max-w-[1600px] mx-auto px-6 py-8">
            <div className="animate-pulse">
              <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="aspect-[2/3] bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="bg-background pt-16">
      <Navigation />
        <div className="max-w-[1600px] mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-[#31606D]">My Library</h1>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus size={20} />
              Create New Book
            </Button>
          </div>

          <div className="flex gap-8">
            {/* Filters */}
            <div className="w-72">
              <div className="bg-[#4F9EBC] rounded-lg shadow p-6 text-white">
                <h2 className="text-lg font-semibold mb-6">Filters</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <div className="relative">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="flex h-9 w-full rounded-md border-0 bg-white/10 px-3 py-1 text-sm text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/20 appearance-none cursor-pointer pr-8"
                      >
                        <option className="text-gray-900">All Categories</option>
                        {categories.map(category => (
                          <option key={category.id} className="text-gray-900">{category.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white pointer-events-none" size={16} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Language</label>
                    <div className="relative">
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="flex h-9 w-full rounded-md border-0 bg-white/10 px-3 py-1 text-sm text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/20 appearance-none cursor-pointer pr-8"
                      >
                        <option className="text-gray-900">All Languages</option>
                        {languages.map(language => (
                          <option key={language.id} className="text-gray-900">{language.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white pointer-events-none" size={16} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <div className="relative">
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="flex h-9 w-full rounded-md border-0 bg-white/10 px-3 py-1 text-sm text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/20 appearance-none cursor-pointer pr-8"
                      >
                        <option className="text-gray-900">All Statuses</option>
                        {BOOK_STATES.map(state => (
                          <option key={state} className="capitalize text-gray-900">{state}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white pointer-events-none" size={16} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col gap-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search by title"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                />
              </div>
              
              {books.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No books yet</h3>
                  <p className="text-gray-500 mb-6">Start your writing journey by creating your first book.</p>
                  <Button onClick={() => setIsModalOpen(true)}>
                    Create Your First Book
                  </Button>
                </div>
              ) : (
                <BookList
                  books={paginatedBooks}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>
          </div>
          
          <NewBookModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setValidationIssues(null);
            }}
            onSubmit={handleNewBook}
          />

          <Dialog 
            open={!!validationIssues} 
            onOpenChange={() => setValidationIssues(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Validation Issues</DialogTitle>
                <DialogDescription>
                  The following issues need to be addressed:
                </DialogDescription>
              </DialogHeader>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <div className="mt-2 text-sm text-red-700">
                      <ul className="list-disc pl-5 space-y-1">
                        {validationIssues?.map((issue, index) => (
                          <li key={index}>{issue.message}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setValidationIssues(null)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
    </div>
  );
}