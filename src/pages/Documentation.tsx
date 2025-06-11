import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { 
  ArrowLeft, 
  BookOpen, 
  Code, 
  Copy, 
  Check, 
  ChevronRight,
  FileText,
  Lightbulb,
  Sparkles,
  Zap,
  MessageSquare,
  Settings
} from 'lucide-react';
import Footer from '../components/Footer';

export function Documentation() {
  const [copiedExample, setCopiedExample] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedExample(id);
    setTimeout(() => setCopiedExample(null), 2000);
  };

  const promptExamples = [
    {
      id: 'fantasy',
      title: 'Fantasy Adventure',
      prompt: 'A young orphan discovers they have magical abilities and must attend a secret school to learn to control their powers. Along the way, they uncover a plot by a dark wizard to take over the magical world. The story should be suitable for young adults, with themes of friendship, courage, and finding one\'s identity.',
      explanation: 'This prompt clearly defines the genre (fantasy), target audience (young adults), main character, central conflict, and key themes.'
    },
    {
      id: 'mystery',
      title: 'Murder Mystery',
      prompt: 'A brilliant but socially awkward detective is called to a remote island mansion when a wealthy patriarch is found dead after a family gathering. What initially appears to be natural causes soon reveals itself as murder, and everyone in the family has a motive. Set in the 1930s with an Agatha Christie-inspired style and a focus on clever clues and psychological insights.',
      explanation: 'This prompt establishes the genre (murder mystery), setting (1930s, remote mansion), main character, plot setup, and stylistic reference.'
    },
    {
      id: 'romance',
      title: 'Contemporary Romance',
      prompt: 'Two rival chefs who despise each other are forced to collaborate on a cooking show. Despite their initial animosity, they begin to appreciate each other\'s culinary skills and eventually fall in love. The story should have a lighthearted, humorous tone with a focus on character growth and the slow-burn romance.',
      explanation: 'This prompt outlines the romance trope (enemies to lovers), the specific setting (cooking show), character dynamics, and desired tone.'
    },
    {
      id: 'sci-fi',
      title: 'Science Fiction',
      prompt: 'In the year 2150, a team of scientists discovers a way to communicate with parallel universes. When they make contact with a version of Earth that has solved climate change and eliminated poverty, they attempt to bring this knowledge back. However, they soon discover that this utopian world harbors a dark secret. The story should explore ethical dilemmas and the unintended consequences of technological advancement.',
      explanation: 'This prompt specifies the time period, scientific concept, plot twist, and philosophical themes to explore.'
    },
    {
      id: 'title-specific',
      title: 'Title-Specific Historical Fiction',
      prompt: 'Write a historical fiction novel titled "The Clockmaker\'s Daughter" set in Victorian London. The story follows a young woman who disguises herself as a man to become an apprentice to a renowned clockmaker, while secretly investigating her father\'s mysterious death which she believes is connected to a revolutionary clockwork invention that was stolen. The narrative should alternate between the Victorian era and present day, where a historian discovers the woman\'s diary and becomes obsessed with uncovering the truth.',
      explanation: 'This prompt specifies the exact title, time period, dual timeline structure, protagonist, and central mystery, giving the AI clear parameters for the book.'
    }
  ];

  return (
    <div className="min-h-screen bg-base-background">
      {/* Header */}
      <div className="bg-white pt-16 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center mb-6">
            <Link to="/" className="flex items-center text-base-heading hover:text-base-heading/80 mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Documentation
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Learn how to use ProsePilot effectively with our comprehensive guides and examples.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 shrink-0">
            <div className="sticky top-8">
              <nav className="space-y-1">
                <a href="#getting-started" className="block px-3 py-2 rounded-md bg-brand-primary text-white">
                  Getting Started
                </a>
                <a href="#prompt-examples" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                  Prompt Examples
                </a>
                <a href="#ai-settings" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                  AI Settings Guide
                </a>
                <a href="#editing-tools" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                  Editing Tools
                </a>
                <a href="#team-collaboration" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                  Team Collaboration
                </a>
                <a href="#faq" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                  FAQ
                </a>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Getting Started */}
            <section id="getting-started" className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <BookOpen className="w-8 h-8 text-brand-primary mr-4" />
                Getting Started
              </h2>
              
              <div className="prose prose-lg max-w-none">
                <p>
                  Welcome to ProsePilot! This guide will help you get started with our AI-powered writing platform.
                  Follow these simple steps to create your first book:
                </p>

                <div className="bg-white rounded-lg shadow-md p-6 my-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Start Guide</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-brand-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</div>
                      <div>
                        <h4 className="font-medium text-gray-900">Create an account</h4>
                        <p className="text-gray-700">Sign up for a ProsePilot account if you haven't already.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-brand-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</div>
                      <div>
                        <h4 className="font-medium text-gray-900">Start a new book</h4>
                        <p className="text-gray-700">From your dashboard, click "Create New Book" to open the book creation wizard.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-brand-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</div>
                      <div>
                        <h4 className="font-medium text-gray-900">Enter your story idea</h4>
                        <p className="text-gray-700">Describe your story concept, including main characters, setting, and central conflict.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-brand-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</div>
                      <div>
                        <h4 className="font-medium text-gray-900">Configure settings</h4>
                        <p className="text-gray-700">Choose categories, language, and optional advanced settings like narrator perspective and tone.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-brand-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">5</div>
                      <div>
                        <h4 className="font-medium text-gray-900">Generate your book</h4>
                        <p className="text-gray-700">Click "Create Book" and wait while our AI generates your complete book.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <p>
                  For more detailed instructions, check out our <Link to="/help/create-first-book" className="text-brand-primary hover:underline">comprehensive guide</Link> to creating your first book.
                </p>
              </div>
            </section>

            {/* Prompt Examples */}
            <section id="prompt-examples" className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Lightbulb className="w-8 h-8 text-brand-primary mr-4" />
                Prompt Examples
              </h2>
              
              <div className="prose prose-lg max-w-none">
                <p>
                  The quality of your prompt greatly influences the quality of your generated book. 
                  Here are some examples of effective prompts for different genres:
                </p>

                <div className="space-y-6 mt-6">
                  {promptExamples.map((example) => (
                    <div key={example.id} className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-semibold text-gray-900">{example.title}</h3>
                        <button
                          onClick={() => copyToClipboard(example.prompt, example.id)}
                          className="flex items-center text-sm text-brand-primary hover:text-brand-primary/80"
                        >
                          {copiedExample === example.id ? (
                            <>
                              <Check className="w-4 h-4 mr-1" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-1" />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md mb-4">
                        <p className="text-gray-700 italic">{example.prompt}</p>
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Why this works:</strong> {example.explanation}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Pro Tips for Effective Prompts
                  </h3>
                  <ul className="text-blue-800 space-y-2">
                    <li>• <strong>Be specific</strong> about your main character, setting, and central conflict</li>
                    <li>• <strong>Include tone and style</strong> preferences (e.g., humorous, dark, lyrical)</li>
                    <li>• <strong>Mention your target audience</strong> (e.g., middle grade, young adult, adult)</li>
                    <li>• <strong>Reference similar authors or books</strong> if you want a particular style</li>
                    <li>• <strong>Specify the title</strong> if you have a particular one in mind</li>
                    <li>• <strong>Describe key themes</strong> you want to explore in your story</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* AI Settings Guide */}
            <section id="ai-settings" className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Settings className="w-8 h-8 text-brand-primary mr-4" />
                AI Settings Guide
              </h2>
              
              <div className="prose prose-lg max-w-none">
                <p>
                  ProsePilot offers advanced AI settings to fine-tune your book generation. 
                  Understanding these options will help you achieve the exact style and tone you're looking for:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Narrator Perspective</h3>
                    <ul className="space-y-3">
                      <li>
                        <strong>First Person:</strong>
                        <p className="text-sm text-gray-600">Narrated from the "I" perspective. Creates intimacy and immediacy.</p>
                      </li>
                      <li>
                        <strong>Third Person Limited:</strong>
                        <p className="text-sm text-gray-600">Follows one character closely. Most versatile option.</p>
                      </li>
                      <li>
                        <strong>Third Person Omniscient:</strong>
                        <p className="text-sm text-gray-600">All-knowing narrator who can access any character's thoughts.</p>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Literature Style</h3>
                    <ul className="space-y-3">
                      <li>
                        <strong>Literary:</strong>
                        <p className="text-sm text-gray-600">Emphasis on artistic quality, complex themes, and sophisticated prose.</p>
                      </li>
                      <li>
                        <strong>Commercial:</strong>
                        <p className="text-sm text-gray-600">Accessible, plot-driven, and designed for broad appeal.</p>
                      </li>
                      <li>
                        <strong>Genre-Specific:</strong>
                        <p className="text-sm text-gray-600">Follows conventions of specific genres (mystery, romance, etc.).</p>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Writing Tone</h3>
                    <ul className="space-y-3">
                      <li>
                        <strong>Serious:</strong>
                        <p className="text-sm text-gray-600">Formal, weighty, minimal humor.</p>
                      </li>
                      <li>
                        <strong>Humorous:</strong>
                        <p className="text-sm text-gray-600">Light, witty, with comedic elements.</p>
                      </li>
                      <li>
                        <strong>Dramatic:</strong>
                        <p className="text-sm text-gray-600">Heightened emotions, tension, vivid descriptions.</p>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-3">
                    Recommended Combinations
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-yellow-900">For Thrillers:</h4>
                      <p className="text-yellow-800 text-sm">Third Person Limited + Commercial Style + Dramatic Tone</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-yellow-900">For Romance:</h4>
                      <p className="text-yellow-800 text-sm">First Person + Genre-Specific Style + Emotional Tone</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-yellow-900">For Literary Fiction:</h4>
                      <p className="text-yellow-800 text-sm">Third Person Omniscient + Literary Style + Reflective Tone</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Editing Tools */}
            <section id="editing-tools" className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="w-8 h-8 text-brand-primary mr-4" />
                Editing Tools
              </h2>
              
              <div className="prose prose-lg max-w-none">
                <p>
                  ProsePilot provides a comprehensive set of editing tools to help you refine your generated content.
                  Here's how to make the most of these features:
                </p>

                <div className="space-y-8 mt-8">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Rich Text Editor</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Key Features:</h4>
                        <ul className="text-gray-700 space-y-1 text-sm">
                          <li>• Formatting options (bold, italic, headings, etc.)</li>
                          <li>• Text alignment controls</li>
                          <li>• List formatting (bulleted and numbered)</li>
                          <li>• Blockquote formatting</li>
                          <li>• Keyboard shortcuts for common actions</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Pro Tips:</h4>
                        <ul className="text-gray-700 space-y-1 text-sm">
                          <li>• Use headings (H1, H2, H3) to structure your chapters</li>
                          <li>• Maintain consistent formatting throughout</li>
                          <li>• Use keyboard shortcuts for faster editing</li>
                          <li>• Save versions regularly to track changes</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Annotations System</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">How to Use:</h4>
                        <ul className="text-gray-700 space-y-1 text-sm">
                          <li>• Select text to add an annotation</li>
                          <li>• Add comments, questions, or revision notes</li>
                          <li>• Reply to annotations for collaborative editing</li>
                          <li>• Mark annotations as resolved when addressed</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Best Practices:</h4>
                        <ul className="text-gray-700 space-y-1 text-sm">
                          <li>• Be specific in your annotation comments</li>
                          <li>• Use annotations for tracking issues to fix</li>
                          <li>• Categorize annotations by type (plot, character, etc.)</li>
                          <li>• Review and resolve annotations systematically</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Version History</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Features:</h4>
                        <ul className="text-gray-700 space-y-1 text-sm">
                          <li>• Automatic version tracking</li>
                          <li>• Compare different versions</li>
                          <li>• Restore previous versions</li>
                          <li>• Version notes and timestamps</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">When to Use:</h4>
                        <ul className="text-gray-700 space-y-1 text-sm">
                          <li>• Before making major revisions</li>
                          <li>• After completing a draft</li>
                          <li>• When experimenting with different approaches</li>
                          <li>• To track progress over time</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
                  <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Keyboard Shortcuts
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-3 rounded-md">
                      <span className="font-medium text-gray-900">Ctrl+B</span>
                      <span className="text-gray-600 ml-3">Bold text</span>
                    </div>
                    <div className="bg-white p-3 rounded-md">
                      <span className="font-medium text-gray-900">Ctrl+I</span>
                      <span className="text-gray-600 ml-3">Italic text</span>
                    </div>
                    <div className="bg-white p-3 rounded-md">
                      <span className="font-medium text-gray-900">Ctrl+Z</span>
                      <span className="text-gray-600 ml-3">Undo</span>
                    </div>
                    <div className="bg-white p-3 rounded-md">
                      <span className="font-medium text-gray-900">Ctrl+Shift+A</span>
                      <span className="text-gray-600 ml-3">Create annotation</span>
                    </div>
                    <div className="bg-white p-3 rounded-md">
                      <span className="font-medium text-gray-900">Ctrl+Shift+P</span>
                      <span className="text-gray-600 ml-3">Toggle annotation panel</span>
                    </div>
                    <div className="bg-white p-3 rounded-md">
                      <span className="font-medium text-gray-900">Ctrl+S</span>
                      <span className="text-gray-600 ml-3">Save version</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Team Collaboration */}
            <section id="team-collaboration" className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <MessageSquare className="w-8 h-8 text-brand-primary mr-4" />
                Team Collaboration
              </h2>
              
              <div className="prose prose-lg max-w-none">
                <p>
                  ProsePilot makes it easy to collaborate with other writers, editors, and beta readers.
                  Learn how to use our team features effectively:
                </p>

                <div className="space-y-6 mt-8">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Team Roles</h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="bg-yellow-100 p-2 rounded-full mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Admin</h4>
                          <p className="text-gray-700 text-sm">Full access to manage team, invite members, and edit all books.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Editor</h4>
                          <p className="text-gray-700 text-sm">Can create and edit books, but cannot manage team members.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-gray-100 p-2 rounded-full mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Reader</h4>
                          <p className="text-gray-700 text-sm">View-only access to books with ability to add annotations and comments.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Collaboration Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Team Management</h4>
                        <ul className="text-gray-700 space-y-1 text-sm">
                          <li>• Create teams for different projects</li>
                          <li>• Invite members via email</li>
                          <li>• Assign appropriate roles</li>
                          <li>• Monitor team activity</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Collaborative Editing</h4>
                        <ul className="text-gray-700 space-y-1 text-sm">
                          <li>• Shared access to team books</li>
                          <li>• Version history tracking</li>
                          <li>• Annotations and comments</li>
                          <li>• Activity logs for transparency</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-purple-900 mb-3">
                      Best Practices for Team Collaboration
                    </h3>
                    <ul className="text-purple-800 space-y-2 text-sm">
                      <li>• <strong>Establish clear guidelines</strong> for team contributions and feedback</li>
                      <li>• <strong>Use annotations</strong> to provide specific, actionable feedback</li>
                      <li>• <strong>Maintain regular communication</strong> about project goals and progress</li>
                      <li>• <strong>Assign clear responsibilities</strong> to team members based on their strengths</li>
                      <li>• <strong>Set realistic deadlines</strong> and track progress through the platform</li>
                    </ul>
                  </div>
                </div>

                <p className="mt-8">
                  For more detailed information on team collaboration, check out our <Link to="/help/team-collaboration" className="text-brand-primary hover:underline">Team Collaboration Guide</Link>.
                </p>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Code className="w-8 h-8 text-brand-primary mr-4" />
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-6">
                {[
                  {
                    question: "How many books can I create?",
                    answer: "The number of books you can create depends on your subscription plan. The Starter plan includes 5 credits (1 book), Pro Author includes 25 credits (5 books), and Studio includes 75 credits (15 books). Each book requires 5 credits to generate."
                  },
                  {
                    question: "Can I edit my book after it's generated?",
                    answer: "Yes! You have full editing capabilities for all generated books. You can modify content, add new chapters, reorganize sections, and make any other changes you'd like using our built-in editor."
                  },
                  {
                    question: "What happens if I'm not satisfied with the generated book?",
                    answer: "If you're not satisfied with the results, you can regenerate specific chapters or try again with a more detailed prompt. While we don't offer credit refunds for generations you don't like, we provide extensive editing tools to help you refine the content."
                  },
                  {
                    question: "Can I publish books created with ProsePilot?",
                    answer: "Absolutely! You own all rights to the content generated for you. You can publish your books on any platform, including Amazon KDP, Barnes & Noble Press, and other self-publishing services."
                  },
                  {
                    question: "How do I export my book?",
                    answer: "From your book's detail page, click the 'Export' button. You can choose from multiple formats including PDF, EPUB, and DOCX, making it easy to publish or share your work."
                  },
                  {
                    question: "Can I collaborate with others on my book?",
                    answer: "Yes! Our team features allow you to invite collaborators with different permission levels. Team members can view, comment on, or edit your books depending on the role you assign them."
                  }
                ].map((faq, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{faq.question}</h3>
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Help Articles */}
            <section className="border-t pt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Detailed Help Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/help/create-first-book" className="block bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                  <h4 className="font-semibold text-gray-900 mb-2">How to create your first book with AI</h4>
                  <p className="text-gray-600 text-sm mb-3">Step-by-step guide to generating your first book using ProsePilot.</p>
                  <div className="flex items-center text-brand-primary text-sm">
                    <span>Read article</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>
                
                <Link to="/help/credit-system" className="block bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                  <h4 className="font-semibold text-gray-900 mb-2">Understanding the credit system</h4>
                  <p className="text-gray-600 text-sm mb-3">Learn how credits work and how to manage your usage effectively.</p>
                  <div className="flex items-center text-brand-primary text-sm">
                    <span>Read article</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>
                
                <Link to="/help/ai-best-practices" className="block bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                  <h4 className="font-semibold text-gray-900 mb-2">Best practices for AI-generated content</h4>
                  <p className="text-gray-600 text-sm mb-3">Tips and techniques for getting the best results from our AI.</p>
                  <div className="flex items-center text-brand-primary text-sm">
                    <span>Read article</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>
                
                <Link to="/help/team-collaboration" className="block bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                  <h4 className="font-semibold text-gray-900 mb-2">Setting up team collaboration</h4>
                  <p className="text-gray-600 text-sm mb-3">Learn how to work with others on your writing projects.</p>
                  <div className="flex items-center text-brand-primary text-sm">
                    <span>Read article</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}