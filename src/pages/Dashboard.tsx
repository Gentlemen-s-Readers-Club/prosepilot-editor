import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search, ChevronDown, Users, User } from 'lucide-react';
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

  const { items: books, status: booksStatus } = useSelector((state: RootState) => state.books);
  const { items: categories, status: categoriesStatus } = useSelector((state: RootState) => state.categories);
  const { items: languages, status: languagesStatus } = useSelector((state: RootState) => state.languages);
  const { teams, status: teamsStatus } = useSelector((state: RootState) => state.teams);
  const { profile } = useSelector((state: RootState) => state.profile);

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

  // Filter books based on selected workspace
  const workspaceFilteredBooks = useMemo(() => {
    if (!selectedWorkspace) return books;

    if (selectedWorkspace.type === 'personal') {
      // Show personal books (no team_id)
      return books.filter((book: Book) => !book.team_id);
    } else {
      // Show team books for selected team
      return books.filter((book: Book) => book.team_id === selectedWorkspace.id);
    }
  }, [books, selectedWorkspace]);

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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-primary">My Library</h1>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus size={20} />
              Create New Book
            </Button>
          </div>

          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="w-72">
              <div className="space-y-6">
                {/* Workspace Selector */}
                <div className="bg-primary rounded-lg shadow p-6 text-white">
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

                {/* Filters */}
                <div className="bg-accent rounded-lg shadow p-6 text-white">
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
                          {categories.map((category: Category) => (
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
                          {languages.map((language: Language) => (
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
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col gap-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" size={20} />
                <Input
                  type="text"
                  placeholder="Search by title"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-gray-200 text-secondary focus:border-primary focus:ring-1 focus:ring-primary"
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
              ) : workspaceFilteredBooks.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No books in {selectedWorkspace?.name}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {selectedWorkspace?.type === 'personal' 
                      ? 'Create your first personal book to get started.'
                      : 'This team doesn\'t have any books yet. Create the first one!'
                    }
                  </p>
                  <Button onClick={() => setIsModalOpen(true)}>
                    Create Book
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
          />
        </div>
    </div>
  );
}