import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, BookOpen, Loader2, Calendar, Clock, User, MoreVertical } from 'lucide-react';
import { StatusBadge } from './ui/status-badge';
import { Book } from '../store/types';
import { Button } from './ui/button';
import { formatDistanceToNow } from 'date-fns';

interface BookListProps {
  books: Book[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  viewMode: 'grid' | 'list';
}

export function BookList({ books, currentPage, totalPages, onPageChange, viewMode }: BookListProps) {
  const navigate = useNavigate();

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

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
              ? 'bg-brand-primary text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="space-y-8">
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              onClick={() => book.status !== 'writing' && navigate(`/app/book/${book.id}`)}
              className={`group ${book.status !== 'writing' ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div className="relative aspect-[10/16] rounded-lg overflow-hidden bg-gray-100 shadow-md group-hover:shadow-xl transition-all duration-300">
                <div className="absolute top-2 left-2 z-10">
                  <StatusBadge status={book.status} />
                </div>
                {book.cover_url ? (
                  <img
                    src={book.cover_url}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col items-center justify-center p-4 transition-colors group-hover:bg-gray-200">
                    {book.status === 'writing' ? (
                      <Loader2 className="w-12 h-12 text-gray-400 animate-spin" />
                    ) : (
                      <BookOpen className="w-12 h-12 text-gray-400 mb-4" />
                    )}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">{book.title}</h3>
                  <div className="space-y-1">
                    <p className="text-sm text-white/90 line-clamp-1">{book.categories.map(bc => bc.name).join(', ')}</p>
                    <p className="text-sm text-white/80">{book.languages.name}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {books.map((book) => (
            <div
              key={book.id}
              onClick={() => book.status !== 'writing' && navigate(`/app/book/${book.id}`)}
              className={`group bg-white border border-gray-200 rounded-lg p-4 flex gap-4 transition-shadow hover:shadow-md ${
                book.status !== 'writing' ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <div className="relative h-32 w-20 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                {book.cover_url ? (
                  <img
                    src={book.cover_url}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center">
                    {book.status === 'writing' ? (
                      <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                    ) : (
                      <BookOpen className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-base-heading transition-colors">{book.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={book.status} />
                      <span className="text-sm text-gray-500">{book.languages.name}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical size={16} />
                  </Button>
                </div>
                
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {book.synopsis || `A ${book.categories.map(bc => bc.name.toLowerCase()).join(', ')} book written in ${book.languages.name}.`}
                </p>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    <span>{book.author_name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>Created {formatDistanceToNow(new Date(book.created_at), { addSuffix: true })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>Updated {formatDistanceToNow(new Date(book.updated_at), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
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