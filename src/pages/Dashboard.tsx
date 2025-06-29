import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search, BookOpen, Filter, Clock, Bookmark, LayoutGrid, List, X, Pencil, Archive, Rocket, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { BookList } from '../components/BookList';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { toast } from '../hooks/use-toast';
import { fetchBooks, updateBookInList } from '../store/slices/booksSlice';
import { fetchCategories } from '../store/slices/categoriesSlice';
import { fetchLanguages } from '../store/slices/languagesSlice';
import { hasProOrStudioPlan, hasStudioPlan, selectHasActiveSubscription } from '../store/slices/subscriptionSlice';
import { supabase } from '../lib/supabase';
import { AppDispatch, RootState } from '../store';
import type { Book, Category, Language, Status } from '../store/types';
import { BOOK_STATES } from '../lib/consts';
import { CustomSelect, SelectOption } from '../components/ui/select';
import { NewBookDrawer } from '../components/NewBookDrawer';
import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';
import { NoCreditsModal } from '../components/NoCreditsModal';
import { SubscriptionModal } from '../components/SubscriptionModal';

const BOOKS_PER_PAGE = 30;

type SortField = 'title' | 'created_at' | 'updated_at' | 'status' | 'author_name';
type SortDirection = 'asc' | 'desc';

interface SortOption {
  field: SortField;
  direction: SortDirection;
  label: string;
}

const sortOptions: SortOption[] = [
  { field: 'updated_at', direction: 'desc', label: 'Recently Updated' },
  { field: 'created_at', direction: 'desc', label: 'Recently Created' },
  { field: 'title', direction: 'asc', label: 'Title A-Z' },
  { field: 'title', direction: 'desc', label: 'Title Z-A' },
  { field: 'author_name', direction: 'asc', label: 'Author A-Z' },
  { field: 'author_name', direction: 'desc', label: 'Author Z-A' },
  { field: 'status', direction: 'asc', label: 'Status' },
];

