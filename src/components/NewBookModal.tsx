import React, { useState, useEffect } from 'react';
import { X, ChevronDown, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Label } from './ui/label';
import Select from 'react-select';
import { useToast } from '../hooks/use-toast';

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

interface ValidationIssue {
  type: 'prohibited_content' | 'sensitive_data' | 'content_appropriateness' | 'ethical_consideration';
  description: string;
}

interface NewBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (book: any) => void;
}

export function NewBookModal({ isOpen, onClose, onSubmit }: NewBookModalProps) {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [issues, setIssues] = useState<ValidationIssue[] | null>(null);
  
  // Data states
  const [categories, setCategories] = useState<Category[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [narrators, setNarrators] = useState<Narrator[]>([]);
  const [literatureStyles, setLiteratureStyles] = useState<LiteratureStyle[]>([]);
  const [tones, setTones] = useState<Tone[]>([]);

  // Selection states
  const [selectedCategories, setSelectedCategories] = useState<Array<{ value: string; label: string; category: Category }>>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<{ value: string; label: string; language: Language } | null>(null);
  const [selectedNarrator, setSelectedNarrator] = useState<{ value: string; label: string; narrator: Narrator } | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<{ value: string; label: string; style: LiteratureStyle } | null>(null);
  const [selectedTone, setSelectedTone] = useState<{ value: string; label: string; tone: Tone } | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          categoriesResponse,
          languagesResponse,
          narratorsResponse,
          stylesResponse,
          tonesResponse
        ] = await Promise.all([
          supabase.from('categories').select('*').order('name'),
          supabase.from('languages').select('*').order('name'),
          supabase.from('narrators').select('*').order('name'),
          supabase.from('literature_styles').select('*').order('name'),
          supabase.from('tones').select('*').order('name')
        ]);

        if (categoriesResponse.error) throw categoriesResponse.error;
        if (languagesResponse.error) throw languagesResponse.error;
        if (narratorsResponse.error) throw narratorsResponse.error;
        if (stylesResponse.error) throw stylesResponse.error;
        if (tonesResponse.error) throw tonesResponse.error;

        setCategories(categoriesResponse.data);
        setLanguages(languagesResponse.data);
        setNarrators(narratorsResponse.data);
        setLiteratureStyles(stylesResponse.data);
        setTones(tonesResponse.data);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load form options",
        });
      }
    }

    if (isOpen) {
      fetchData();
    }
  }, [isOpen, toast]);

  const handleSubmit = async () => {
    if (!selectedLanguage) return;
    
    setIsSubmitting(true);
    setIssues(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session found');

      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('id', user.id)
        .single();
      
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
          author_name: profileData?.full_name || 'Anonymous'
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
      
      onSubmit(result.book);
      setPrompt('');
      setSelectedCategories([]);
      setSelectedLanguage(null);
      setSelectedNarrator(null);
      setSelectedStyle(null);
      setSelectedTone(null);
      setShowAdvanced(false);
      onClose();
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
        </div>

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
      </div>
    </div>
  );
}