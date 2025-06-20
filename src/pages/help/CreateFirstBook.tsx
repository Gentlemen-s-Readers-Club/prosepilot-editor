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
                      <h5 className="font-medium text-base-heading font-heading mb-2">Story Basics</h5>
                      <ul className="text-base-paragraph font-copy space-y-1 text-sm">
                        <li>• <strong>Genre:</strong> What type of story (mystery, romance, sci-fi, etc.)</li>
                        <li>• <strong>Setting:</strong> When and where the story takes place</li>
                        <li>• <strong>Main character:</strong> Who the story is about</li>
                        <li>• <strong>Central conflict:</strong> What problem drives the story</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-base-heading font-heading mb-2">Story Content</h5>
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
                        <h5 className="font-medium text-base-heading font-heading">From your dashboard</h5>
                        <p className="text-base-paragraph font-copy text-sm">Click "New Book" and select "Create with AI"</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-brand-accent/15 text-brand-accent rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</div>
                      <div>
                        <h5 className="font-medium text-base-heading font-heading">Enter book details</h5>
                        <p className="text-base-paragraph font-copy text-sm">Provide a title, genre, and brief description</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-brand-accent/15 text-brand-accent rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</div>
                      <div>
                        <h5 className="font-medium text-base-heading font-heading">Write your prompt</h5>
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
                      <h5 className="font-medium text-state-info font-heading mb-2">Narrator Perspective</h5>
                      <p className="text-base-paragraph font-copy text-sm">Choose first person, third person limited, or omniscient</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-state-info font-heading mb-2">Literature Style</h5>
                      <p className="text-base-paragraph font-copy text-sm">Literary fiction, commercial fiction, or genre-specific</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-state-info font-heading mb-2">Writing Tone</h5>
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
                        <h5 className="font-medium text-base-heading font-heading">AI Analysis</h5>
                        <p className="text-base-paragraph font-copy text-sm">The AI analyzes your prompt and settings to understand your vision</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-brand-accent/15 text-brand-accent rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</div>
                      <div>
                        <h5 className="font-medium text-base-heading font-heading">Structure Creation</h5>
                        <p className="text-base-paragraph font-copy text-sm">Generates a complete outline with chapters and scenes</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-brand-accent/15 text-brand-accent rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</div>
                      <div>
                        <h5 className="font-medium text-base-heading font-heading">Content Generation</h5>
                        <p className="text-base-paragraph font-copy text-sm">Writes the full manuscript with consistent characters and plot</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-brand-accent/15 text-brand-accent rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</div>
                      <div>
                        <h5 className="font-medium text-base-heading font-heading">Quality Check</h5>
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
                      <h5 className="font-medium text-base-heading font-heading mb-2">Story Elements</h5>
                      <ul className="text-base-paragraph font-copy space-y-1 text-sm">
                        <li>• Plot consistency and flow</li>
                        <li>• Character development and voice</li>
                        <li>• Pacing and tension</li>
                        <li>• Resolution of conflicts</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-base-heading font-heading mb-2">Technical Quality</h5>
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
                      <h5 className="font-medium text-base-heading font-heading mb-2">PDF</h5>
                      <p className="text-base-paragraph font-copy text-sm">Perfect for printing and sharing</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <h5 className="font-medium text-base-heading font-heading mb-2">EPUB</h5>
                      <p className="text-base-paragraph font-copy text-sm">For e-readers and digital publishing</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <h5 className="font-medium text-base-heading font-heading mb-2">DOCX</h5>
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
    </>
  );
}