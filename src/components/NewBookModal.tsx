import React, { useState, useEffect } from 'react';
import { X, ChevronDown, AlertCircle, Loader2, BookOpen, Lightbulb, Sparkles, Globe, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { CustomSelect, SelectOption, mapToSelectOptions } from './ui/select';
import { useToast } from '../hooks/use-toast';
import { AppDispatch, RootState } from '../store';
import type { Category, Language, Tone, Narrator, LiteratureStyle, Team } from '../store/types';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTones } from '../store/slices/tonesSlice';
import { fetchNarrators } from '../store/slices/narratorsSlice';
import { fetchLiteratureStyles } from '../store/slices/literatureStylesSlice';
import { fetchUserTeams } from '../store/slices/teamsSlice';

interface ValidationIssue {
  type: 'prohibited_content' | 'sensitive_data' | 'content_appropriateness' | 'ethical_consideration';
  description: string;
}

interface NewBookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OwnerOption extends SelectOption {
  type: 'user' | 'team';
  team?: Team;
}

export function NewBookModal({ isOpen, onClose }: NewBookModalProps) {
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const [prompt, setPrompt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [issues, setIssues] = useState<ValidationIssue[] | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [promptCharCount, setPromptCharCount] = useState(0);
  
  // Get form options from Redux store
  const { items: categories } = useSelector((state: RootState) => state.categories);
  const { items: languages } = useSelector((state: RootState) => state.languages);
  const { items: tones, status: tonesStatus } = useSelector((state: RootState) => state.tones);
  const { items: narrators, status: narratorsStatus } = useSelector((state: RootState) => state.narrators);
  const { items: literatureStyles, status: literatureStylesStatus } = useSelector((state: RootState) => state.literatureStyles);
  const { teams, status: teamsStatus } = useSelector((state: RootState) => state.teams);
  const { profile } = useSelector((state: RootState) => state.profile);

  // Selection states
  const [selectedOwner, setSelectedOwner] = useState<OwnerOption | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<SelectOption[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<SelectOption | null>(null);
  const [selectedNarrator, setSelectedNarrator] = useState<SelectOption | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<SelectOption | null>(null);
  const [selectedTone, setSelectedTone] = useState<SelectOption | null>(null);

  // Create owner options (user + teams where user can create books)
  const ownerOptions: OwnerOption[] = [
    {
      value: 'user',
      label: `Personal (${profile?.full_name || 'Me'})`,
      type: 'user'
    },
    ...teams
      .filter(team => team.user_role === 'admin' || team.user_role === 'editor')
      .map(team => ({
        value: team.id,
        label: team.name,
        type: 'team' as const,
        team
      }))
  ];

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
        if (teamsStatus === 'idle') {
          promises.push(dispatch(fetchUserTeams()).unwrap());
        }

        await Promise.all(promises);

        // Set default owner to personal
        if (ownerOptions.length > 0) {
          setSelectedOwner(ownerOptions[0]);
        }
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
      resetForm();
    }
  }, [dispatch, isOpen, tonesStatus, narratorsStatus, literatureStylesStatus, teamsStatus, toast, onClose, ownerOptions.length]);

  // Update default owner when options change
  useEffect(() => {
    if (!selectedOwner && ownerOptions.length > 0) {
      setSelectedOwner(ownerOptions[0]);
    }
  }, [ownerOptions, selectedOwner]);

  // Update character count
  useEffect(() => {
    setPromptCharCount(prompt.length);
  }, [prompt]);

  const resetForm = () => {
    setPrompt('');
    setSelectedOwner(null);
    setSelectedCategories([]);
    setSelectedLanguage(null);
    setSelectedNarrator(null);
    setSelectedStyle(null);
    setSelectedTone(null);
    setShowAdvanced(false);
    setCurrentStep(1);
    setIssues(null);
  };

  const handleSubmit = async () => {
    if (!selectedLanguage || !selectedOwner) return;
    
    setIsSubmitting(true);
    setIssues(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session found');
      
      // Prepare the request payload
      const requestPayload = {
        prompt,
        language: selectedLanguage.language as Language,
        categories: selectedCategories.map(c => c.category as Category),
        narrator: selectedNarrator?.narrator as Narrator | undefined,
        tone: selectedTone?.tone as Tone | undefined,
        literatureStyle: selectedStyle?.style as LiteratureStyle | undefined,
        author_name: profile?.full_name || 'Anonymous',
        // Add owner information
        owner: {
          type: selectedOwner.type,
          id: selectedOwner.type === 'user' ? user.id : selectedOwner.value,
          team_id: selectedOwner.type === 'team' ? selectedOwner.value : null
        }
      };
      
      // Call the API to generate the book
      const response = await fetch(`${import.meta.env.VITE_API_URL}/generate-book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(requestPayload)
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
        description: `Book created successfully${selectedOwner.type === 'team' ? ` for team ${selectedOwner.team?.name}` : ''}`,
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

  const nextStep = () => {
    if (currentStep === 1 && (!prompt || prompt.trim().length < 10)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a story idea or outline (minimum 10 characters).",
      });
      return;
    }

    if (currentStep === 2 && (!selectedLanguage || selectedCategories.length === 0)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a language and at least one category.",
      });
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const canSubmit = prompt && selectedLanguage && selectedCategories.length > 0 && selectedOwner;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl mx-4 my-8 flex flex-col max-h-[calc(100vh-4rem)] shadow-xl">
        {/* Header with progress indicator */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-primary">Create New Book</h2>
            <div className="flex items-center mt-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
              <div className={`h-1 w-12 ${currentStep >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
              <div className={`h-1 w-12 ${currentStep >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
            </div>
          </div>
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
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-gray-600">Loading...</p>
              </div>
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

              {/* Step 1: Story Idea */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Lightbulb className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Story Idea or Outline</h3>
                      <p className="text-gray-600 text-sm">Describe your story concept, including main characters, setting, and central conflict.</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Enter your story idea or outline... Be as detailed as possible for better results."
                      className="w-full h-64 p-4 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-gray-700 placeholder:text-gray-400 border-gray-200"
                      disabled={isSubmitting}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{promptCharCount} characters</span>
                      <span>{promptCharCount < 50 ? 'Add more details for better results' : promptCharCount < 200 ? 'Good start, more details help' : 'Great level of detail!'}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-800 mb-1">Example prompt</h4>
                        <p className="text-xs text-blue-700 italic">
                          "A psychological thriller set in modern-day Seattle about Dr. Sarah Chen, a 35-year-old forensic psychologist 
                          who begins experiencing the same recurring nightmares as the serial killer she's profiling. As the line between 
                          her dreams and reality blurs, she must uncover the connection before she becomes the next victim."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Basic Settings */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Book Settings</h3>
                      <p className="text-gray-600 text-sm">Choose the basic properties for your book.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="owner" className="text-gray-700 flex items-center gap-1">
                        Book Owner
                        <span className="text-red-500">*</span>
                      </Label>
                      <CustomSelect
                        id="owner"
                        value={selectedOwner}
                        onChange={(newValue) => setSelectedOwner(newValue as OwnerOption)}
                        options={ownerOptions}
                        placeholder="Select who will own this book..."
                        isDisabled={isSubmitting}
                      />
                      <p className="text-xs text-gray-500">
                        {selectedOwner?.type === 'team' 
                          ? `This book will be created for the team "${selectedOwner.team?.name}" and can be edited by team admins and editors.`
                          : 'This book will be created as a personal book that only you can edit.'
                        }
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="categories" className="text-gray-700 flex items-center gap-1">
                        Categories
                        <span className="text-red-500">*</span>
                      </Label>
                      <CustomSelect
                        id="categories"
                        isMulti
                        value={selectedCategories}
                        onChange={(newValue) => setSelectedCategories(newValue as SelectOption[])}
                        options={mapToSelectOptions(categories, 'category')}
                        placeholder="Select 1-3 categories..."
                        isDisabled={isSubmitting}
                      />
                      <p className="text-xs text-gray-500">
                        Choose categories that best describe your book's genre and themes.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language" className="text-gray-700 flex items-center gap-1">
                        Language
                        <span className="text-red-500">*</span>
                      </Label>
                      <CustomSelect
                        id="language"
                        value={selectedLanguage}
                        onChange={(newValue) => setSelectedLanguage(newValue as SelectOption)}
                        options={mapToSelectOptions(languages, 'language')}
                        placeholder="Select language..."
                        isDisabled={isSubmitting}
                      />
                      <p className="text-xs text-gray-500">
                        The primary language your book will be written in.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Advanced Settings */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Advanced Settings</h3>
                      <p className="text-gray-600 text-sm">Fine-tune your book's style and tone (optional).</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="narrator" className="text-gray-700">Narrator Perspective</Label>
                      <CustomSelect
                        id="narrator"
                        value={selectedNarrator}
                        onChange={(newValue) => setSelectedNarrator(newValue as SelectOption)}
                        options={mapToSelectOptions(narrators, 'narrator')}
                        placeholder="Select narrator..."
                        isDisabled={isSubmitting}
                      />
                      <p className="text-xs text-gray-500">
                        First person, third person, etc.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="style" className="text-gray-700">Literature Style</Label>
                      <CustomSelect
                        id="style"
                        value={selectedStyle}
                        onChange={(newValue) => setSelectedStyle(newValue as SelectOption)}
                        options={mapToSelectOptions(literatureStyles, 'style')}
                        placeholder="Select style..."
                        isDisabled={isSubmitting}
                      />
                      <p className="text-xs text-gray-500">
                        Literary, commercial, genre-specific
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tone" className="text-gray-700">Writing Tone</Label>
                      <CustomSelect
                        id="tone"
                        value={selectedTone}
                        onChange={(newValue) => setSelectedTone(newValue as SelectOption)}
                        options={mapToSelectOptions(tones, 'tone')}
                        placeholder="Select tone..."
                        isDisabled={isSubmitting}
                      />
                      <p className="text-xs text-gray-500">
                        Serious, humorous, dramatic, etc.
                      </p>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-amber-800 mb-1">Pro Tip</h4>
                        <p className="text-xs text-amber-700">
                          These settings help fine-tune your book's style and voice. For best results, choose options that complement your genre and story concept.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-800 mb-1">Book Generation</h4>
                        <p className="text-xs text-blue-700">
                          When you click "Create Book", our AI will generate your complete book based on your settings. This process typically takes 2-5 minutes.
                        </p>
                        <p className="text-xs text-blue-700 mt-1">
                          <strong>Note:</strong> This will use 5 credits from your account.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {!loading && (
          <div className="border-t p-6 bg-gray-50">
            <div className="flex justify-between">
              {currentStep > 1 ? (
                <Button
                  onClick={prevStep}
                  variant="outline"
                  disabled={isSubmitting}
                >
                  Back
                </Button>
              ) : (
                <div></div> // Empty div to maintain layout
              )}
              
              {currentStep < 3 ? (
                <Button
                  onClick={nextStep}
                  disabled={isSubmitting || (currentStep === 1 && (!prompt || prompt.trim().length < 10))}
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !canSubmit}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating Book...
                    </div>
                  ) : (
                    'Create Book'
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}