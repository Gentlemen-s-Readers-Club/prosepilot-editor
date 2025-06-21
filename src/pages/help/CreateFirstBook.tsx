import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '../../components/Navigation';
import { Button } from '../../components/ui/button';
import { 
  ArrowLeft,
  Sparkles,
  Clock,
  Users,
  ChevronRight,
  FileText,
  Eye,
  BookOpen,
  Plus,
  Settings,
  Play,
  Edit,
  Download,
  ArrowRight
} from 'lucide-react';
import Footer from '../../components/Footer';
import { SEOHead } from '../../components/SEOHead';
import useAnalytics from '../../hooks/useAnalytics';
import { Checkbox } from '../../components/ui/checkbox';
import { CheckCircle } from 'lucide-react';

export function CreateFirstBook() {
  const { trackPageView } = useAnalytics({
    measurementId: import.meta.env.VITE_ANALYTICS_ID,
  });

  useEffect(() => {
    trackPageView(window.location.pathname);
  }, [trackPageView]);
  
  return (
    <>
      <SEOHead
        title="How to Create Your First Book with AI - ProsePilot Guide"
        description="Learn how to transform your story idea into a complete book using ProsePilot's AI-powered writing tools. Step-by-step guide from concept to finished manuscript."
        keywords="create book with AI, AI book writing tutorial, first book guide, ProsePilot tutorial, AI writing steps, book creation process"
        type="article"
      />
      
      <div className="min-h-screen bg-base-background">
        <Navigation />
        
        {/* Header */}
        <div className="bg-white pt-16 border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <Link to="/docs" className="flex items-center text-base-heading hover:text-base-heading/80 mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Documentation
              </Link>
            </div>
            
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-base-heading font-heading mb-4">
                  How to create your first book with AI
                </h1>
                <div className="flex items-center text-sm text-base-paragraph font-copy space-x-4 mb-6">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-brand-accent" />
                    5 min read
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1 text-brand-accent" />
                    12.5k views
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1 text-brand-accent" />
                    Getting Started
                  </div>
                </div>
                <p className="text-xl text-base-paragraph font-copy leading-relaxed">
                  Transform your story idea into a complete book using ProsePilot's AI. This step-by-step guide 
                  will walk you through the entire process, from initial concept to final publication.
                </p>
              </div>
              <div className="ml-8 hidden lg:block">
                <div className="bg-base-background rounded-lg p-6 w-64">
                  <h3 className="font-semibold text-base-heading font-heading mb-4">In this article</h3>
                  <nav className="space-y-2 text-sm">
                    <a href="#step-1" className="block text-base-paragraph font-copy hover:text-base-heading">1. Preparing your story idea</a>
                    <a href="#step-2" className="block text-base-paragraph font-copy hover:text-base-heading">2. Creating your book project</a>
                    <a href="#step-3" className="block text-base-paragraph font-copy hover:text-base-heading">3. Configuring AI settings</a>
                    <a href="#step-4" className="block text-base-paragraph font-copy hover:text-base-heading">4. Generating your content</a>
                    <a href="#step-5" className="block text-base-paragraph font-copy hover:text-base-heading">5. Reviewing and editing</a>
                    <a href="#step-6" className="block text-base-paragraph font-copy hover:text-base-heading">6. Exporting your book</a>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div>
            
            {/* Introduction */}
            <div className="bg-state-info-light border border-state-info rounded-lg p-6 mb-8">
              <div className="flex items-start">
                <Sparkles className="w-6 h-6 text-state-info mt-1 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-state-info mb-2 font-heading">What you'll learn</h3>
                  <p className="text-state-info text-sm font-copy">
                    By the end of this guide, you'll have a complete understanding of how to use ProsePilot to create 
                    your first AI-generated book, including best practices for prompts, settings, and post-generation editing.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 1 */}
            <section id="step-1" className="mb-12">
              <h2 className="text-3xl font-bold text-base-heading font-heading mb-6 flex items-center">
                <BookOpen className="w-8 h-8 text-brand-accent mr-4" />
                Step 1: Preparing your story idea
              </h2>
              
              <p className="text-base-paragraph font-copy mb-6">
                Before you start generating content, it's important to have a clear vision of your story. 
                This foundation will guide the AI and ensure your book has a coherent direction.
              </p>

              <div className="space-y-6">
                <div className="border rounded-lg p-6 bg-white">
                  <h4 className="font-semibold text-base-heading font-heading mb-3">Essential elements to define:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-base-heading font-copy mb-2">Story Basics</h5>
                      <ul className="text-base-paragraph font-copy space-y-1 text-sm">
                        <li>• <strong>Genre:</strong> What type of story (mystery, romance, sci-fi, etc.)</li>
                        <li>• <strong>Setting:</strong> When and where the story takes place</li>
                        <li>• <strong>Main character:</strong> Who the story is about</li>
                        <li>• <strong>Central conflict:</strong> What problem drives the story</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-base-heading font-copy mb-2">Story Content</h5>
                      <ul className="text-base-paragraph font-copy space-y-1 text-sm">
                        <li>• <strong>Target audience:</strong> Who you're writing for</li>
                        <li>• <strong>Desired length:</strong> Short story, novella, or full novel</li>
                        <li>• <strong>Tone:</strong> Serious, humorous, dark, inspirational</li>
                        <li>• <strong>Key themes:</strong> What ideas you want to explore</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-state-success-light border border-state-success rounded-lg p-6">
                  <h4 className="font-semibold text-state-success mb-2 font-heading">💡 Pro Tip</h4>
                  <p className="text-state-success text-sm font-copy">
                    Don't worry about having every detail figured out. The AI can help you develop ideas, 
                    but having a basic framework will result in much better content.
                  </p>
                </div>
              </div>
            </section>

            {/* Step 2 */}
            <section id="step-2" className="mb-12">
              <h2 className="text-3xl font-bold text-base-heading font-heading mb-6 flex items-center">
                <Plus className="w-8 h-8 text-brand-accent mr-4" />
                Step 2: Creating your book project
              </h2>

              <p className="text-base-paragraph font-copy mb-6">
                Once you have your story idea, it's time to create your book project in ProsePilot. 
                This is where you'll set up the foundation for your AI-generated content.
              </p>

              <div className="space-y-6">
                <div className="border rounded-lg p-6 bg-white">
                  <h4 className="font-semibold text-base-heading font-heading mb-3 flex items-center">
                    <Settings className="w-5 h-5 text-state-info mr-2" />
                    Project setup process
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-brand-accent/15 text-brand-accent rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</div>
                      <div>
                        <h5 className="font-medium text-base-heading font-copy">From your dashboard</h5>
                        <p className="text-base-paragraph font-copy text-sm">Click "New Book" and select "Create with AI"</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-brand-accent/15 text-brand-accent rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</div>
                      <div>
                        <h5 className="font-medium text-base-heading font-copy">Enter book details</h5>
                        <p className="text-base-paragraph font-copy text-sm">Provide a title, genre, and brief description</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-brand-accent/15 text-brand-accent rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</div>
                      <div>
                        <h5 className="font-medium text-base-heading font-copy">Write your prompt</h5>
                        <p className="text-base-paragraph font-copy text-sm">Describe your story idea in detail (we'll cover this next)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-state-warning-light border border-state-warning rounded-lg p-6">
                  <h4 className="font-semibold text-state-warning mb-2 font-heading">Example prompt:</h4>
                  <div className="bg-white rounded-lg p-4 border">
                    <p className="text-state-warning text-sm italic font-copy">
                      "A young adult fantasy novel about a 16-year-old girl named Luna who discovers she can communicate 
                      with animals. When her village is threatened by a mysterious darkness, she must learn to harness 
                      her powers and unite the animal kingdom to save her home. The story should be adventurous and 
                      inspiring, with themes of courage, friendship, and finding your place in the world."
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Step 3 */}
            <section id="step-3" className="mb-12">
              <h2 className="text-3xl font-bold text-base-heading font-heading mb-6 flex items-center">
                <Settings className="w-8 h-8 text-brand-accent mr-4" />
                Step 3: Configuring AI settings
              </h2>

              <p className="text-base-paragraph font-copy mb-6">
                ProsePilot offers advanced settings to fine-tune how the AI generates your content. 
                These settings help ensure your book matches your vision.
              </p>

              <div className="space-y-6">
                <div className="border rounded-lg p-6 bg-white">
                  <h4 className="font-semibold text-state-info mb-3 font-heading">Advanced Settings (Optional)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h5 className="font-medium  font-copy mb-2">Narrator Perspective</h5>
                      <p className="text-base-paragraph font-copy text-sm">Choose first person, third person limited, or omniscient</p>
                    </div>
                    <div>
                      <h5 className="font-medium  font-copy mb-2">Literature Style</h5>
                      <p className="text-base-paragraph font-copy text-sm">Literary fiction, commercial fiction, or genre-specific</p>
                    </div>
                    <div>
                      <h5 className="font-medium  font-copy mb-2">Writing Tone</h5>
                      <p className="text-base-paragraph font-copy text-sm">Serious, casual, or dramatic</p>
                    </div>
                  </div>
                </div>

                <div className="bg-state-warning-light border border-state-warning rounded-lg p-6">
                  <h4 className="font-semibold text-state-warning mb-2 font-heading">⚡ Quick Start Tip</h4>
                  <p className="text-state-warning text-sm font-copy">
                    For your first book, you can leave these at their default settings. You can always adjust them 
                    later as you become more familiar with how they affect the output.
                  </p>
                </div>
              </div>
            </section>

            {/* Step 4 */}
            <section id="step-4" className="mb-12">
              <h2 className="text-3xl font-bold text-base-heading font-heading mb-6 flex items-center">
                <Play className="w-8 h-8 text-brand-accent mr-4" />
                Step 4: Generating your content
              </h2>

              <p className="text-base-paragraph font-copy mb-6">
                This is where the magic happens! ProsePilot's AI will transform your prompt into a complete book. 
                Here's what to expect during the generation process.
              </p>

              <div className="space-y-6">
                <div className="border rounded-lg p-6 bg-white">
                  <h4 className="font-semibold text-base-heading font-heading mb-3">What happens during generation:</h4>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-brand-accent/15 text-brand-accent rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</div>
                      <div>
                        <h5 className="font-medium text-base-heading font-copy">AI Analysis</h5>
                        <p className="text-base-paragraph font-copy text-sm">The AI analyzes your prompt and settings to understand your vision</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-brand-accent/15 text-brand-accent rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</div>
                      <div>
                        <h5 className="font-medium text-base-heading font-copy">Structure Creation</h5>
                        <p className="text-base-paragraph font-copy text-sm">Generates a complete outline with chapters and scenes</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-brand-accent/15 text-brand-accent rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</div>
                      <div>
                        <h5 className="font-medium text-base-heading font-copy">Content Generation</h5>
                        <p className="text-base-paragraph font-copy text-sm">Writes the full manuscript with consistent characters and plot</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-brand-accent/15 text-brand-accent rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</div>
                      <div>
                        <h5 className="font-medium text-base-heading font-copy">Quality Check</h5>
                        <p className="text-base-paragraph font-copy text-sm">Ensures consistency and coherence throughout the story</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-6 bg-white">
                  <h4 className="font-semibold text-base-heading font-heading mb-3">Generation time estimates:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-brand-accent font-heading">15-30 min</div>
                      <div className="text-base-paragraph font-copy">Short story (5-10k words)</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-brand-accent font-heading">1-2 hours</div>
                      <div className="text-base-paragraph font-copy">Novella (20-40k words)</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-brand-accent font-heading">3-6 hours</div>
                      <div className="text-base-paragraph font-copy">Full novel (60-100k words)</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Step 5 */}
            <section id="step-5" className="mb-12">
              <h2 className="text-3xl font-bold text-base-heading font-heading mb-6 flex items-center">
                <Edit className="w-8 h-8 text-brand-accent mr-4" />
                Step 5: Reviewing and editing
              </h2>

              <p className="text-base-paragraph font-copy mb-6">
                Once your book is generated, it's time to review and refine the content. 
                Even the best AI-generated content benefits from human editing.
              </p>

              <div className="space-y-6">
                <div className="border rounded-lg p-6 bg-white">
                  <h4 className="font-semibold text-base-heading font-heading mb-3">Review checklist:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-base-heading font-copy mb-2">Story Elements</h5>
                      <ul className="text-base-paragraph font-copy space-y-1 text-sm">
                        <li>• Plot consistency and flow</li>
                        <li>• Character development and voice</li>
                        <li>• Pacing and tension</li>
                        <li>• Resolution of conflicts</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-base-heading font-copy mb-2">Technical Quality</h5>
                      <ul className="text-base-paragraph font-copy space-y-1 text-sm">
                        <li>• Grammar and spelling</li>
                        <li>• Sentence structure and flow</li>
                        <li>• Dialogue authenticity</li>
                        <li>• Formatting consistency</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-state-success-light border border-state-success rounded-lg p-6">
                  <h4 className="font-semibold text-state-success mb-3 font-heading">Editing tips:</h4>
                  <ul className="text-state-success space-y-2 text-sm font-copy">
                    <li>• Read the entire book first without making changes</li>
                    <li>• Focus on major structural issues before line editing</li>
                    <li>• Keep your unique voice - don't lose it in the editing</li>
                    <li>• Consider getting feedback from beta readers</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Step 6 */}
            <section id="step-6" className="mb-12">
              <h2 className="text-3xl font-bold text-base-heading font-heading mb-6 flex items-center">
                <Download className="w-8 h-8 text-brand-accent mr-4" />
                Step 6: Exporting your book
              </h2>

              <p className="text-base-paragraph font-copy mb-6">
                Congratulations! Your book is ready. ProsePilot makes it easy to export your work 
                in multiple formats for different publishing platforms.
              </p>

              <div className="space-y-6">
                <div className="border rounded-lg p-6 bg-white">
                  <h4 className="font-semibold text-base-heading font-heading mb-3 flex items-center">
                    <FileText className="w-5 h-5 text-state-info mr-2" />
                    Export options
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <h5 className="font-medium text-base-heading font-copy mb-2">PDF</h5>
                      <p className="text-base-paragraph font-copy text-sm">Perfect for printing and sharing</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <h5 className="font-medium text-base-heading font-copy mb-2">EPUB</h5>
                      <p className="text-base-paragraph font-copy text-sm">For e-readers and digital publishing</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <h5 className="font-medium text-base-heading font-copy mb-2">DOCX</h5>
                      <p className="text-base-paragraph font-copy text-sm">For further editing in Word</p>
                    </div>
                  </div>
                </div>

                <div className="bg-state-info-light border border-state-info rounded-lg p-6">
                  <h4 className="font-semibold text-state-info mb-3 font-heading">🎉 Congratulations!</h4>
                  <p className="text-state-info text-sm font-copy">
                    You've just created your first book with AI! Whether you choose to self-publish, 
                    submit to traditional publishers, or keep it for personal enjoyment, you've accomplished 
                    something amazing.
                  </p>
                </div>
              </div>
            </section>

            {/* Related Articles */}
            <section className="border-t pt-8">
              <h3 className="text-2xl font-bold text-base-heading font-heading mb-6">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/help/ai-best-practices" className="block bg-white shadow-md rounded-lg p-6 hover:bg-gray-100 transition-colors">
                  <h4 className="font-semibold text-base-heading font-heading mb-2">Understanding the credit system</h4>
                  <p className="text-base-paragraph text-sm font-copy mb-3">Learn how ProsePilot's credit system works and how to manage your usage.</p>
                  <div className="flex items-center text-brand-accent text-sm">
                    <span>Read article</span>
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </div>
                </Link>
                
                <Link to="/help/ai-best-practices" className="block bg-white shadow-md rounded-lg p-6 hover:bg-gray-100 transition-colors">
                  <h4 className="font-semibold text-base-heading font-heading mb-2">Best practices for AI-generated content</h4>
                  <p className="text-base-paragraph text-sm font-copy mb-3">Master the art of working with AI to create compelling, high-quality books.</p>
                  <div className="flex items-center text-brand-accent text-sm">
                    <span>Read article</span>
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </div>
                </Link>
              </div>
            </section>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="bg-brand-primary py-12">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-white font-heading mb-4">Ready to create your first book?</h3>
            <p className="text-white/90 font-copy mb-6">Start your writing journey with ProsePilot today.</p>
            <Link to="/workspace/signup">
              <Button className="bg-white text-base-heading hover:bg-gray-100 px-8 py-3">
                Get Started Now
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div>
          
          {/* Introduction */}
          <div className="bg-state-info-light border border-state-info rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <Sparkles className="w-6 h-6 text-state-info mt-1 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-state-info mb-2">What you'll learn</h3>
                <ul className="text-state-info space-y-1 text-sm">
                  <li>• How to prepare and structure your story idea for AI generation</li>
                  <li>• Step-by-step process to create your first book project</li>
                  <li>• Best practices for configuring AI settings for optimal results</li>
                  <li>• How to review, edit, and export your completed book</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 1 */}
          <section id="step-1" className="mb-12">
            <h2 className="text-3xl font-bold text-base-heading mb-6 flex items-center">
              <span className="bg-brand-accent text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-4">1</span>
              Preparing your story idea
            </h2>
            
            <p className="text-base-paragraph mb-6 font-copy">
              Before diving into ProsePilot, it's important to have a clear vision of your story. The AI works best when 
              you provide detailed, specific prompts that capture the essence of what you want to create.
            </p>

            <div className="bg-white border rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-base-heading mb-3 font-heading">Essential elements to define:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-base-heading font-copy mb-2">Story Basics</h5>
                  <ul className="text-base-paragraph space-y-1 text-sm font-copy">
                    <li>• Genre and subgenre</li>
                    <li>• Target audience</li>
                    <li>• Approximate length</li>
                    <li>• Tone and style</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-base-heading font-copy mb-2">Story Content</h5>
                  <ul className="text-base-paragraph space-y-1 text-sm font-copy">
                    <li>• Main characters</li>
                    <li>• Central conflict</li>
                    <li>• Setting and time period</li>
                    <li>• Key themes</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-state-success-light border border-state-success rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-state-success mb-2 font-heading">💡 Pro Tip</h4>
              <p className="text-state-success text-sm font-copy">
                Write a 2-3 sentence summary of your story before starting. This will help you stay focused and 
                provide better prompts to the AI. Think of it as your "elevator pitch" for the book.
              </p>
            </div>
          </section>

          {/* Step 2 */}
          <section id="step-2" className="mb-12">
            <h2 className="text-3xl font-bold text-base-heading mb-6 flex items-center">
              <span className="bg-brand-accent text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-4">2</span>
              Creating your book project
            </h2>

            <p className="text-base-paragraph mb-6 font-copy">
              Now that you have your story concept ready, let's create your first book project in ProsePilot.
            </p>

            <div className="space-y-6">
              <div className="border rounded-lg p-6 bg-white">
                <h4 className="font-semibold text-base-heading mb-3 flex items-center font-heading">
                  <span className="bg-brand-accent/15 text-brand-accent rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">1</span>
                  Navigate to your dashboard
                </h4>
                <p className="text-base-paragraph mb-3 font-copy">
                  From your ProsePilot dashboard, click the "Create New Book" button. This will open the book creation wizard.
                </p>
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-sm text-base-paragraph font-copy">
                    <strong>Location:</strong> Dashboard → "Create New Book" button (top right)
                  </p>
                </div>
              </div>

              <div className="border rounded-lg p-6 bg-white">
                <h4 className="font-semibold text-base-heading mb-3 flex items-center font-heading">
                  <span className="bg-brand-accent/15 text-brand-accent rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">2</span>
                  Enter your story outline
                </h4>
                <p className="text-base-paragraph mb-3 font-copy">
                  In the "Story Idea or Outline" field, paste or type your prepared story concept. Be as detailed as possible 
                  while keeping it concise and focused.
                </p>
                <div className="bg-state-warning-light border border-state-warning rounded-lg p-4">
                  <h5 className="font-medium text-state-warning mb-2 font-copy">Example prompt:</h5>
                  <p className="text-state-warning text-sm italic font-copy">
                    "A young marine biologist discovers an ancient underwater city while researching coral bleaching. 
                    As she explores the ruins, she uncovers evidence that the city's inhabitants had advanced knowledge 
                    of ocean conservation. However, a powerful corporation wants to exploit the discovery for profit, 
                    and she must choose between scientific fame and protecting the ocean's secrets."
                  </p>
                </div>
              </div>

              <div className="border rounded-lg p-6 bg-white">
                <h4 className="font-semibold text-base-heading mb-3 flex items-center font-heading">
                  <span className="bg-brand-accent/15 text-brand-accent rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">3</span>
                  Select basic settings
                </h4>
                <p className="text-base-paragraph mb-3 font-copy">
                  Choose your book's fundamental properties:
                </p>
                <ul className="text-base-paragraph space-y-2 ml-6 font-copy">
                  <li>• <strong>Categories:</strong> Select 1-3 genres that best describe your book</li>
                  <li>• <strong>Language:</strong> Choose your writing language</li>
                  <li>• <strong>Book Owner:</strong> Personal or team project</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Step 3 */}
          <section id="step-3" className="mb-12">
            <h2 className="text-3xl font-bold text-base-heading mb-6 flex items-center">
              <span className="bg-brand-accent text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-4">3</span>
              Configuring AI settings
            </h2>

            <p className="text-base-paragraph mb-6 font-copy">
              The advanced settings help fine-tune how the AI generates your content. While optional for beginners, 
              these settings can significantly improve the quality and style of your book.
            </p>

            <div className="bg-state-info-light border border-state-info rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-state-info mb-3 font-heading">Advanced Settings (Optional)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h5 className="font-medium text-state-info font-copy mb-2">Narrator Perspective</h5>
                  <p className="text-state-info text-sm font-copy">Choose first person, third person limited, or omniscient narration</p>
                </div>
                <div>
                  <h5 className="font-medium text-state-info font-copy mb-2">Literature Style</h5>
                  <p className="text-state-info text-sm font-copy">Select from literary fiction, commercial fiction, or genre-specific styles</p>
                </div>
                <div>
                  <h5 className="font-medium text-state-info font-copy mb-2">Writing Tone</h5>
                  <p className="text-state-info text-sm font-copy">Set the overall mood: serious, humorous, dramatic, or conversational</p>
                </div>
              </div>
            </div>

            <div className="bg-state-warning-light border border-state-warning rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-state-warning mb-2 font-heading">⚡ Quick Start Tip</h4>
              <p className="text-state-warning text-sm font-copy">
                For your first book, you can skip the advanced settings and use the defaults. You can always create 
                another version later with different settings to compare results.
              </p>
            </div>
          </section>

          {/* Step 4 */}
          <section id="step-4" className="mb-12">
            <h2 className="text-3xl font-bold text-base-heading mb-6 flex items-center">
              <span className="bg-brand-accent text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-4">4</span>
              Generating your content
            </h2>

            <p className="text-base-paragraph mb-6">
              Once you've configured your settings, it's time to let the AI work its magic. This process typically 
              takes 2-5 minutes depending on your book's length and complexity.
            </p>

            <div className="space-y-6">
              <div className="border rounded-lg p-6 bg-white">
                <h4 className="font-semibold text-base-heading mb-3 font-heading">What happens during generation:</h4>
                <div className="space-y-3">
                  <div className="flex items-center font-copy">
                    <CheckCircle className="w-5 h-5 text-state-success mr-3" />
                    <span className="text-base-paragraph">AI analyzes your story prompt and settings</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-state-success mr-3" />
                    <span className="text-base-paragraph">Creates detailed character profiles and plot structure</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-state-success mr-3" />
                    <span className="text-base-paragraph">Generates chapter-by-chapter content</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-state-success mr-3" />
                    <span className="text-base-paragraph">Performs consistency and quality checks</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-base-heading mb-3 font-heading">Generation time estimates:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-copy">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-base-heading mb-1">2-3 min</div>
                    <div className="text-base-paragraph">Short stories<br/>(5,000-15,000 words)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-base-heading mb-1">3-5 min</div>
                    <div className="text-base-paragraph">Novellas<br/>(20,000-40,000 words)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-base-heading mb-1">5-8 min</div>
                    <div className="text-base-paragraph">Full novels<br/>(50,000+ words)</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Step 5 */}
          <section id="step-5" className="mb-12">
            <h2 className="text-3xl font-bold text-base-heading mb-6 flex items-center font-heading">
              <span className="bg-brand-accent text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-4">5</span>
              Reviewing and editing
            </h2>

            <p className="text-base-paragraph mb-6 font-copy">
              Once generation is complete, you'll be taken to your book's detail page where you can review the 
              generated content and make any necessary edits.
            </p>

            <div className="space-y-6">
              <div className="border rounded-lg p-6 bg-white">
                <h4 className="font-semibold text-base-heading mb-3 font-heading">Review checklist:</h4>
                <div className="space-y-3 font-copy">
                  <div className="flex items-start">
                    <Checkbox id="check-synopsis" className="mt-1" checked={false} onChange={() => {}} />
                    <label htmlFor="check-synopsis" className="ml-3 text-base-paragraph">
                      Read through the generated synopsis and chapter summaries
                    </label>
                  </div>
                  <div className="flex items-start">
                    <Checkbox id="check-characters" className="mt-1" checked={false} onChange={() => {}} />
                    <label htmlFor="check-characters" className="ml-3 text-base-paragraph">
                      Check character consistency across chapters
                    </label>
                  </div>
                  <div className="flex items-start">
                    <Checkbox id="check-plot" className="mt-1" checked={false} onChange={() => {}} />
                    <label htmlFor="check-plot" className="ml-3 text-base-paragraph">
                      Verify plot progression and pacing
                    </label>
                  </div>
                  <div className="flex items-start">
                    <Checkbox id="check-dialogue" className="mt-1" checked={false} onChange={() => {}} />
                    <label htmlFor="check-dialogue" className="ml-3 text-base-paragraph">
                      Review dialogue and narrative voice
                    </label>
                  </div>
                  <div className="flex items-start">
                    <Checkbox id="check-edits" className="mt-1" checked={false} onChange={() => {}} />
                    <label htmlFor="check-edits" className="ml-3 text-base-paragraph">
                      Make any necessary edits using the built-in editor
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-state-success-light border border-state-success rounded-lg p-6">
                <h4 className="font-semibold text-state-success mb-3 font-heading">Editing tips:</h4>
                <ul className="text-state-success space-y-2 text-sm">
                  <li>• Use the chapter editor to refine individual sections</li>
                  <li>• The AI maintains consistency, but personal touches make it uniquely yours</li>
                  <li>• Focus on adding your voice and style to the generated content</li>
                  <li>• Don't feel obligated to keep everything - edit freely to match your vision</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Step 6 */}
          <section id="step-6" className="mb-12">
            <h2 className="text-3xl font-bold text-base-heading mb-6 flex items-center font-heading">
              <span className="bg-brand-accent text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-4">6</span>
              Exporting your book
            </h2>

            <p className="text-base-paragraph mb-6 font-copy">
              When you're satisfied with your book, you can export it in various formats for publishing, 
              sharing, or further editing in other tools.
            </p>

            <div className="mb-6">
              <div className="border rounded-lg p-6 bg-white">
                <h4 className="font-semibold text-base-heading mb-3 flex items-center font-heading">
                  <FileText className="w-5 h-5 text-blue-500 mr-2" />
                  Available formats
                </h4>
                <ul className="text-base-paragraph space-y-2 text-sm font-copy">
                  <li>• <strong>PDF:</strong> For printing and professional presentation</li>
                  <li>• <strong>EPUB:</strong> For e-readers and digital distribution</li>
                  <li>• <strong>DOCX:</strong> For further editing in Word processors</li>
                  <li>• <strong>TXT:</strong> Plain text for maximum compatibility</li>
                </ul>
              </div>
            </div>

            <div className="bg-state-info-light border border-state-info rounded-lg p-6">
              <h4 className="font-semibold text-state-info mb-3 font-heading">🎉 Congratulations!</h4>
              <p className="text-state-info text-sm mb-3 font-copy">
                You've successfully created your first AI-generated book! Here are some next steps to consider:
              </p>
              <ul className="text-state-info space-y-1 text-sm font-copy">
                <li>• Share your book with beta readers for feedback</li>
                <li>• Consider professional editing for publication</li>
                <li>• Explore our publishing guides for next steps</li>
                <li>• Create variations with different AI settings</li>
              </ul>
            </div>
          </section>

          {/* Related Articles */}
          <section className="border-t pt-8">
            <h3 className="text-2xl font-bold text-base-heading mb-6 font-heading">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link to="/help/credit-system" className="block bg-white shadow-md rounded-lg p-6 hover:bg-brand-secondary/30 transition-colors">
                <h4 className="font-semibold text-base-heading mb-2 font-heading">Understanding the credit system</h4>
                <p className="text-base-paragraph text-sm mb-3 font-copy">Learn how credits work and how to manage your usage effectively.</p>
                <div className="flex items-center text-brand-accent text-sm">
                  <span>Read article</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
              
              <Link to="/help/ai-best-practices" className="block bg-white shadow-md rounded-lg p-6 hover:bg-brand-secondary/30 transition-colors">
                <h4 className="font-semibold text-base-heading mb-2 font-heading">Best practices for AI-generated content</h4>
                <p className="text-base-paragraph text-sm mb-3 font-copy">Tips and techniques for getting the best results from our AI.</p>
                <div className="flex items-center text-brand-accent text-sm">
                  <span>Read article</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-brand-primary py-12">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-white mb-4 font-heading">Ready to create your first book?</h3>
          <p className="text-white/90 mb-6 font-copy">Start your writing journey today with ProsePilot's AI-powered tools.</p>
          <Link to="/signup">
            <Button className="bg-white text-base-heading hover:bg-gray-100 px-8 py-3">
              Get Started Now
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}