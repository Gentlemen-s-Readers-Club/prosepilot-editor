import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Plus, Search, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Navigation } from '../components/Navigation';
import { BookList } from '../components/BookList';
import { NewBookModal } from '../components/NewBookModal';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import { type Status } from '../components/ui/status-badge';

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

  useEffect(() => {
    async function fetchData() {
      try {
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

  useEffect(() => {
    // Subscribe to real-time changes
    const subscription = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'books'
        },
        async (payload) => {
          console.log('Change received!', payload);

          // Fetch the updated book data with related information
          const { data: updatedBooks, error } = await supabase
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

          if (!error && updatedBooks) {
            const formattedBooks = updatedBooks.map(book => ({
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
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

  const handleNewBook = async (book: Book) => {
    try {
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

      toast({
        title: "Success",
        description: "Book created successfully",
      });
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
            }}
            onSubmit={handleNewBook}
          />
        </div>
    </div>
  );
}