export function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();

  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showNewBookDrawer, setShowNewBookDrawer] = useState(false);
  const [showNoCreditsModal, setShowNoCreditsModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>(sortOptions[0]);

  // Redux state
  const { session } = useSelector((state: RootState) => state.auth);
  const { status: subscriptionStatus } = useSelector((state: RootState) => state.subscription);
  const { balance: {current_balance} } = useSelector((state: RootState) => state.userCredits);
  const { items: books, status: booksStatus } = useSelector((state: RootState) => state.books);
  const { items: categories, status: categoriesStatus } = useSelector((state: RootState) => state.categories);
  const { items: languages, status: languagesStatus } = useSelector((state: RootState) => state.languages);

  // Selectors
  const hasStudio = useSelector(hasStudioPlan);
  const hasPro = useSelector(hasProOrStudioPlan);
  const hasActiveSubscription = useSelector(selectHasActiveSubscription);

  // Book creation credits
  const BOOK_CREATION_CREDITS = 5;

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const promises = [];
        if (booksStatus === 'idle') {
          promises.push(dispatch(fetchBooks()).unwrap());
        }
        if (categoriesStatus === 'idle') {
          promises.push(dispatch(fetchCategories({
            isPro: hasPro
          })).unwrap());
        }
        if (languagesStatus === 'idle') {
          promises.push(dispatch(fetchLanguages()).unwrap());
        }

        await Promise.all(promises);
      } catch(error) {
        console.error('Error loading data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load data",
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (subscriptionStatus === 'success') {
      loadData();
    }
  }, [dispatch, booksStatus, categoriesStatus, languagesStatus, hasStudio, hasPro, subscriptionStatus]);

  // Show subscription modal if user doesn't have an active subscription
  useEffect(() => {
    if (subscriptionStatus === 'success' && !hasActiveSubscription && !loading) {
      // Check if user has dismissed the modal in the last 24 hours
      const dismissedAt = localStorage.getItem('subscription_modal_dismissed');
      if (dismissedAt) {
        const dismissedTime = new Date(dismissedAt).getTime();
        const now = new Date().getTime();
        const hoursSinceDismissed = (now - dismissedTime) / (1000 * 60 * 60);
        
        if (hoursSinceDismissed < 24) {
          return; // Don't show modal if dismissed less than 24 hours ago
        }
      }
      
      setShowSubscriptionModal(true);
    }
  }, [subscriptionStatus, hasActiveSubscription, loading]);

  // Handle modal dismissal
  const handleSubscriptionModalClose = () => {
    setShowSubscriptionModal(false);
    // Store dismissal time in localStorage for 24 hours
    localStorage.setItem('subscription_modal_dismissed', new Date().toISOString());
  };

  // Handle URL parameters for subscription checkout success/cancel
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get("success");
    const cancelled = urlParams.get("cancelled");

    if (success === "true") {
      toast({
        title: "Success!",
        description: "Your subscription has been activated successfully.",
      });
      setShowSubscriptionModal(false);
      // Clean up URL
      window.history.replaceState({}, "", window.location.pathname);
    } else if (cancelled === "true") {
      toast({
        title: "Cancelled",
        description: "Your checkout was cancelled.",
        variant: "destructive",
      });
      setShowSubscriptionModal(false);
      // Clean up URL
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  // Subscribe to real-time changes
  useEffect(() => {
    if (session) {
      const subscription = supabase
        .channel('book-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'books',
            // filter: `user_id=eq.${session.user.id}`,
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              dispatch(fetchBooks());
            }
            if (payload.eventType === 'UPDATE') {
              dispatch(updateBookInList({
                bookId: payload.new.id,
                updates: payload.new,
              }));
            }
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [dispatch, session]);

  const filteredBooks = useMemo(() => {
    return books.filter((book: Book) => {
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === '' || book.categories.some(cat => cat.id === selectedCategory);
      const matchesLanguage = selectedLanguage === '' || book.languages.id === selectedLanguage;
      const matchesStatus = selectedStatus === '' || book.status === selectedStatus;
      
      // Only show archived books if explicitly selected
      if (book.status === 'archived' && selectedStatus !== 'archived') {
        return false;
      }
      
      return matchesSearch && matchesCategory && matchesLanguage && matchesStatus;
    });
  }, [books, searchQuery, selectedCategory, selectedLanguage, selectedStatus]);

  // Sort books
  const sortedBooks = useMemo(() => {
    const sorted = [...filteredBooks].sort((a: Book, b: Book) => {
      let aValue: string | number | Date = a[sortBy.field];
      let bValue: string | number | Date = b[sortBy.field];

      // Handle date fields
      if (sortBy.field === 'created_at' || sortBy.field === 'updated_at') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // Handle string fields
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortBy.direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return sorted;
  }, [filteredBooks, sortBy]);

  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
    return sortedBooks.slice(startIndex, startIndex + BOOKS_PER_PAGE);
  }, [sortedBooks, currentPage]);

  const totalPages = Math.ceil(sortedBooks.length / BOOKS_PER_PAGE);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedLanguage, selectedStatus, sortBy]);

  // Update active filters
  useEffect(() => {
    const filters = [];
    if (selectedCategory !== '') filters.push(categories.find(category => category.id === selectedCategory)?.name || '');
    if (selectedLanguage !== '') filters.push(languages.find(language => language.id === selectedLanguage)?.name || '');
    if (selectedStatus !== '') filters.push(BOOK_STATES[selectedStatus as Status] || '');
    setActiveFilters(filters);
  }, [categories, languages, selectedCategory, selectedLanguage, selectedStatus]);

  const clearFilter = (filter: string) => {
    if (categories.some((c: Category) => c.name === filter)) {
      setSelectedCategory('');
    } else if (languages.some((l: Language) => l.name === filter)) {
      setSelectedLanguage('');
    } else if (Object.values(BOOK_STATES).includes(filter)) {
      setSelectedStatus('');
    }
  };

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedLanguage('');
    setSelectedStatus('');
    setSearchQuery('');
  };

  const getSortIcon = () => {
    if (sortBy.direction === 'asc') {
      return <ArrowUp className="w-4 h-4" />;
    } else {
      return <ArrowDown className="w-4 h-4" />;
    }
  };

  const openCreateModal = async () => {
    // If user doesn't have an active subscription, show subscription modal
    if (!hasActiveSubscription) {
      setShowSubscriptionModal(true);
      return;
    }

    if (current_balance < BOOK_CREATION_CREDITS) {
      setShowNoCreditsModal(true);
      return;
    }

    setShowNewBookDrawer(true);
  };

  if (loading || booksStatus === 'loading') {
    return (
      <div className="h-full">
        <div className="max-w-[1600px] mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="h-20 w-full lg:h-8 lg:w-48 bg-gray-200 rounded mb-8"></div>
            <div className="flex gap-8 flex-col lg:flex-row">
              <div className="w-full lg:w-72 bg-gray-200 rounded-lg shrink-0 h-[500px]"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 flex-1">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="aspect-[2/3] bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>ProsePilot - Dashboard</title>
      </Helmet>
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Header with Stats */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-base-heading font-heading">My Library</h1>
              <p className="text-base-paragraph mt-1 font-copy">Manage and organize your writing projects</p>
            </div>
            <Button
              className="flex items-center gap-2"
              onClick={openCreateModal}
            >
              <Plus size={20} />
              Create New Book
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-72 lg:shrink-0">
            <div className="space-y-6">
              {/* Filters */}
              <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
                <div className="flex items-center justify-between lg:mb-4">
                  <h2 className="text-lg font-bold text-base-heading font-heading">Filters</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden"
                  >
                    {showFilters ? <X size={18} /> : <Filter size={18} />}
                  </Button>
                </div>
                
                <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-base-heading font-copy">Category</label>
                    <CustomSelect
                      value={{
                        value: selectedCategory,
                        label: categories.find(category => category.id === selectedCategory)?.name || 'All Categories'
                      }}
                      onChange={(newValue) => {setSelectedCategory((newValue as SelectOption).value)}}
                      options={[
                        { value: '', label: 'All Categories' },
                        ...categories.map((category: Category) => ({
                          value: category.id,
                          label: category.name
                        }))
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-base-heading font-copy">Language</label>
                    <CustomSelect
                      value={{
                        value: selectedLanguage,
                        label: languages.find(language => language.id === selectedLanguage)?.name || 'All Languages'
                      }}
                      onChange={(newValue) => {setSelectedLanguage((newValue as SelectOption).value)}}
                      options={[
                        { value: '', label: 'All Languages' },
                        ...languages.map((language: Language) => ({
                          value: language.id,
                          label: language.name
                        }))
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-base-heading font-copy">Status</label>
                    <CustomSelect
                      value={{
                        value: selectedStatus,
                        label: BOOK_STATES[selectedStatus as Status] || 'All Statuses'
                      }}
                      onChange={(newValue) => {setSelectedStatus((newValue as SelectOption).value)}}
                      options={[
                        { value: '', label: 'All Statuses' },
                        ...Object.keys(BOOK_STATES).map((state: string) => ({
                          value: state,
                          label: BOOK_STATES[state as Status]
                        }))
                      ]}
                    />
                  </div>

                  {/* Quick Links */}
                  <div className="pt-4 border-t border-brand-accent">
                    <h3 className="text-sm font-semibold text-base-heading mb-3 font-heading">Quick Filters</h3>
                    <div className="space-y-2">
                      <button 
                        onClick={() => setSelectedStatus('published')}
                        className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-base-paragraph rounded-md hover:bg-base-background"
                      >
                        <Rocket className="w-4 h-4 text-brand-accent" />
                        <span className="font-copy">Published Books</span>
                      </button>
                      <button 
                        onClick={() => setSelectedStatus('writing')}
                        className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-base-paragraph rounded-md hover:bg-base-background"
                      >
                        <Clock className="w-4 h-4 text-brand-accent" />
                        <span className="font-copy">In Progress</span>
                      </button>
                      <button 
                        onClick={() => setSelectedStatus('draft')}
                        className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-base-paragraph rounded-md hover:bg-base-background"
                      >
                        <Bookmark className="w-4 h-4 text-brand-accent" />
                        <span className="font-copy">Drafts</span>
                      </button>
                      <button 
                        onClick={() => setSelectedStatus('reviewing')}
                        className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-base-paragraph rounded-md hover:bg-base-background"
                      >
                        <Pencil className="w-4 h-4 text-brand-accent" />
                        <span className="font-copy">Reviewing</span>
                      </button>
                      <button 
                        onClick={() => setSelectedStatus('archived')}
                        className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-base-paragraph rounded-md hover:bg-base-background"
                      >
                        <Archive className="w-4 h-4 text-brand-accent" />
                        <span className="font-copy">Archived</span>
                      </button>
                    </div>
                  </div>

                  {/* Clear Filters Button */}
                  {activeFilters.length > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={clearAllFilters}
                      className="w-full mt-2"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Search and View Controls */}
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type="text"
                    placeholder="Search by title"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white border-gray-200 text-gray-900 focus-visible:border-base-border focus-visible:ring-1 focus-visible:ring-brand-primary"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Sort Dropdown */}
                  <div className="relative">
                    <CustomSelect
                      value={{
                        value: `${sortBy.field}-${sortBy.direction}`,
                        label: sortBy.label
                      }}
                      onChange={(newValue) => {
                        const option = sortOptions.find(opt => 
                          `${opt.field}-${opt.direction}` === (newValue as SelectOption).value
                        );
                        if (option) {
                          setSortBy(option);
                        }
                      }}
                      options={sortOptions.map(option => ({
                        value: `${option.field}-${option.direction}`,
                        label: option.label
                      }))}
                    />
                  </div>

                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={viewMode === 'grid' ? 'bg-brand-primary text-white' : 'text-base-heading'}
                  >
                    <LayoutGrid size={18} />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={viewMode === 'list' ? 'bg-brand-primary text-white' : 'text-base-heading'}
                  >
                    <List size={18} />
                  </Button>
                </div>
              </div>

              {/* Active Filters */}
              {activeFilters.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500 font-copy">Active filters:</span>
                  {activeFilters.map(filter => (
                    <div 
                      key={filter} 
                      className="flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs"
                    >
                      <span className="font-copy">{filter}</span>
                      <button 
                        onClick={() => clearFilter(filter)}
                        className="text-gray-500 hover:text-base-heading"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={clearAllFilters}
                    className="text-xs text-base-heading hover:text-base-heading/80 font-copy"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {/* Sort Info */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ArrowUpDown className="w-4 h-4" />
                  <span className="font-copy">Sorted by {sortBy.label}</span>
                  {getSortIcon()}
                </div>
                <div className="text-sm text-gray-500 font-copy">
                  {sortedBooks.length} book{sortedBooks.length !== 1 ? 's' : ''} found
                </div>
              </div>
            </div>
            
            {books.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="flex flex-col items-center">
                  <div className="bg-base-background rounded-full p-4 mb-4">
                    <BookOpen className="w-12 h-12 text-base-heading" />
                  </div>
                  <h3 className="text-lg font-bold text-base-heading mb-2 font-heading">No books yet</h3>
                  <p className="text-base-paragraph max-w-md mb-6 font-copy">
                    Start your writing journey by creating your first book. Our AI will help you transform your ideas into compelling stories.
                  </p>
                  <Button 
                    className="bg-brand-primary hover:bg-brand-primary/90 text-white"
                    onClick={() => {
                      if (!hasActiveSubscription) {
                        setShowSubscriptionModal(true);
                      } else {
                        openCreateModal();
                      }
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Book
                  </Button>
                </div>
              </div>
            ) : sortedBooks.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="flex flex-col items-center">
                  <div className="bg-base-background rounded-full p-4 mb-4">
                    <Search className="w-12 h-12 text-base-heading" />
                  </div>
                  <h3 className="text-lg font-medium text-base-heading mb-2 font-heading">No books found</h3>
                  <p className="text-base-paragraph max-w-md mb-6 font-copy">
                    We couldn't find any books matching your current filters. Try adjusting your search criteria or clear the filters to see all books.
                  </p>
                  <Button onClick={clearAllFilters}>
                    Clear All Filters
                  </Button>
                </div>
              </div>
            ) : (
                <BookList
                  books={paginatedBooks}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  viewMode={viewMode}
                />
            )}
          </div>
        </div>
      </div>

      <NewBookDrawer
        isOpen={showNewBookDrawer}
        onClose={() => setShowNewBookDrawer(false)}
      />

      <NoCreditsModal
        isOpen={showNoCreditsModal}
        onClose={() => setShowNoCreditsModal(false)}
        requiredCredits={BOOK_CREATION_CREDITS}
        action="create a book"
      />

      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={handleSubscriptionModalClose}
      />

      {/* Footer */}
      <Footer />
    </>
  );
}