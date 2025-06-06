import React, { useState, useEffect } from 'react';
import { X, ChevronDown, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Label } from './ui/label';
import Select from 'react-select';
import { useToast } from '../hooks/use-toast';
import { AppDispatch, RootState } from '../store';
import type { Category, Language, Tone, Narrator, LiteratureStyle } from '../store/types';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTones } from '../store/slices/tonesSlice';
import { fetchNarrators } from '../store/slices/narratorsSlice';
import { fetchLiteratureStyles } from '../store/slices/literatureStylesSlice';

interface ValidationIssue {
  type: 'prohibited_content' | 'sensitive_data' | 'content_appropriateness' | 'ethical_consideration';
  description: string;
}

interface NewBookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewBookModal({ isOpen, onClose }: NewBookModalProps) {
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const [prompt, setPrompt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [issues, setIssues] = useState<ValidationIssue[] | null>(null);
  
  // Get form options from Redux store
  const { items: categories } = useSelector((state: RootState) => state.categories);
  const { items: languages } = useSelector((state: RootState) => state.languages);
  const { items: tones, status: tonesStatus } = useSelector((state: RootState) => state.tones);
  const { items: narrators, status: narratorsStatus } = useSelector((state: RootState) => state.narrators);
  const { items: literatureStyles, status: literatureStylesStatus } = useSelector((state: RootState) => state.literatureStyles);
  const { profile } = useSelector((state: RootState) => state.profile);

  // Selection states
  const [selectedCategories, setSelectedCategories] = useState<Array<{ value: string; label: string; category: Category }>>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<{ value: string; label: string; language: Language } | null>(null);
  const [selectedNarrator, setSelectedNarrator] = useState<{ value: string; label: string; narrator: Narrator } | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<{ value: string; label: string; style: LiteratureStyle } | null>(null);
  const [selectedTone, setSelectedTone] = useState<{ value: string; label: string; tone: Tone } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const promises = [];
        if (tonesStatus === 'idle') {
          promises.push(dispatch(fetchTones()).unwrap());
        }
        if (narratorsStatus === 'idle') {
          promises.push(dispatch(fetchNarrators()).unwrap());
        }
        if (literatureStylesStatus === 'idle') {
          promises.push(dispatch(fetchLiteratureStyles()).unwrap());
        }

        await Promise.all(promises);
      } catch(error) {
        console.error('Error loading data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load data",
        });
        onClose();
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadData();
    } else  {
      setPrompt('');
      setSelectedCategories([]);
      setSelectedLanguage(null);
      setSelectedNarrator(null);
      setSelectedStyle(null);
      setSelectedTone(null);
      setShowAdvanced(false);
    }
  }, [dispatch, isOpen, tonesStatus, narratorsStatus, literatureStylesStatus, toast, onClose]);

  const handleSubmit = async () => {
    if (!selectedLanguage) return;
    
    setIsSubmitting(true);
    setIssues(null);

    try {
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
          language: selectedLanguage.language,
          categories: selectedCategories.map(c => c.category),
          narrator: selectedNarrator?.narrator,
          tone: selectedTone?.tone,
          literatureStyle: selectedStyle?.style,
          author_name: profile?.full_name || 'Anonymous'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create book. Please try again.');
      }

      const result = await response.json();

      if (!result.is_valid) {
        setIssues(result.issues || null);
        setIsSubmitting(false);
        return result;
      } else if (!result.book) {
        throw new Error('No book data received');
      }

      onClose();

      toast({
        title: "Success",
        description: "Book created successfully",
      });
    } catch (error) {
      console.error('Error creating book:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create book. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const mapToOptions = (items: { id: string; name: string }[], type: string) => 
    items.map(item => ({
      value: item.id,
      label: item.name,
      [type]: item
    }));

  
    if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 my-8 flex flex-col max-h-[calc(100vh-4rem)]">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-[#31606D]">Start a New Book</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading...</span>
          </div>
          ) : (
            <div className="space-y-6">
              {issues && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                      <h3 className="text-sm font-medium text-red-800 ml-3">
                        Content Policy Violation
                      </h3>
                    </div>
                    <div className="ml-3">
                      <div className="mt-2 text-sm text-red-700">
                        <ul className="list-disc pl-5 space-y-2">
                          {issues.map((issue, index) => (
                            <li key={index}>{issue.description}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="prompt">Story Idea or Outline</Label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your story idea or outline..."
                  className="w-full h-32 p-3 border rounded-md focus:ring-2 focus:ring-[#2D626D] focus:border-transparent resize-none text-gray-700 placeholder:text-gray-400"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categories">Categories</Label>
                <Select
                  id="categories"
                  isMulti
                  value={selectedCategories}
                  onChange={(newValue) => setSelectedCategories(newValue as Array<{ value: string; label: string; category: Category }>)}
                  options={mapToOptions(categories, 'category')}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Select categories..."
                  isDisabled={isSubmitting}
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary: '#2D626D',
                      primary25: '#EBFAFD',
                    },
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  id="language"
                  value={selectedLanguage}
                  onChange={(newValue) => setSelectedLanguage(newValue as { value: string; label: string; language: Language })}
                  options={mapToOptions(languages, 'language')}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Select language..."
                  isDisabled={isSubmitting}
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary: '#2D626D',
                      primary25: '#EBFAFD',
                    },
                  })}
                />
              </div>

              <div className="border-t pt-4">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center justify-between w-full text-left text-sm font-medium text-[#2D626D] hover:text-[#2D626D]/80"
                  disabled={isSubmitting}
                >
                  Advanced Settings
                  <ChevronDown
                    size={16}
                    className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
                  />
                </button>

                {showAdvanced && (
                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="narrator">Narrator Perspective</Label>
                      <Select
                        id="narrator"
                        value={selectedNarrator}
                        onChange={(newValue) => setSelectedNarrator(newValue as { value: string; label: string; narrator: Narrator })}
                        options={mapToOptions(narrators, 'narrator')}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        placeholder="Select narrator perspective..."
                        isDisabled={isSubmitting}
                        theme={(theme) => ({
                          ...theme,
                          colors: {
                            ...theme.colors,
                            primary: '#2D626D',
                            primary25: '#EBFAFD',
                          },
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="style">Literature Style</Label>
                      <Select
                        id="style"
                        value={selectedStyle}
                        onChange={(newValue) => setSelectedStyle(newValue as { value: string; label: string; style: LiteratureStyle })}
                        options={mapToOptions(literatureStyles, 'style')}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        placeholder="Select literature style..."
                        isDisabled={isSubmitting}
                        theme={(theme) => ({
                          ...theme,
                          colors: {
                            ...theme.colors,
                            primary: '#2D626D',
                            primary25: '#EBFAFD',
                          },
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tone">Writing Tone</Label>
                      <Select
                        id="tone"
                        value={selectedTone}
                        onChange={(newValue) => setSelectedTone(newValue as { value: string; label: string; tone: Tone })}
                        options={mapToOptions(tones, 'tone')}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        placeholder="Select writing tone..."
                        isDisabled={isSubmitting}
                        theme={(theme) => ({
                          ...theme,
                          colors: {
                            ...theme.colors,
                            primary: '#2D626D',
                            primary25: '#EBFAFD',
                          },
                        })}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {!loading && (
          <div className="border-t p-4 bg-white">
          <div className="flex justify-end gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !prompt || !selectedLanguage || selectedCategories.length === 0}
            >
              {isSubmitting ? 'Creating Book...' : 'Create Book'}
            </Button>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}