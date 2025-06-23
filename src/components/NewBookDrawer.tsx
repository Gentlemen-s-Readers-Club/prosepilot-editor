import React, { useState, useEffect, useMemo } from 'react';
import { X, AlertCircle, Loader2, BookOpen, Lightbulb, Sparkles, Globe } from 'lucide-react';
import { 
  Drawer, 
  DrawerContent, 
  DrawerTitle, 
  DrawerClose 
} from './ui/drawer';
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
import { hasProOrStudioPlan, hasStudioPlan } from '../store/slices/subscriptionSlice';

interface ValidationIssue {
  type: 'prohibited_content' | 'sensitive_data' | 'content_appropriateness' | 'ethical_consideration' | 'content_coherence';
  description: string;
}

interface NewBookDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OwnerOption extends SelectOption {
  type: 'user' | 'team';
  team?: Team;
}

export function NewBookDrawer({ isOpen, onClose }: NewBookDrawerProps) {
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  
  const { session } = useSelector((state: RootState) => (state.auth));
  
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [issues, setIssues] = useState<ValidationIssue[] | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [promptCharCount, setPromptCharCount] = useState(0);
  
  // Add validation error states
  const [ownerError, setOwnerError] = useState<string | null>(null);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [languageError, setLanguageError] = useState<string | null>(null);
  
  // Get form options from Redux store
  const userHasProPlan = useSelector(hasProOrStudioPlan);
  const userHasStudioPlan = useSelector(hasStudioPlan);
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
  const ownerOptions: OwnerOption[] = useMemo(() => [
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
  ], [profile?.full_name, teams]);

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
        
      } catch(error) {
        console.error('Error loading data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load form data",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dispatch, literatureStylesStatus, narratorsStatus, teamsStatus, toast, tonesStatus, onClose]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    } else {
      setSelectedOwner(ownerOptions[0]);  
    }
  }, [isOpen, ownerOptions]);

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
    setCurrentStep(1);
    setError(null);
    setIssues(null);
  };
  
  const handleSubmit = async () => {
    if (!selectedLanguage || !selectedOwner) return;
    
    setIsSubmitting(true);
    setError(null);
    setIssues(null);

    try {
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
          id: selectedOwner.type === 'user' ? session?.user.id : selectedOwner.value,
          team_id: selectedOwner.type === 'team' ? selectedOwner.value : null
        }
      };
      
      // Call the API to generate the book
      const response = await fetch(`${import.meta.env.VITE_API_URL}/generate-book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify(requestPayload)
      });

      if (!response.ok) {
        throw new Error;
      }

      const result = await response.json();

      console.log(result);

      if (!result.success) {
        setError(result.message || "Failed to create book. Please try again later or contact support.");
        return result;
      }
      
      if (!result.is_valid) {
        setCurrentStep(1);
        setIssues(result.issues);
        return result;
      }
      
      if (!result.book) {
        throw new Error;
      }

      onClose();

      toast({
        title: "Success",
        description: 'Book created successfully',
      });
    } catch (error) {
      console.error('Error creating book:', error);
      setError("Failed to create book. Please try again later or contact support.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && (!prompt || prompt.trim().length < 10)) {
      setError("Please enter a story idea or outline (minimum 10 characters).");
      return;
    }

    if (currentStep === 2) {
      // Reset validation errors
      setOwnerError(null);
      setCategoriesError(null);
      setLanguageError(null);
      
      let hasErrors = false;
      
      if (!selectedOwner) {
        setOwnerError("Please select a book owner");
        hasErrors = true;
      }
      
      if (selectedCategories.length === 0) {
        setCategoriesError("Please select at least one category");
        hasErrors = true;
      }
      
      if (!selectedLanguage) {
        setLanguageError("Please select a language");
        hasErrors = true;
      }
      
      if (hasErrors) {
        return;
      }
    }

    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const canSubmit = prompt && selectedLanguage && selectedCategories.length > 0 && selectedOwner;

  return (
    <Drawer open={isOpen} onOpenChange={(open: boolean) => {
      // Only allow closing via the X button (which sets open to false)
      if (!open) {
        onClose();
      }
    }}>
      <DrawerContent 
        className="w-full max-w-2xl flex flex-col shadow-xl max-h-screen overflow-hidden"
      >
        {/* Header with progress indicator - Fixed */}
        <div className="flex justify-between items-center p-6 border-b bg-white sticky top-0 z-10">
          <div className="flex-1">
            <DrawerTitle className="text-2xl font-bold text-base-heading">Create New Book</DrawerTitle>
            <div className="flex items-center mt-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
              <div className={`h-1 w-12 ${currentStep >= 2 ? 'bg-brand-primary' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
              {userHasProPlan && (
                <>
                  <div className={`h-1 w-12 ${currentStep >= 3 ? 'bg-brand-primary' : 'bg-gray-200'}`}></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
                </>
              )}
            </div>
          </div>
          <DrawerClose asChild>
            <button 
              className="text-gray-400 hover:text-base-paragraph transition-colors"
              disabled={isSubmitting}
            >
              <X size={24} />
            </button>
          </DrawerClose>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full p-6">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-base-heading animate-spin" />
                <p className="text-base-paragraph">Loading...</p>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {error && (
                <div className="bg-state-error-light border border-state-error rounded-lg p-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-state-error" />
                      <h3 className="text-sm font-medium text-state-error">
                        Error
                      </h3>
                    </div>
                    <div className="ml-3">
                      <div className="mt-2 text-sm text-state-error">
                        {error}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {issues && (
                <div className="bg-state-error-light border border-state-error rounded-lg p-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-state-error" />
                      <h3 className="text-sm font-medium text-state-error">
                        Content Policy Violation
                      </h3>
                    </div>
                    <div className="ml-3">
                      <div className="mt-2 text-sm text-state-error">
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
                    <div className="bg-brand-primary/10 p-3 rounded-lg">
                      <Lightbulb className="h-6 w-6 text-brand-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-base-heading">Story Idea or Outline</h3>
                      <p className="text-base-paragraph text-sm">Describe your story concept, including main characters, setting, and central conflict.</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Enter your story idea or outline... Be as detailed as possible for better results."
                      className="w-full h-64 p-4 border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none text-gray-700 placeholder:text-gray-400 border-gray-200"
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
                        <h4 className="text-sm font-medium text-blue-800 mb-1">Need help with your prompt?</h4>
                        <p className="text-xs text-blue-700">
                          Check out our <a href="/docs#prompt-examples" target="_blank" className="underline hover:text-blue-800">prompt guide with examples</a>
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
                    <div className="bg-brand-primary/10 p-3 rounded-lg">
                      <BookOpen className="h-6 w-6 text-brand-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-base-heading">Book Settings</h3>
                      <p className="text-base-paragraph text-sm">Choose the basic properties for your book.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {userHasStudioPlan && ownerOptions.length > 0 && (
                      <div className="space-y-2">
                        <Label htmlFor="owner" className="text-gray-700 flex items-center gap-1">
                          Book Owner
                          <span className="text-state-error">*</span>
                        </Label>
                        <CustomSelect
                          id="owner"
                          value={selectedOwner}
                          onChange={(newValue) => {
                            setSelectedOwner(newValue as OwnerOption);
                            setOwnerError(null);
                          }}
                          options={ownerOptions}
                          placeholder="Select who will own this book"
                          isDisabled={isSubmitting}
                        />
                        {ownerError && (
                          <p className="text-sm text-red-600 mt-1">{ownerError}</p>
                        )}
                        <p className="text-xs text-gray-500">
                          {selectedOwner?.type === 'team' 
                            ? `This book will be created for the team "${selectedOwner.team?.name}" and can be edited by team admins and editors.`
                            : 'This book will be created as a personal book that only you can edit.'
                          }
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="categories" className="text-gray-700 flex items-center gap-1">
                        Categories
                        <span className="text-state-error">*</span>
                      </Label>
                      <CustomSelect
                        id="categories"
                        isMulti
                        value={selectedCategories}
                        onChange={(newValue) => {
                          setSelectedCategories(newValue as SelectOption[]);
                          setCategoriesError(null);
                        }}
                        options={mapToSelectOptions(categories, 'category')}
                        placeholder="Select categories"
                        isDisabled={isSubmitting}
                      />
                      {categoriesError && (
                        <p className="text-sm text-red-600 mt-1">{categoriesError}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        Choose categories that best describe your book's genre and themes.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language" className="text-gray-700 flex items-center gap-1">
                        Language
                        <span className="text-state-error">*</span>
                      </Label>
                      <CustomSelect
                        id="language"
                        value={selectedLanguage}
                        onChange={(newValue) => {
                          setSelectedLanguage(newValue as SelectOption);
                          setLanguageError(null);
                        }}
                        options={mapToSelectOptions(languages, 'language')}
                        placeholder="Select language"
                        isDisabled={isSubmitting}
                      />
                      {languageError && (
                        <p className="text-sm text-red-600 mt-1">{languageError}</p>
                      )}
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
                    <div className="bg-brand-primary/10 p-3 rounded-lg">
                      <Sparkles className="h-6 w-6 text-brand-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-base-heading">Advanced Settings</h3>
                      <p className="text-base-paragraph text-sm">Fine-tune your book's style and tone (optional).</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-6">
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
                    </div>
                  </div>

                  <div className="bg-state-info-light border border-state-info rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-state-info mt-0.5 shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-state-info mb-1">Book Generation</h4>
                        <p className="text-xs text-state-info">
                          When you click "Create Book", our AI will first generate the book structure based on your settings, which typically takes 2-5 minutes. After that, the AI will begin writing your complete book, which can take up to 30 minutes to complete.
                        </p>
                        <p className="text-xs text-state-info mt-1">
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

        {/* Footer - Fixed */}
        {!loading && (
          <div className="border-t p-6 bg-gray-50 sticky bottom-0 z-10">
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
                <div></div>
              )}
              
              
              {(currentStep < 3 && userHasProPlan) || (currentStep < 2 && !userHasProPlan) ? (
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
                  className="bg-brand-primary hover:bg-brand-primary/90"
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
      </DrawerContent>
    </Drawer>
  );
}