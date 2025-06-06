import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, BookOpen, Loader2 } from 'lucide-react';
import { StatusBadge, type Status } from './ui/status-badge';
import { Button } from './ui/button';
import { supabase } from '../lib/supabase';
import { useEffect } from 'react';

interface Book {
  id: string;
  title: string;
  coverUrl: string | null;
  state: Status;
  category: string;
  language: string;
}

interface BookListProps {
  books: Book[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onBooksUpdate: (books: Book[]) => void;
}

export function BookList({ books, currentPage, totalPages, onPageChange, onBooksUpdate }: BookListProps) {
  const navigate = useNavigate();

  useEffect(() => {
    // Subscribe to real-time changes
    const subscription = supabase
      .channel('books_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'books'
        },
        async (payload) => {
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
            onBooksUpdate(formattedBooks);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [onBooksUpdate]);

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            currentPage === i
              ? 'bg-[#2D626D] text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-gray-100 rounded-full p-4 mb-4">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
        <p className="text-gray-500 max-w-md mb-6">
          We couldn't find any books matching your current filters. Try adjusting your search criteria or clear the filters to see all books.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {books.map((book) => (
          <div
            key={book.id}
            onClick={() => book.state !== 'writing' && navigate(`/app/book/${book.id}`)}
            className={`group ${book.state !== 'writing' ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <div className="relative aspect-[10/16] rounded-sm overflow-hidden">
              <div className="absolute top-2 left-2 z-10">
                <StatusBadge status={book.state} />
              </div>
              {book.coverUrl ? (
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center p-4 transition-colors group-hover:bg-gray-200">
                  {book.state === 'writing' ? (
                    <Loader2 className="w-12 h-12 text-gray-400 animate-spin" />
                  ) : (
                    <BookOpen className="w-12 h-12 text-gray-400 mb-4" />
                  )}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-lg font-semibold text-white mb-1">{book.title}</h3>
                <div className="space-y-1">
                  <p className="text-sm text-white/90">{book.category}</p>
                  <p className="text-sm text-white/80">{book.language}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="secondary"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {currentPage > 3 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                1
              </button>
              {currentPage > 4 && (
                <span className="text-gray-500">...</span>
              )}
            </>
          )}

          {renderPageNumbers()}

          {currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && (
                <span className="text-gray-500">...</span>
              )}
              <button
                onClick={() => onPageChange(totalPages)}
                className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                {totalPages}
              </button>
            </>
          )}

          <Button
            variant="secondary"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}