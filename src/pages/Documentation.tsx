import React, { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { 
  BookOpen, 
  Zap, 
  Lightbulb, 
  Settings, 
  HelpCircle, 
  FileText,
  Users,
  Shield,
  CreditCard,
  Sparkles
} from 'lucide-react';

export function Documentation() {
  const [activeSection, setActiveSection] = useState('what-is-prosepilot');

  const sections = [
    { id: 'what-is-prosepilot', label: 'What is ProsePilot?', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'quick-start', label: 'Quick Start Guide', icon: <Zap className="w-4 h-4" /> },
    { id: 'prompt-examples', label: 'Prompt Examples & Tips', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'book-management', label: 'Managing Your Books', icon: <FileText className="w-4 h-4" /> },
    { id: 'editor-features', label: 'Editor Features', icon: <Settings className="w-4 h-4" /> },
    { id: 'ai-features', label: 'AI-Powered Features', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'collaboration', label: 'Collaboration & Sharing', icon: <Users className="w-4 h-4" /> },
    { id: 'subscription', label: 'Subscription & Credits', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'privacy-security', label: 'Privacy & Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'faq', label: 'FAQ', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'what-is-prosepilot':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">What is ProsePilot?</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>
                  ProsePilot is an AI-powered writing platform designed to help authors, writers, and storytellers 
                  create compelling narratives with ease. Whether you're a first-time novelist or an experienced 
                  author, ProsePilot provides the tools and AI assistance you need to bring your stories to life.
                </p>
                
                <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Key Features</h3>
                <ul className="space-y-2">
                  <li><strong>AI Story Generation:</strong> Transform simple ideas into full-length books with our advanced AI</li>
                  <li><strong>Rich Text Editor:</strong> Write and format your content with our intuitive, distraction-free editor</li>
                  <li><strong>Chapter Management:</strong> Organize your story with powerful chapter and page management tools</li>
                  <li><strong>Version Control:</strong> Track changes and manage different versions of your chapters</li>
                  <li><strong>Export Options:</strong> Generate professional PDFs, ePubs, and Kindle-ready formats</li>
                  <li><strong>Cover Generation:</strong> Create stunning book covers with AI assistance</li>
                </ul>

                <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Who is ProsePilot For?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-primary">Aspiring Authors</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Turn your creative ideas into published works with AI guidance and professional formatting tools.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-primary">Content Creators</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Generate engaging stories, blog content, and narrative pieces for your audience.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-primary">Publishers</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Streamline your content production pipeline with bulk generation and team collaboration features.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-primary">Educators</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Create educational content, lesson materials, and teaching resources with AI assistance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'quick-start':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">Quick Start Guide</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>Get started with ProsePilot in just a few simple steps:</p>

                <div className="space-y-6 mt-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">1</div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary">Create Your Account</h3>
                      <p>Sign up for a free account using your email or social login. Choose a subscription plan that fits your needs.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">2</div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary">Start Your First Book</h3>
                      <p>Click "Create New Book" on your dashboard. Provide a story idea or outline - even a single sentence works!</p>
                      <div className="bg-blue-50 p-3 rounded-lg mt-2">
                        <p className="text-sm text-blue-800">
                          <strong>Tip:</strong> The more detail you provide, the better the AI can understand your vision.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">3</div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary">Configure Your Book</h3>
                      <p>Select your book's genre, language, and optional advanced settings like narrator perspective, tone, and literary style.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">4</div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary">Let AI Generate Your Book</h3>
                      <p>Our AI will create a complete book structure with chapters and content based on your input. This usually takes a few minutes.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">5</div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary">Edit and Refine</h3>
                      <p>Use our rich text editor to refine the content, add your personal touch, and make any necessary adjustments.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">6</div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary">Export and Publish</h3>
                      <p>When you're satisfied with your book, export it as a PDF, ePub, or Kindle-ready format for publishing.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-green-800 mb-2">🎉 Congratulations!</h4>
                  <p className="text-green-700">
                    You've just created your first book with ProsePilot. Explore the advanced features to enhance your writing experience even further.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'prompt-examples':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">Prompt Examples & Tips</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>
                  The quality of your book depends heavily on the prompt you provide. Here are examples ranging from simple to elaborate, 
                  along with tips to get the best results from our AI.
                </p>

                <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Simple Prompts (Beginner)</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-primary">Basic Concept</h4>
                    <p className="text-sm text-gray-600 italic mt-1">"A detective solving mysteries in a small town"</p>
                    <p className="text-sm mt-2">Perfect for letting AI take creative control while you provide the core concept.</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-primary">Character-Focused</h4>
                    <p className="text-sm text-gray-600 italic mt-1">"A young wizard discovering their magical powers at school"</p>
                    <p className="text-sm mt-2">Great for character-driven stories where personality development is key.</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-primary">Setting-Based</h4>
                    <p className="text-sm text-gray-600 italic mt-1">"Adventures in a post-apocalyptic world where nature has reclaimed cities"</p>
                    <p className="text-sm mt-2">Ideal when you have a vivid world in mind but need help with plot and characters.</p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Intermediate Prompts</h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-primary">Plot Outline</h4>
                    <p className="text-sm text-gray-600 italic mt-1">
                      "A romance novel about two rival coffee shop owners who are forced to work together when their neighborhood 
                      faces gentrification. They start as enemies but gradually fall in love while fighting to save their community."
                    </p>
                    <p className="text-sm mt-2">Provides clear conflict, character dynamics, and story arc.</p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-primary">Theme-Driven</h4>
                    <p className="text-sm text-gray-600 italic mt-1">
                      "A science fiction story exploring themes of artificial intelligence and human consciousness. 
                      An AI researcher discovers their latest creation may be more human than they realized."
                    </p>
                    <p className="text-sm mt-2">Combines genre elements with deeper philosophical questions.</p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Advanced Prompts (Detailed)</h3>
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-primary">Comprehensive Story Bible</h4>
                    <p className="text-sm text-gray-600 italic mt-1">
                      "A fantasy epic set in the kingdom of Aethermoor, where magic is powered by emotions. 
                      The protagonist is Lyra, a 17-year-old empath who can absorb others' feelings but struggles to control her own power. 
                      When the Emotion Plague begins turning people into emotionless husks, Lyra must journey to the Heartstone Temple 
                      with her cynical mentor Marcus (a former court mage) and Finn (a cheerful bard hiding a dark secret). 
                      The story should explore themes of emotional intelligence, the value of vulnerability, and finding strength in sensitivity. 
                      Include political intrigue as different noble houses blame each other for the plague, and reveal that the true villain 
                      is Lyra's thought-dead mother, who became consumed by others' negative emotions."
                    </p>
                    <p className="text-sm mt-2">Provides world-building, character details, plot structure, themes, and twists.</p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Pro Tips for Better Prompts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-800">✨ Be Specific About Tone</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Instead of "funny story," try "witty dialogue with dry humor" or "slapstick comedy with physical gags."
                    </p>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-800">🎭 Define Character Motivations</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Explain what drives your characters: fears, desires, goals, and internal conflicts.
                    </p>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-800">🌍 Establish Stakes</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      What happens if the protagonist fails? Personal, emotional, or world-ending consequences?
                    </p>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-800">📚 Reference Inspirations</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      "Like Harry Potter but in a modern setting" or "The tone of Terry Pratchett with mystery elements."
                    </p>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-red-800 mb-2">⚠️ What to Avoid</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Vague requests like "write a good story"</li>
                    <li>• Contradictory instructions</li>
                    <li>• Overly complex plots with too many subplots</li>
                    <li>• Requests for inappropriate or harmful content</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'book-management':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">Managing Your Books</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>Learn how to effectively organize, edit, and manage your book collection in ProsePilot.</p>

                <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Book Dashboard</h3>
                <p>Your dashboard provides a comprehensive view of all your books with filtering and search capabilities:</p>
                <ul className="space-y-2 mt-3">
                  <li><strong>Filter by Status:</strong> Draft, Writing, Reviewing, Published, Archived, or Error</li>
                  <li><strong>Filter by Category:</strong> Romance, Fantasy, Mystery, Sci-Fi, and more</li>
                  <li><strong>Filter by Language:</strong> View books in specific languages</li>
                  <li><strong>Search:</strong> Find books quickly by title</li>
                </ul>

                <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Book Status Workflow</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">Writing</span>
                    <span>AI is currently generating your book content</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm font-medium">Draft</span>
                    <span>Book is ready for editing and review</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm font-medium">Reviewing</span>
                    <span>Book is being reviewed and refined</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">Published</span>
                    <span>Book is finalized and ready for distribution</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm font-medium">Archived</span>
                    <span>Book is stored but not actively worked on</span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Chapter Organization</h3>
                <p>Organize your book content with flexible chapter and page management:</p>
                <ul className="space-y-2 mt-3">
                  <li><strong>Drag & Drop Reordering:</strong> Easily rearrange chapters and pages</li>
                  <li><strong>Chapter Types:</strong> Create traditional chapters or standalone pages</li>
                  <li><strong>Inline Editing:</strong> Rename chapters directly from the chapter list</li>
                  <li><strong>Quick Navigation:</strong> Jump between chapters while editing</li>
                </ul>

                <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Version Control</h3>
                <p>Track changes and manage different versions of your content:</p>
                <ul className="space-y-2 mt-3">
                  <li><strong>Automatic Versioning:</strong> Every save creates a new version</li>
                  <li><strong>Version History:</strong> View and compare previous versions</li>
                  <li><strong>Restore Points:</strong> Easily revert to any previous version</li>
                  <li><strong>Change Tracking:</strong> See what changed between versions</li>
                </ul>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-blue-800 mb-2">💡 Pro Tip</h4>
                  <p className="text-blue-700">
                    Use the archive feature for books you're not actively working on to keep your dashboard clean, 
                    but still preserve access to your content.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'editor-features':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">Editor Features</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>Master ProsePilot's powerful rich text editor to create beautifully formatted content.</p>

                <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Text Formatting</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-primary">Basic Formatting</h4>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• Bold, Italic, Underline</li>
                      <li>• Multiple heading levels (H1-H6)</li>
                      <li>• Text alignment options</li>
                      <li>• Bullet and numbered lists</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-primary">Advanced Features</h4>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• Blockquotes for emphasis</li>
                      <li>• Undo/Redo functionality</li>
                      <li>• Keyboard shortcuts</li>
                      <li>• Auto-save capabilities</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Keyboard Shortcuts</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold mb-2">Text Formatting</h4>
                      <ul className="space-y-1">
                        <li><kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl+B</kbd> Bold</li>
                        <li><kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl+I</kbd> Italic</li>
                        <li><kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl+U</kbd> Underline</li>
                        <li><kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl+Shift+X</kbd> Strikethrough</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Actions</h4>
                      <ul className="space-y-1">
                        <li><kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl+Z</kbd> Undo</li>
                        <li><kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl+Y</kbd> Redo</li>
                        <li><kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl+S</kbd> Save</li>
                        <li><kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl+A</kbd> Select All</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Chapter Navigation</h3>
                <p>Efficiently navigate between chapters while editing:</p>
                <ul className="space-y-2 mt-3">
                  <li><strong>Sidebar Navigation:</strong> Collapsible sidebar showing all chapters</li>
                  <li><strong>Quick Jump:</strong> Click any chapter to instantly switch</li>
                  <li><strong>Book Overview:</strong> See book cover, title, and status at a glance</li>
                  <li><strong>Add Content:</strong> Create new chapters or pages without leaving the editor</li>
                </ul>

                <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Distraction-Free Writing</h3>
                <p>The editor is designed to help you focus on your writing:</p>
                <ul className="space-y-2 mt-3">
                  <li><strong>Clean Interface:</strong> Minimal UI that stays out of your way</li>
                  <li><strong>Full-Screen Mode:</strong> Collapse the sidebar for maximum writing space</li>
                  <li><strong>Auto-Save:</strong> Your work is automatically saved as you type</li>
                  <li><strong>Responsive Design:</strong> Works perfectly on desktop, tablet, and mobile</li>
                </ul>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-green-800 mb-2">✍️ Writing Tips</h4>
                  <ul className="text-green-700 space-y-1">
                    <li>• Use headings to structure your chapters clearly</li>
                    <li>• Take advantage of blockquotes for character thoughts or emphasis</li>
                    <li>• Use lists for dialogue-heavy scenes or action sequences</li>
                    <li>• The editor automatically formats your text for professional appearance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'ai-features':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">AI-Powered Features</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>Discover how ProsePilot's AI can enhance every aspect of your writing process.</p>

                <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Story Generation</h3>
                <p>Our core AI feature transforms your ideas into complete narratives:</p>
                <div className="space-y-4 mt-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800">Intelligent Plot Development</h4>
                    <p className="text-blue-700 text-sm mt-1">
                      AI analyzes your prompt to create compelling plot structures, character arcs, and story pacing 
                      that keeps readers engaged from beginning to end.
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800">Character Consistency</h4>
                    <p className="text-blue-700 text-sm mt-1">
                      Advanced algorithms ensure character personalities, motivations, and dialogue remain 
                      consistent throughout your entire book.
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800">Genre Expertise</h4>
                    <p className="text-blue-700 text-sm mt-1">
                      Specialized models trained on different genres ensure your romance feels romantic, 
                      your mystery stays mysterious, and your sci-fi explores fascinating concepts.
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Advanced Customization</h3>
                <p>Fine-tune your AI-generated content with sophisticated options:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-primary">Narrator Perspective</h4>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• First Person ("I walked...")</li>
                      <li>• Third Person Limited</li>
                      <li>• Third Person Omniscient</li>
                      <li>• Second Person (experimental)</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-primary">Writing Tone</h4>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• Formal and Literary</li>
                      <li>• Conversational and Casual</li>
                      <li>• Dark and Mysterious</li>
                      <li>• Light and Humorous</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-primary">Literary Style</h4>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• Contemporary Fiction</li>
                      <li>• Classic Literature</li>
                      <li>• Minimalist Prose</li>
                      <li>• Descriptive and Rich</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-primary">Content Length</h4>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• Short Story (5,000-15,000 words)</li>
                      <li>• Novella (15,000-60,000 words)</li>
                      <li>• Novel (60,000-100,000 words)</li>
                      <li>• Epic (100,000+ words)</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Content Safety & Quality</h3>
                <p>Our AI includes built-in safeguards to ensure high-quality, appropriate content:</p>
                <ul className="space-y-2 mt-3">
                  <li><strong>Content Filtering:</strong> Automatic detection and prevention of inappropriate content</li>
                  <li><strong>Quality Assurance:</strong> AI reviews generated content for coherence and readability</li>
                  <li><strong>Plagiarism Prevention:</strong> Original content generation with no copying from existing works</li>
                  <li><strong>Cultural Sensitivity:</strong> Respectful representation of diverse characters and cultures</li>
                </ul>

                <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Future AI Features</h3>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">🚀 Coming Soon</h4>
                  <ul className="text-purple-700 space-y-1">
                    <li>• AI-powered cover art generation</li>
                    <li>• Intelligent chapter summaries and blurbs</li>
                    <li>• Character relationship mapping</li>
                    <li>• Plot hole detection and suggestions</li>
                    <li>• Style consistency analysis</li>
                    <li>• Automated ISBN and metadata generation</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-yellow-800 mb-2">⚡ Performance Tips</h4>
                  <ul className="text-yellow-700 space-y-1">
                    <li>• More detailed prompts generally produce better results</li>
                    <li>• Specify the target audience for age-appropriate content</li>
                    <li>• Include emotional beats you want to hit in your story</li>
                    <li>• Mention any specific themes or messages you want to convey</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'collaboration':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">Collaboration & Sharing</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>Learn how to collaborate with others and share your work effectively.</p>

                <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Team Features (Studio & Enterprise)</h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800">Multi-User Access</h4>
                    <p className="text-blue-700 text-sm mt-1">
                      Invite team members to collaborate on books with different permission levels: 
                      Viewer, Editor, or Admin access.
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800">Real-Time Collaboration</h4>
                    <p className="text-blue-700 text-sm mt-1">
                      Multiple team members can work on different chapters simultaneously with 
                      automatic conflict resolution and change tracking.
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800">Comment System</h4>
                    <p className="text-blue-700 text-sm mt-1">
                      Leave comments and suggestions on specific paragraphs or chapters for 
                      streamlined feedback and revision processes.
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Sharing Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-primary">Read-Only Sharing</h4>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• Generate shareable links</li>
                      <li>• Password protection options</li>
                      <li>• Expiration date settings</li>
                      <li>• Download permissions control</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-primary">Export & Distribution</h4>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• PDF export (watermarked/clean)</li>
                      <li>• ePub format for e-readers</li>
                      <li>• Kindle-compatible formats</li>
                      <li>• Print-ready formatting</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Workflow Management</h3>
                <p>Organize your collaborative writing process:</p>
                <ul className="space-y-2 mt-3">
                  <li><strong>Status Tracking:</strong> Monitor progress through Draft → Review → Published workflow</li>
                  <li><strong>Assignment System:</strong> Assign specific chapters or tasks to team members</li>
                  <li><strong>Deadline Management:</strong> Set and track deadlines for different project phases</li>
                  <li><strong>Progress Reports:</strong> Automated reports on writing progress and team activity</li>
                </ul>

                <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Publishing Integration</h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800">Publishing Platforms</h4>
                  <p className="text-green-700 text-sm mt-1">
                    Export your finished books in formats compatible with major publishing platforms:
                  </p>
                  <ul className="text-green-700 text-sm mt-2 space-y-1">
                    <li>• Amazon Kindle Direct Publishing (KDP)</li>
                    <li>• Apple Books</li>
                    <li>• Google Play Books</li>
                    <li>• Barnes & Noble Press</li>
                    <li>• Smashwords</li>
                  </ul>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-orange-800 mb-2">🔒 Privacy & Security</h4>
                  <ul className="text-orange-700 space-y-1">
                    <li>• All shared content is encrypted in transit and at rest</li>
                    <li>• Granular permission controls for team access</li>
                    <li>• Audit logs track all changes and access</li>
                    <li>• GDPR compliant data handling</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'subscription':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">Subscription & Credits</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>Understand ProsePilot's pricing model and how to make the most of your subscription.</p>

                <h3 className="text-xl font-semibold text-primary mt-6 mb-3">How Credits Work</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800">Credit System Basics</h4>
                  <ul className="text-blue-700 text-sm mt-2 space-y-1">
                    <li>• Each book generation costs 5 credits</li>
                    <li>• Credits are consumed only when AI generates a complete book</li>
                    <li>• Editing existing books doesn't consume additional credits</li>
                    <li>• Unused credits roll over month to month</li>
                    <li>• Additional credits can be purchased as needed</li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Subscription Plans</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-primary">Starter</h4>
                    <p className="text-2xl font-bold text-primary">$9<span className="text-sm font-normal">/mo</span></p>
                    <ul className="text-sm mt-3 space-y-1">
                      <li>• 5 credits/month (1 book)</li>
                      <li>• Max 15,000 words/book</li>
                      <li>• Basic genres</li>
                      <li>• Watermarked exports</li>
                    </ul>
                  </div>
                  <div className="bg-white border-2 border-primary rounded-lg p-4 relative">
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary text-white px-3 py-1 text-xs rounded">
                      Most Popular
                    </div>
                    <h4 className="font-semibold text-primary">Pro Author</h4>
                    <p className="text-2xl font-bold text-primary">$29<span className="text-sm font-normal">/mo</span></p>
                    <ul className="text-sm mt-3 space-y-1">
                      <li>• 25 credits/month (5 books)</li>
                      <li>• Max 60,000 words/book</li>
                      <li>• All genres & advanced options</li>
                      <li>• Clean exports</li>
                    </ul>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-primary">Studio</h4>
                    <p className="text-2xl font-bold text-primary">$79<span className="text-sm font-normal">/mo</span></p>
                    <ul className="text-sm mt-3 space-y-1">
                      <li>• 75 credits/month (15 books)</li>
                      <li>• Max 100,000 words/book</li>
                      <li>• Team collaboration</li>
                      <li>• Cover generation</li>
                    </ul>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-primary">Enterprise</h4>
                    <p className="text-2xl font-bold text-primary">$199<span className="text-sm font-normal">/mo</span></p>
                    <ul className="text-sm mt-3 space-y-1">
                      <li>• Unlimited credits</li>
                      <li>• Unlimited users</li>
                      <li>• API access</li>
                      <li>• Custom AI tuning</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Managing Your Subscription</h3>
                <p>Access subscription management through your account settings:</p>
                <ul className="space-y-2 mt-3">
                  <li><strong>Upgrade/Downgrade:</strong> Change plans anytime with prorated billing</li>
                  <li><strong>Credit Usage:</strong> Monitor your monthly credit consumption</li>
                  <li><strong>Billing History:</strong> Download invoices and view payment history</li>
                  <li><strong>Auto-Renewal:</strong> Manage automatic subscription renewal settings</li>
                </ul>

                <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Additional Credit Packages</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <h4 className="font-semibold text-primary">Small Pack</h4>
                    <p className="text-xl font-bold text-primary">$20</p>
                    <p className="text-sm text-gray-600">10 credits (2 books)</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <h4 className="font-semibold text-primary">Medium Pack</h4>
                    <p className="text-xl font-bold text-primary">$45</p>
                    <p className="text-sm text-gray-600">25 credits (5 books)</p>
                    <p className="text-xs text-green-600">Save 10%</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <h4 className="font-semibold text-primary">Large Pack</h4>
                    <p className="text-xl font-bold text-primary">$80</p>
                    <p className="text-sm text-gray-600">50 credits (10 books)</p>
                    <p className="text-xs text-green-600">Save 20%</p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-yellow-800 mb-2">💰 Cost Optimization Tips</h4>
                  <ul className="text-yellow-700 space-y-1">
                    <li>• Plan your book projects to maximize monthly credit usage</li>
                    <li>• Use detailed prompts to reduce the need for regeneration</li>
                    <li>• Consider upgrading temporarily for busy writing periods</li>
                    <li>• Take advantage of bulk credit packages for better rates</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'privacy-security':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">Privacy & Security</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>Learn how ProsePilot protects your data and creative work.</p>

                <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Data Protection</h3>
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800">Encryption</h4>
                    <p className="text-green-700 text-sm mt-1">
                      All your content is encrypted using industry-standard AES-256 encryption both 
                      in transit and at rest. Your creative work is protected at every step.
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800">Data Ownership</h4>
                    <p className="text-green-700 text-sm mt-1">
                      You retain full ownership of all content you create. ProsePilot never claims 
                      rights to your stories, characters, or creative work.
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800">Secure Infrastructure</h4>
                    <p className="text-green-700 text-sm mt-1">
                      Our servers are hosted on enterprise-grade cloud infrastructure with 
                      24/7 monitoring, automatic backups, and disaster recovery protocols.
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Privacy Controls</h3>
                <ul className="space-y-2 mt-3">
                  <li><strong>Account Privacy:</strong> Control who can see your profile and published works</li>
                  <li><strong>Data Export:</strong> Download all your data in standard formats anytime</li>
                  <li><strong>Account Deletion:</strong> Permanently delete your account and all associated data</li>
                  <li><strong>Newsletter Preferences:</strong> Granular control over email communications</li>
                </ul>

                <h3 className="text-xl font-semibold text-primary mt-6 mb-3">AI Training & Content Use</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">🤖 AI Training Policy</h4>
                  <ul className="text-blue-700 space-y-1">
                    <li>• Your content is NOT used to train our AI models</li>
                    <li>• AI processing is done in isolated, secure environments</li>
                    <li>• Generated content is unique and not stored in training datasets</li>
                    <li>• We use only publicly available, licensed content for AI training</li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Compliance & Standards</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-primary">GDPR Compliance</h4>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• Right to access your data</li>
                      <li>• Right to rectification</li>
                      <li>• Right to erasure</li>
                      <li>• Data portability</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-primary">Security Standards</h4>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• SOC 2 Type II certified</li>
                      <li>• Regular security audits</li>
                      <li>• Penetration testing</li>
                      <li>• Vulnerability assessments</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-primary mt-6 mb-3">Account Security</h3>
                <p>Protect your account with these security features:</p>
                <ul className="space-y-2 mt-3">
                  <li><strong>Strong Passwords:</strong> Password strength requirements and recommendations</li>
                  <li><strong>Two-Factor Authentication:</strong> Optional 2FA for enhanced account security</li>
                  <li><strong>Login Monitoring:</strong> Alerts for suspicious login attempts</li>
                  <li><strong>Session Management:</strong> Control active sessions and remote logout</li>
                </ul>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-red-800 mb-2">🚨 Security Best Practices</h4>
                  <ul className="text-red-700 space-y-1">
                    <li>• Use a unique, strong password for your ProsePilot account</li>
                    <li>• Enable two-factor authentication when available</li>
                    <li>• Log out from shared or public computers</li>
                    <li>• Report any suspicious activity immediately</li>
                    <li>• Keep your email account secure as it's used for account recovery</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'faq':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">Frequently Asked Questions</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <div className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-primary mb-2">How does the AI generate books?</h3>
                    <p className="text-gray-700">
                      Our AI uses advanced language models trained on diverse literary works to understand 
                      story structure, character development, and genre conventions. When you provide a prompt, 
                      the AI analyzes your requirements and generates original content that matches your vision.
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-primary mb-2">Do I own the content generated by AI?</h3>
                    <p className="text-gray-700">
                      Yes, you retain full ownership of all content generated through ProsePilot. The AI-generated 
                      text becomes your intellectual property, and you're free to publish, sell, or distribute 
                      it as you see fit.
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-primary mb-2">Can I edit the AI-generated content?</h3>
                    <p className="text-gray-700">
                      Absolutely! The AI-generated content serves as a foundation that you can edit, refine, 
                      and personalize. Our rich text editor makes it easy to modify any part of your book 
                      to match your exact vision.
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-primary mb-2">What if I'm not satisfied with the generated book?</h3>
                    <p className="text-gray-700">
                      If the initial generation doesn't meet your expectations, you can try refining your prompt 
                      and generating again. We also offer a satisfaction guarantee - contact our support team 
                      if you're not happy with the results.
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-primary mb-2">How long does it take to generate a book?</h3>
                    <p className="text-gray-700">
                      Book generation typically takes 3-10 minutes depending on the length and complexity. 
                      Shorter works (under 20,000 words) usually complete in 3-5 minutes, while longer 
                      novels may take up to 10 minutes.
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-primary mb-2">Can I collaborate with others on my books?</h3>
                    <p className="text-gray-700">
                      Yes! Studio and Enterprise plans include collaboration features. You can invite team 
                      members to view, edit, or comment on your books. Each collaborator can have different 
                      permission levels based on their role.
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-primary mb-2">What export formats are available?</h3>
                    <p className="text-gray-700">
                      You can export your books as PDF, ePub, and Kindle-compatible formats. Higher-tier 
                      plans include additional formats and remove watermarks for professional publishing.
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-primary mb-2">Is there a limit to how many books I can create?</h3>
                    <p className="text-gray-700">
                      The number of books you can create depends on your subscription plan and available credits. 
                      Each book costs 5 credits to generate. You can purchase additional credits if needed.
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-primary mb-2">Can I cancel my subscription anytime?</h3>
                    <p className="text-gray-700">
                      Yes, you can cancel your subscription at any time. You'll continue to have access to 
                      premium features until the end of your current billing period. Your books remain 
                      accessible even after cancellation.
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-primary mb-2">Do you offer refunds?</h3>
                    <p className="text-gray-700">
                      We offer a 30-day money-back guarantee for new subscribers. If you're not satisfied 
                      with ProsePilot within your first 30 days, contact our support team for a full refund.
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
                    <h4 className="font-semibold text-blue-800 mb-2">Still have questions?</h4>
                    <p className="text-blue-700">
                      Can't find the answer you're looking for? Our support team is here to help! 
                      Contact us at <a href="mailto:support@prosepilot.com" className="underline">support@prosepilot.com</a> 
                      or use the chat widget in the bottom right corner.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-background pt-16">
      <Navigation />
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="w-64 shrink-0">
              <div className="sticky top-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">Documentation</h2>
                <nav className="flex flex-col gap-1">
                  {sections.map(({ id, label, icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveSection(id)}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${
                        activeSection === id
                          ? 'bg-primary text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {icon}
                      <span className="text-sm">{label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="bg-card rounded-lg shadow p-8">
                {renderSection()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}