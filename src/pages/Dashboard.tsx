import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search, ChevronDown, Users, User, BookOpen, Filter, Clock, Calendar, Bookmark, Sparkles, TrendingUp, LayoutGrid, List, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigation } from '../components/Navigation';
import { BookList } from '../components/BookList';
import { NewBookModal } from '../components/NewBookModal';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { toast } from '../hooks/use-toast';
import { fetchBooks } from '../store/slices/booksSlice';
import { fetchCategories } from '../store/slices/categoriesSlice';
import { fetchLanguages } from '../store/slices/languagesSlice';
import { fetchUserTeams } from '../store/slices/teamsSlice';
import { supabase } from '../lib/supabase';
import { AppDispatch, RootState } from '../store';
import type { Book, Category, Language, Team } from '../store/types';
import { BOOK_STATES } from '../lib/consts';

const BOOKS_PER_PAGE = 30;

interface WorkspaceOption {
  id: string;
  name: string;
  type: 'personal' | 'team';
  team?: Team;
}

export function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceOption | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const { items: books, status: booksStatus } = useSelector((state: RootState) => state.books);
  const { items: categories, status: categoriesStatus } = useSelector((state: RootState) => state.categories);
  const { items: languages, status: languagesStatus } = useSelector((state: RootState) => state.languages);
  const { teams, status: teamsStatus } = useSelector((state: RootState) => state.teams);
  const { profile } = useSelector((state: RootState) => state.profile);

  // Check if user has any teams
  const hasTeams = teams.length > 0;

  // Create workspace options
  const workspaceOptions: WorkspaceOption[] = useMemo(() => {
    const options: WorkspaceOption[] = [
      {
        id: 'personal',
        name: `Personal (${profile?.full_name || 'Me'})`,
        type: 'personal'
      }
    ];

    // Add team workspaces
    teams.forEach(team => {
      options.push({
        id: team.id,
        name: team.name,
        type: 'team',
        team
      });
    });

    return options;
  }, [teams, profile]);

  // Set default workspace to personal
  useEffect(() => {
    if (!selectedWorkspace && workspaceOptions.length > 0) {
      setSelectedWorkspace(workspaceOptions[0]);
    }
  }, [workspaceOptions, selectedWorkspace]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const promises = [];
        if (booksStatus === 'idle') {
          promises.push(dispatch(fetchBooks()).unwrap());
        }
        if (categoriesStatus === 'idle') {
          promises.push(dispatch(fetchCategories()).unwrap());
        }
        if (languagesStatus === 'idle') {
          promises.push(dispatch(fetchLanguages()).unwrap());
        }
        if (teamsStatus === 'idle') {
          promises.push(dispatch(fetchUserTeams()).unwrap());
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
    loadData();
  }, [dispatch, booksStatus, categoriesStatus, languagesStatus, teamsStatus]);

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
        () => {
          dispatch(fetchBooks());
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  // Filter books based on selected workspace (only if user has teams)
  const workspaceFilteredBooks = useMemo(() => {
    if (!hasTeams || !selectedWorkspace) return books;

    if (selectedWorkspace.type === 'personal') {
      // Show personal books (no team_id)
      return books.filter((book: Book) => !book.team_id);
    } else {
      // Show team books for selected team
      return books.filter((book: Book) => book.team_id === selectedWorkspace.id);
    }
  }, [books, selectedWorkspace, hasTeams]);

  const filteredBooks = useMemo(() => {
    return workspaceFilteredBooks.filter((book: Book) => {
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All Categories' || book.categories.some(cat => cat.name === selectedCategory);
      const matchesLanguage = selectedLanguage === 'All Languages' || book.languages.name === selectedLanguage;
      const matchesStatus = selectedStatus === 'All Statuses' || book.status === selectedStatus.toLowerCase();
      
      // Only show archived books if explicitly selected
      if (book.status === 'archived' && selectedStatus !== 'archived') {
        return false;
      }
      
      return matchesSearch && matchesCategory && matchesLanguage && matchesStatus;
    });
  }, [workspaceFilteredBooks, searchQuery, selectedCategory, selectedLanguage, selectedStatus]);

  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
    return filteredBooks.slice(startIndex, startIndex + BOOKS_PER_PAGE);
  }, [filteredBooks, currentPage]);

  const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedLanguage, selectedStatus, selectedWorkspace]);

  // Update active filters
  useEffect(() => {
    const filters = [];
    if (selectedCategory !== 'All Categories') filters.push(selectedCategory);
    if (selectedLanguage !== 'All Languages') filters.push(selectedLanguage);
    if (selectedStatus !== 'All Statuses') filters.push(selectedStatus);
    setActiveFilters(filters);
  }, [selectedCategory, selectedLanguage, selectedStatus]);

  const clearFilter = (filter: string) => {
    if (categories.some((c: Category) => c.name === filter)) {
      setSelectedCategory('All Categories');
    } else if (languages.some((l: Language) => l.name === filter)) {
      setSelectedLanguage('All Languages');
    } else if (BOOK_STATES.some(s => s === filter.toLowerCase())) {
      setSelectedStatus('All Statuses');
    }
  };

  const clearAllFilters = () => {
    setSelectedCategory('All Categories');
    setSelectedLanguage('All Languages');
    setSelectedStatus('All Statuses');
    setSearchQuery('');
  };

  if (loading || booksStatus === 'loading') {
    return (
      <div className="bg-background pt-16 min-h-screen">
        <Navigation />
        <div className="h-full">
          <div className="max-w-[1600px] mx-auto px-6 py-8">
            <div className="animate-pulse">
              <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
              <div className="flex gap-8">
                <div className="w-72 bg-gray-200 rounded-lg shrink-0 h-[500px]"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 flex-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div key={n} className="aspect-[2/3] bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <Navigation />
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Header with Stats */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-primary">My Library</h1>
              <p className="text-gray-600 mt-1">Manage and organize your writing projects</p>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white shadow-md transition-all hover:shadow-lg"
            >
              <Plus size={20} />
              Create New Book
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Books</p>
                  <p className="text-2xl font-bold text-gray-900">{books.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Sparkles className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Published</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {books.filter(b => b.status === 'published').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="bg-amber-100 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {books.filter(b => ['draft', 'writing', 'reviewing'].includes(b.status)).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Recent Activity</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {books.filter(b => new Date(b.updated_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-72 lg:shrink-0">
            <div className="space-y-6">
              {/* Workspace Selector - Only show if user has teams */}
              {hasTeams && (
                <div className="bg-primary rounded-lg shadow-md p-6 text-white">
                  <h2 className="text-lg font-semibold mb-4">Workspace</h2>
                  <div className="relative">
                    <select
                      value={selectedWorkspace?.id || ''}
                      onChange={(e) => {
                        const workspace = workspaceOptions.find(w => w.id === e.target.value);
                        setSelectedWorkspace(workspace || null);
                      }}
                      className="flex h-10 w-full rounded-md border-0 bg-white/10 px-3 py-1 text-sm text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/20 appearance-none cursor-pointer pr-8"
                    >
                      {workspaceOptions.map((workspace) => (
                        <option key={workspace.id} value={workspace.id} className="text-gray-900">
                          {workspace.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white pointer-events-none" size={16} />
                  </div>
                  
                  {/* Workspace Info */}
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <div className="flex items-center gap-2 text-sm">
                      {selectedWorkspace?.type === 'personal' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Users className="w-4 h-4" />
                      )}
                      <span className="opacity-90">
                        {selectedWorkspace?.type === 'personal' 
                          ? 'Personal workspace' 
                          : `Team workspace • ${selectedWorkspace?.team?.user_role || 'Member'}`
                        }
                      </span>
                    </div>
                    <div className="text-sm opacity-75 mt-1">
                      {workspaceFilteredBooks.length} book{workspaceFilteredBooks.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              )}

              {/* Filters */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
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
                    <label className="block text-sm font-medium mb-2 text-gray-700">Category</label>
                    <div className="relative">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="flex h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer pr-8"
                      >
                        <option className="text-gray-900">All Categories</option>
                        {categories.map((category: Category) => (
                          <option key={category.id} className="text-gray-900">{category.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Language</label>
                    <div className="relative">
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="flex h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer pr-8"
                      >
                        <option className="text-gray-900">All Languages</option>
                        {languages.map((language: Language) => (
                          <option key={language.id} className="text-gray-900">{language.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Status</label>
                    <div className="relative">
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="flex h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer pr-8"
                      >
                        <option className="text-gray-900">All Statuses</option>
                        {BOOK_STATES.map(state => (
                          <option key={state} className="capitalize text-gray-900">{state}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Filters</h3>
                    <div className="space-y-2">
                      <button 
                        onClick={() => setSelectedStatus('published')}
                        className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100"
                      >
                        <Bookmark className="w-4 h-4 text-green-600" />
                        <span>Published Books</span>
                      </button>
                      <button 
                        onClick={() => setSelectedStatus('writing')}
                        className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100"
                      >
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span>In Progress</span>
                      </button>
                      <button 
                        onClick={() => setSelectedStatus('draft')}
                        className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100"
                      >
                        <Bookmark className="w-4 h-4 text-amber-600" />
                        <span>Drafts</span>
                      </button>
                      <button 
                        onClick={() => setSelectedStatus('archived')}
                        className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100"
                      >
                        <Bookmark className="w-4 h-4 text-gray-600" />
                        <span>Archived</span>
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
                    className="pl-10 bg-white border-gray-200 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-700'}
                  >
                    <LayoutGrid size={18} />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-700'}
                  >
                    <List size={18} />
                  </Button>
                </div>
              </div>

              {/* Active Filters */}
              {activeFilters.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Active filters:</span>
                  {activeFilters.map(filter => (
                    <div 
                      key={filter} 
                      className="flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs"
                    >
                      <span>{filter}</span>
                      <button 
                        onClick={() => clearFilter(filter)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={clearAllFilters}
                    className="text-xs text-primary hover:text-primary/80"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
            
            {books.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="flex flex-col items-center">
                  <div className="bg-primary/10 rounded-full p-4 mb-4">
                    <BookOpen className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No books yet</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Start your writing journey by creating your first book. Our AI will help you transform your ideas into compelling stories.
                  </p>
                  <Button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Book
                  </Button>
                </div>
              </div>
            ) : hasTeams && workspaceFilteredBooks.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="flex flex-col items-center">
                  <div className="bg-primary/10 rounded-full p-4 mb-4">
                    <BookOpen className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    No books in {selectedWorkspace?.name}
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {selectedWorkspace?.type === 'personal' 
                      ? 'Create your first personal book to get started.'
                      : 'This team doesn\'t have any books yet. Create the first one!'
                    }
                  </p>
                  <Button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Book
                  </Button>
                </div>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="flex flex-col items-center">
                  <div className="bg-gray-100 rounded-full p-4 mb-4">
                    <Search className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No books found</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    We couldn't find any books matching your current filters. Try adjusting your search criteria or clear the filters to see all books.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={clearAllFilters}
                  >
                    Clear All Filters
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 flex-1">
                <BookList
                  books={paginatedBooks}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  viewMode={viewMode}
                />
              </div>
            )}
          </div>
        </div>
        
        <NewBookModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
        />
      </div>
    </div>
  );
}