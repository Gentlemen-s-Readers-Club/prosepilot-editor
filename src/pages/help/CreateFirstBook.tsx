import React from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '../../components/Navigation';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import { 
  ArrowLeft,
  BookOpen,
  Sparkles,
  Settings,
  Download,
  CheckCircle,
  Clock,
  Users,
  ChevronRight,
  Play,
  FileText,
  Edit3,
  Eye
} from 'lucide-react';

export function CreateFirstBook() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <div className="bg-white pt-16 border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center mb-6">
            <Link to="/support" className="flex items-center text-primary hover:text-primary/80 mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Support
            </Link>
            <span className="text-sm text-gray-500">Getting Started</span>
          </div>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                How to create your first book with AI
              </h1>
              <div className="flex items-center text-sm text-gray-500 space-x-4 mb-6">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  5 min read
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  12.5k views
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  Getting Started
                </div>
              </div>
              <p className="text-xl text-gray-600 leading-relaxed">
                Learn how to transform your story idea into a complete book using ProsePilot's AI-powered writing tools. 
                This step-by-step guide will walk you through the entire process from concept to finished manuscript.
              </p>
            </div>
            <div className="ml-8 hidden lg:block">
              <div className="bg-gray-50 rounded-lg p-6 w-64">
                <h3 className="font-semibold text-gray-900 mb-4">In this article</h3>
                <nav className="space-y-2 text-sm">
                  <a href="#step-1" className="block text-gray-600 hover:text-primary">1. Preparing your story idea</a>
                  <a href="#step-2" className="block text-gray-600 hover:text-primary">2. Creating your book project</a>
                  <a href="#step-3" className="block text-gray-600 hover:text-primary">3. Configuring AI settings</a>
                  <a href="#step-4" className="block text-gray-600 hover:text-primary">4. Generating your content</a>
                  <a href="#step-5" className="block text-gray-600 hover:text-primary">5. Reviewing and editing</a>
                  <a href="#step-6" className="block text-gray-600 hover:text-primary">6. Exporting your book</a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          
          {/* Introduction */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <Sparkles className="w-6 h-6 text-blue-600 mt-1 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">What you'll learn</h3>
                <ul className="text-blue-800 space-y-1 text-sm">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-4">1</span>
              Preparing your story idea
            </h2>
            
            <p className="text-gray-700 mb-6">
              Before diving into ProsePilot, it's important to have a clear vision of your story. The AI works best when 
              you provide detailed, specific prompts that capture the essence of what you want to create.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Essential elements to define:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Story Basics</h5>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Genre and subgenre</li>
                    <li>• Target audience</li>
                    <li>• Approximate length</li>
                    <li>• Tone and style</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Story Content</h5>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Main characters</li>
                    <li>• Central conflict</li>
                    <li>• Setting and time period</li>
                    <li>• Key themes</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-green-900 mb-2">💡 Pro Tip</h4>
              <p className="text-green-800 text-sm">
                Write a 2-3 sentence summary of your story before starting. This will help you stay focused and 
                provide better prompts to the AI. Think of it as your "elevator pitch" for the book.
              </p>
            </div>
          </section>

          {/* Step 2 */}
          <section id="step-2" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-4">2</span>
              Creating your book project
            </h2>

            <p className="text-gray-700 mb-6">
              Now that you have your story concept ready, let's create your first book project in ProsePilot.
            </p>

            <div className="space-y-6">
              <div className="border rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">1</span>
                  Navigate to your dashboard
                </h4>
                <p className="text-gray-700 mb-3">
                  From your ProsePilot dashboard, click the "Create New Book" button. This will open the book creation wizard.
                </p>
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    <strong>Location:</strong> Dashboard → "Create New Book" button (top right)
                  </p>
                </div>
              </div>

              <div className="border rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">2</span>
                  Enter your story outline
                </h4>
                <p className="text-gray-700 mb-3">
                  In the "Story Idea or Outline" field, paste or type your prepared story concept. Be as detailed as possible 
                  while keeping it concise and focused.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h5 className="font-medium text-yellow-900 mb-2">Example prompt:</h5>
                  <p className="text-yellow-800 text-sm italic">
                    "A young marine biologist discovers an ancient underwater city while researching coral bleaching. 
                    As she explores the ruins, she uncovers evidence that the city's inhabitants had advanced knowledge 
                    of ocean conservation. However, a powerful corporation wants to exploit the discovery for profit, 
                    and she must choose between scientific fame and protecting the ocean's secrets."
                  </p>
                </div>
              </div>

              <div className="border rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">3</span>
                  Select basic settings
                </h4>
                <p className="text-gray-700 mb-3">
                  Choose your book's fundamental properties:
                </p>
                <ul className="text-gray-700 space-y-2 ml-6">
                  <li>• <strong>Categories:</strong> Select 1-3 genres that best describe your book</li>
                  <li>• <strong>Language:</strong> Choose your writing language</li>
                  <li>• <strong>Book Owner:</strong> Personal or team project</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Step 3 */}
          <section id="step-3" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-4">3</span>
              Configuring AI settings
            </h2>

            <p className="text-gray-700 mb-6">
              The advanced settings help fine-tune how the AI generates your content. While optional for beginners, 
              these settings can significantly improve the quality and style of your book.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-blue-900 mb-3">Advanced Settings (Optional)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h5 className="font-medium text-blue-900 mb-2">Narrator Perspective</h5>
                  <p className="text-blue-800 text-sm">Choose first person, third person limited, or omniscient narration</p>
                </div>
                <div>
                  <h5 className="font-medium text-blue-900 mb-2">Literature Style</h5>
                  <p className="text-blue-800 text-sm">Select from literary fiction, commercial fiction, or genre-specific styles</p>
                </div>
                <div>
                  <h5 className="font-medium text-blue-900 mb-2">Writing Tone</h5>
                  <p className="text-blue-800 text-sm">Set the overall mood: serious, humorous, dramatic, or conversational</p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-amber-900 mb-2">⚡ Quick Start Tip</h4>
              <p className="text-amber-800 text-sm">
                For your first book, you can skip the advanced settings and use the defaults. You can always create 
                another version later with different settings to compare results.
              </p>
            </div>
          </section>

          {/* Step 4 */}
          <section id="step-4" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-4">4</span>
              Generating your content
            </h2>

            <p className="text-gray-700 mb-6">
              Once you've configured your settings, it's time to let the AI work its magic. This process typically 
              takes 2-5 minutes depending on your book's length and complexity.
            </p>

            <div className="space-y-6">
              <div className="border rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">What happens during generation:</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">AI analyzes your story prompt and settings</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Creates detailed character profiles and plot structure</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Generates chapter-by-chapter content</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Performs consistency and quality checks</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Generation time estimates:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">2-3 min</div>
                    <div className="text-gray-600">Short stories<br/>(5,000-15,000 words)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">3-5 min</div>
                    <div className="text-gray-600">Novellas<br/>(20,000-40,000 words)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">5-8 min</div>
                    <div className="text-gray-600">Full novels<br/>(50,000+ words)</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Step 5 */}
          <section id="step-5" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-4">5</span>
              Reviewing and editing
            </h2>

            <p className="text-gray-700 mb-6">
              Once generation is complete, you'll be taken to your book's detail page where you can review the 
              generated content and make any necessary edits.
            </p>

            <div className="space-y-6">
              <div className="border rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Review checklist:</h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Checkbox id="check-synopsis" className="mt-1" />
                    <label htmlFor="check-synopsis" className="ml-3 text-gray-700">
                      Read through the generated synopsis and chapter summaries
                    </label>
                  </div>
                  <div className="flex items-start">
                    <Checkbox id="check-characters" className="mt-1" />
                    <label htmlFor="check-characters" className="ml-3 text-gray-700">
                      Check character consistency across chapters
                    </label>
                  </div>
                  <div className="flex items-start">
                    <Checkbox id="check-plot" className="mt-1" />
                    <label htmlFor="check-plot" className="ml-3 text-gray-700">
                      Verify plot progression and pacing
                    </label>
                  </div>
                  <div className="flex items-start">
                    <Checkbox id="check-dialogue" className="mt-1" />
                    <label htmlFor="check-dialogue" className="ml-3 text-gray-700">
                      Review dialogue and narrative voice
                    </label>
                  </div>
                  <div className="flex items-start">
                    <Checkbox id="check-edits" className="mt-1" />
                    <label htmlFor="check-edits" className="ml-3 text-gray-700">
                      Make any necessary edits using the built-in editor
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 className="font-semibold text-green-900 mb-3">Editing tips:</h4>
                <ul className="text-green-800 space-y-2 text-sm">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-4">6</span>
              Exporting your book
            </h2>

            <p className="text-gray-700 mb-6">
              When you're satisfied with your book, you can export it in various formats for publishing, 
              sharing, or further editing in other tools.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="border rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <FileText className="w-5 h-5 text-blue-500 mr-2" />
                  Available formats
                </h4>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• <strong>PDF:</strong> For printing and professional presentation</li>
                  <li>• <strong>EPUB:</strong> For e-readers and digital distribution</li>
                  <li>• <strong>DOCX:</strong> For further editing in Word processors</li>
                  <li>• <strong>TXT:</strong> Plain text for maximum compatibility</li>
                </ul>
              </div>

              <div className="border rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Download className="w-5 h-5 text-green-500 mr-2" />
                  Export options
                </h4>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• Include/exclude cover page</li>
                  <li>• Custom formatting options</li>
                  <li>• Metadata inclusion</li>
                  <li>• Chapter organization</li>
                </ul>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h4 className="font-semibold text-purple-900 mb-3">🎉 Congratulations!</h4>
              <p className="text-purple-800 text-sm mb-3">
                You've successfully created your first AI-generated book! Here are some next steps to consider:
              </p>
              <ul className="text-purple-800 space-y-1 text-sm">
                <li>• Share your book with beta readers for feedback</li>
                <li>• Consider professional editing for publication</li>
                <li>• Explore our publishing guides for next steps</li>
                <li>• Create variations with different AI settings</li>
              </ul>
            </div>
          </section>

          {/* Related Articles */}
          <section className="border-t pt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link to="/help/credit-system" className="block bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                <h4 className="font-semibold text-gray-900 mb-2">Understanding the credit system</h4>
                <p className="text-gray-600 text-sm mb-3">Learn how credits work and how to manage your usage effectively.</p>
                <div className="flex items-center text-primary text-sm">
                  <span>Read article</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
              
              <Link to="/help/ai-best-practices" className="block bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                <h4 className="font-semibold text-gray-900 mb-2">Best practices for AI-generated content</h4>
                <p className="text-gray-600 text-sm mb-3">Tips and techniques for getting the best results from our AI.</p>
                <div className="flex items-center text-primary text-sm">
                  <span>Read article</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-primary py-12">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to create your first book?</h3>
          <p className="text-white/90 mb-6">Start your writing journey today with ProsePilot's AI-powered tools.</p>
          <Link to="/app/signup">
            <Button className="bg-white text-primary hover:bg-gray-100 px-8 py-3">
              Get Started Now
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}