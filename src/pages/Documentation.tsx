import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Zap, 
  HelpCircle, 
  Settings, 
  Edit3, 
  Brain, 
  Users, 
  CreditCard, 
  Shield,
  ChevronRight,
  Lightbulb,
  Target,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Navigation } from '../components/Navigation';

interface Section {
  id: string;
  label: string;
  icon: JSX.Element;
}

const sections: Section[] = [
  { id: 'what-is-prosepilot', label: 'What is ProsePilot?', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'quick-start', label: 'Quick Start Guide', icon: <Zap className="w-4 h-4" /> },
  { id: 'prompt-examples', label: 'Prompt Examples & Tips', icon: <Lightbulb className="w-4 h-4" /> },
  { id: 'managing-books', label: 'Managing Your Books', icon: <Settings className="w-4 h-4" /> },
  { id: 'editor-features', label: 'Editor Features', icon: <Edit3 className="w-4 h-4" /> },
  { id: 'ai-features', label: 'AI-Powered Features', icon: <Brain className="w-4 h-4" /> },
  { id: 'collaboration', label: 'Collaboration & Sharing', icon: <Users className="w-4 h-4" /> },
  { id: 'subscription', label: 'Subscription & Credits', icon: <CreditCard className="w-4 h-4" /> },
  { id: 'privacy', label: 'Privacy & Security', icon: <Shield className="w-4 h-4" /> },
  { id: 'faq', label: 'FAQ', icon: <HelpCircle className="w-4 h-4" /> },
];

export function Documentation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('what-is-prosepilot');

  // Update active section based on URL hash
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash && sections.find(s => s.id === hash)) {
      setActiveSection(hash);
      // Scroll to the section
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.hash]);

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    navigate(`/docs#${sectionId}`, { replace: true });
    
    // Scroll to the section
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'what-is-prosepilot':
        return (
          <div id="what-is-prosepilot" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-4">What is ProsePilot?</h2>
              <p className="text-lg text-gray-600 mb-6">
                ProsePilot is an AI-powered writing platform designed to help authors, writers, and storytellers create compelling narratives with ease. Whether you're a first-time novelist or an experienced author, ProsePilot provides the tools and guidance you need to bring your stories to life.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <Target className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Who It's For</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Aspiring novelists and storytellers</li>
                  <li>• Content creators and bloggers</li>
                  <li>• Students working on creative writing projects</li>
                  <li>• Professional authors looking to streamline their workflow</li>
                  <li>• Anyone with a story to tell</li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-lg p-6">
                <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Key Benefits</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Overcome writer's block with AI assistance</li>
                  <li>• Generate structured, coherent narratives</li>
                  <li>• Save time on plot development and character creation</li>
                  <li>• Maintain consistency across your story</li>
                  <li>• Export professional-quality manuscripts</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-primary mb-4">Core Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Brain className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">AI Story Generation</h4>
                  <p className="text-gray-600 text-sm">Transform your ideas into full-length books with intelligent AI assistance that understands narrative structure.</p>
                </div>

                <div className="text-center">
                  <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Edit3 className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Rich Text Editor</h4>
                  <p className="text-gray-600 text-sm">Write and format your content with our intuitive editor, complete with version control and collaboration features.</p>
                </div>

                <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Settings className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Book Management</h4>
                <p className="text-gray-600 text-sm">Organize your projects with powerful tools for chapter management, status tracking, and manuscript organization.</p>
              </div>
            </div>
          </div>
        );

      case 'quick-start':
        return (
          <div id="quick-start" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-4">Quick Start Guide</h2>
              <p className="text-lg text-gray-600 mb-8">
                Get up and running with ProsePilot in just a few minutes. Follow these simple steps to create your first book.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">1</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Your Account</h3>
                  <p className="text-gray-600 mb-4">Sign up for ProsePilot using your email address or social media accounts. Choose a plan that fits your writing goals.</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">💡 <strong>Tip:</strong> Start with the Starter plan to explore the platform before upgrading.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">2</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Your First Book</h3>
                  <p className="text-gray-600 mb-4">Click "Create New Book" from your dashboard and provide a story idea or outline. The more detail you provide, the better the AI can assist you.</p>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-800"><strong>Example prompt:</strong> "A mystery novel about a detective investigating disappearances in a small coastal town, with supernatural elements and a focus on character development."</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">3</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Customize Your Book</h3>
                  <p className="text-gray-600 mb-4">Select your book's genre, language, narrator perspective, tone, and literature style. These settings help the AI generate content that matches your vision.</p>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-gray-50 rounded p-3">
                      <p className="font-medium text-gray-900">Required Settings:</p>
                      <ul className="text-sm text-gray-600 mt-1">
                        <li>• Categories/Genres</li>
                        <li>• Language</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 rounded p-3">
                      <p className="font-medium text-gray-900">Optional Settings:</p>
                      <ul className="text-sm text-gray-600 mt-1">
                        <li>• Narrator perspective</li>
                        <li>• Writing tone</li>
                        <li>• Literature style</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">4</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Generate and Edit</h3>
                  <p className="text-gray-600 mb-4">Once your book is generated, you can edit chapters, add new content, and refine the story using our rich text editor. The AI provides a solid foundation that you can build upon.</p>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-800">✅ <strong>Remember:</strong> The AI-generated content is a starting point. Feel free to edit, expand, and make it uniquely yours!</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">5</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Export and Publish</h3>
                  <p className="text-gray-600 mb-4">When you're satisfied with your book, export it to various formats (PDF, ePub, Kindle) and share it with the world or continue refining it.</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">⏱️ Estimated Time</h3>
              <p className="text-yellow-700">From account creation to your first generated book: <strong>5-10 minutes</strong></p>
            </div>
          </div>
        );

      case 'prompt-examples':
        return (
          <div id="prompt-examples" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-4">Prompt Examples & Tips</h2>
              <p className="text-lg text-gray-600 mb-8">
                Learn how to write effective prompts that help the AI generate exactly the kind of story you want. From simple concepts to detailed outlines, here's how to get the best results.
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-primary mb-4">🌱 Simple Prompts (Beginner)</h3>
                <p className="text-gray-600 mb-4">Start with basic concepts and let the AI expand on them:</p>
                
                <div className="space-y-4">
                  <div className="bg-green-50 border-l-4 border-green-400 p-4">
                    <p className="font-medium text-green-800">Example 1: Genre + Setting</p>
                    <p className="text-green-700 mt-1">"A romance novel set in a small bookstore in Paris."</p>
                  </div>
                  
                  <div className="bg-green-50 border-l-4 border-green-400 p-4">
                    <p className="font-medium text-green-800">Example 2: Character + Situation</p>
                    <p className="text-green-700 mt-1">"A retired teacher discovers a hidden talent for solving cold cases."</p>
                  </div>
                  
                  <div className="bg-green-50 border-l-4 border-green-400 p-4">
                    <p className="font-medium text-green-800">Example 3: Concept + Twist</p>
                    <p className="text-green-700 mt-1">"A time travel story where the protagonist can only go back 24 hours."</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-primary mb-4">🌿 Intermediate Prompts</h3>
                <p className="text-gray-600 mb-4">Add more detail about characters, themes, and plot structure:</p>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <p className="font-medium text-blue-800">Example 1: Character-Driven Drama</p>
                    <p className="text-blue-700 mt-1">"A psychological thriller about a forensic psychologist who starts experiencing the same symptoms as her patients. The story explores themes of identity, mental health, and the thin line between sanity and madness. Set in modern-day Seattle with a focus on character development and internal conflict."</p>
                  </div>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <p className="font-medium text-blue-800">Example 2: World-Building Focus</p>
                    <p className="text-blue-700 mt-1">"A fantasy adventure in a world where magic is powered by emotions. The stronger the emotion, the more powerful the magic, but it comes at the cost of the caster's memories. Follow a young mage who must choose between saving her kingdom and preserving her identity."</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-primary mb-4">🌳 Advanced Prompts (Detailed)</h3>
                <p className="text-gray-600 mb-4">Provide comprehensive outlines with character arcs, themes, and structure:</p>
                
                <div className="bg-purple-50 border-l-4 border-purple-400 p-6">
                  <p className="font-medium text-purple-800 mb-3">Example: Multi-Layered Mystery</p>
                  <div className="text-purple-700 space-y-2">
                    <p><strong>Setting:</strong> 1920s Chicago during Prohibition</p>
                    <p><strong>Main Character:</strong> Elena Vasquez, a Mexican-American journalist who writes for a Spanish-language newspaper</p>
                    <p><strong>Plot:</strong> Elena investigates the disappearance of several immigrant women, uncovering a conspiracy involving corrupt police, bootleggers, and human trafficking</p>
                    <p><strong>Themes:</strong> Immigration, women's rights, corruption, identity, and justice</p>
                    <p><strong>Structure:</strong> Three-act structure with parallel timelines showing Elena's investigation and flashbacks revealing the victims' stories</p>
                    <p><strong>Tone:</strong> Noir atmosphere with social commentary, balancing dark themes with hope and resilience</p>
                    <p><strong>Character Arc:</strong> Elena starts as an idealistic reporter but learns to navigate moral gray areas while maintaining her integrity</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-primary mb-4">💡 Pro Tips for Better Prompts</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">✅ Do This</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Be specific about genre and tone</li>
                      <li>• Include character motivations</li>
                      <li>• Mention themes you want to explore</li>
                      <li>• Specify the target audience</li>
                      <li>• Include any unique elements or twists</li>
                      <li>• Mention pacing preferences (fast/slow)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-red-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">❌ Avoid This</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Vague descriptions like "a good story"</li>
                      <li>• Contradictory genre elements</li>
                      <li>• Too many complex subplots</li>
                      <li>• Overly restrictive requirements</li>
                      <li>• Copying existing works exactly</li>
                      <li>• Inappropriate or harmful content</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-yellow-800 mb-2">🎯 Quick Prompt Formula</h4>
                <p className="text-yellow-700 mb-3">For best results, try this structure:</p>
                <div className="bg-white rounded p-4 border border-yellow-200">
                  <p className="font-mono text-sm text-gray-800">
                    [Genre] + [Main Character] + [Central Conflict] + [Setting] + [Theme/Tone] + [Unique Element]
                  </p>
                </div>
                <p className="text-yellow-700 mt-3 text-sm">
                  <strong>Example:</strong> "A sci-fi thriller about a space station engineer who discovers the AI controlling their life support is becoming sentient. Set on a remote mining station in 2157, exploring themes of artificial consciousness and human survival, with a claustrophobic atmosphere and moral dilemmas about AI rights."
                </p>
              </div>
            </div>
          </div>
        );

      case 'managing-books':
        return (
          <div id="managing-books" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-4">Managing Your Books</h2>
              <p className="text-lg text-gray-600 mb-8">
                Learn how to organize, track, and manage your writing projects effectively within ProsePilot.
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-primary mb-4">📚 Book Dashboard</h3>
                <p className="text-gray-600 mb-4">Your dashboard is the central hub for all your writing projects:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Filtering & Search</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Filter by category, language, or status</li>
                      <li>• Search books by title</li>
                      <li>• Sort by creation date or last modified</li>
                      <li>• View archived projects separately</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Book Information</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Cover image and title display</li>
                      <li>• Status badges for quick identification</li>
                      <li>• Category and language tags</li>
                      <li>• Last modified timestamps</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-primary mb-4">📊 Book Status Workflow</h3>
                <p className="text-gray-600 mb-4">Understanding the different stages of your book's lifecycle:</p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                    <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">Writing</div>
                    <div>
                      <p className="font-medium text-gray-900">AI is generating your book</p>
                      <p className="text-gray-600 text-sm">This process typically takes a few minutes. You'll receive a notification when it's complete.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg">
                    <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">Draft</div>
                    <div>
                      <p className="font-medium text-gray-900">Ready for editing and refinement</p>
                      <p className="text-gray-600 text-sm">Your book has been generated and is ready for you to review, edit, and enhance.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                    <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">Reviewing</div>
                    <div>
                      <p className="font-medium text-gray-900">Under review or being edited</p>
                      <p className="text-gray-600 text-sm">Mark your book as "reviewing" when you're actively working on revisions.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">Published</div>
                    <div>
                      <p className="font-medium text-gray-900">Completed and published</p>
                      <p className="text-gray-600 text-sm">Your final version. Published books are read-only to preserve the final version.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-medium">Archived</div>
                    <div>
                      <p className="font-medium text-gray-900">Stored but not actively worked on</p>
                      <p className="text-gray-600 text-sm">Archive books you're not currently working on to keep your dashboard organized.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-primary mb-4">📖 Chapter Organization</h3>
                <p className="text-gray-600 mb-4">Organize your book's structure with chapters and pages:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Chapters vs Pages</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium text-gray-800">📚 Chapters</p>
                        <p className="text-gray-600 text-sm">Main story sections with substantial content</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">📄 Pages</p>
                        <p className="text-gray-600 text-sm">Standalone content like prologues, epilogues, or appendices</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Organization Features</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Drag and drop to reorder</li>
                      <li>• Rename chapters inline</li>
                      <li>• Add new chapters or pages</li>
                      <li>• Delete unwanted sections</li>
                      <li>• Navigate between chapters easily</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'editor-features':
        return (
          <div id="editor-features" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-4">Editor Features</h2>
              <p className="text-lg text-gray-600 mb-8">
                Master the rich text editor and discover all the tools available for crafting your story.
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-primary mb-4">✏️ Text Formatting</h3>
                <p className="text-gray-600 mb-4">Format your text with professional typography options:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Basic Formatting</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li>• <strong>Bold</strong> text</li>
                      <li>• <em>Italic</em> text</li>
                      <li>• <u>Underlined</u> text</li>
                      <li>• Text alignment options</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Structure</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Headings (H1-H6)</li>
                      <li>• Bullet lists</li>
                      <li>• Numbered lists</li>
                      <li>• Block quotes</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Advanced</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Undo/Redo</li>
                      <li>• Text alignment</li>
                      <li>• Paragraph spacing</li>
                      <li>• Custom styling</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-primary mb-4">⌨️ Keyboard Shortcuts</h3>
                <p className="text-gray-600 mb-4">Speed up your writing with these helpful shortcuts:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Formatting Shortcuts</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bold</span>
                        <code className="bg-white px-2 py-1 rounded">Ctrl+B</code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Italic</span>
                        <code className="bg-white px-2 py-1 rounded">Ctrl+I</code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Underline</span>
                        <code className="bg-white px-2 py-1 rounded">Ctrl+U</code>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Editor Shortcuts</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Undo</span>
                        <code className="bg-white px-2 py-1 rounded">Ctrl+Z</code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Redo</span>
                        <code className="bg-white px-2 py-1 rounded">Ctrl+Y</code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Save</span>
                        <code className="bg-white px-2 py-1 rounded">Ctrl+S</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-primary mb-4">🔄 Version Control</h3>
                <p className="text-gray-600 mb-4">Track changes and manage different versions of your chapters:</p>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h4 className="font-semibold text-yellow-800 mb-3">How Version Control Works</h4>
                  <ul className="text-yellow-700 space-y-2">
                    <li>• Each time you save, a new version is created</li>
                    <li>• View version history with timestamps</li>
                    <li>• Compare different versions side by side</li>
                    <li>• Restore any previous version if needed</li>
                    <li>• Versions are automatically numbered for easy reference</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-primary mb-4">🧭 Navigation</h3>
                <p className="text-gray-600 mb-4">Move efficiently between chapters and sections:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Sidebar Navigation</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Collapsible sidebar for more writing space</li>
                      <li>• Quick chapter switching</li>
                      <li>• Book overview and cover display</li>
                      <li>• Add new chapters directly from sidebar</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Chapter Management</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Edit chapter titles inline</li>
                      <li>• Navigate back to book details</li>
                      <li>• Chapter type indicators (chapter/page)</li>
                      <li>• Status-aware editing (read-only for published)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'ai-features':
        return (
          <div id="ai-features" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-4">AI-Powered Features</h2>
              <p className="text-lg text-gray-600 mb-8">
                Discover how ProsePilot's AI assists you in creating compelling, well-structured narratives.
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-primary mb-4">🤖 Story Generation Process</h3>
                <p className="text-gray-600 mb-4">Understanding how the AI transforms your ideas into complete stories:</p>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                    <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">1</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Prompt Analysis</h4>
                      <p className="text-gray-600 text-sm">The AI analyzes your prompt to understand genre, themes, characters, and plot elements.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                    <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">2</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Structure Planning</h4>
                      <p className="text-gray-600 text-sm">Creates a coherent narrative structure with proper pacing and chapter organization.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg">
                    <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">3</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Content Generation</h4>
                      <p className="text-gray-600 text-sm">Generates chapters with consistent characters, plot development, and your specified tone.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 bg-orange-50 rounded-lg">
                    <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">4</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Quality Review</h4>
                      <p className="text-gray-600 text-sm">Ensures narrative consistency, proper flow, and adherence to your specifications.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-primary mb-4">⚙️ Customization Options</h3>
                <p className="text-gray-600 mb-4">Fine-tune the AI's output to match your vision:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Basic Settings</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li>• <strong>Categories:</strong> Genre and subgenre selection</li>
                      <li>• <strong>Language:</strong> Writing language preference</li>
                      <li>• <strong>Length:</strong> Varies by subscription plan</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Advanced Settings</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li>• <strong>Narrator:</strong> First person, third person, etc.</li>
                      <li>• <strong>Tone:</strong> Serious, humorous, dark, light</li>
                      <li>• <strong>Style:</strong> Literary, commercial, experimental</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-primary mb-4">🛡️ Content Safety & Guidelines</h3>
                <p className="text-gray-600 mb-4">Our AI follows strict guidelines to ensure appropriate content:</p>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h4 className="font-semibold text-red-800 mb-3">Content Policy</h4>
                  <p className="text-red-700 mb-3">The AI will not generate content that includes:</p>
                  <ul className="text-red-700 space-y-1">
                    <li>• Explicit violence or graphic content</li>
                    <li>• Hate speech or discriminatory content</li>
                    <li>• Adult or sexual content</li>
                    <li>• Illegal activities or harmful instructions</li>
                    <li>• Copyrighted material or plagiarism</li>
                  </ul>
                  <p className="text-red-700 mt-3 text-sm">If your prompt violates these guidelines, you'll receive specific feedback on how to modify it.</p>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-primary mb-4">🎯 Getting the Best Results</h3>
                <p className="text-gray-600 mb-4">Tips for maximizing the AI's effectiveness:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 rounded-lg p-6">
                    <h4 className="font-semibold text-green-800 mb-3">✅ Best Practices</h4>
                    <ul className="text-green-700 space-y-2">
                      <li>• Provide clear, detailed prompts</li>
                      <li>• Specify your target audience</li>
                      <li>• Include character motivations</li>
                      <li>• Mention desired themes</li>
                      <li>• Set clear genre expectations</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-800 mb-3">💡 Pro Tips</h4>
                    <ul className="text-blue-700 space-y-2">
                      <li>• Use the generated content as a foundation</li>
                      <li>• Edit and personalize the AI output</li>
                      <li>• Experiment with different settings</li>
                      <li>• Combine multiple shorter prompts</li>
                      <li>• Review and refine iteratively</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'collaboration':
        return (
          <div id="collaboration" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-4">Collaboration & Sharing</h2>
              <p className="text-lg text-gray-600 mb-8">
                Learn about team features, sharing options, and publishing integrations available in ProsePilot.
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-primary mb-4">👥 Team Collaboration (Studio Plan)</h3>
                <p className="text-gray-600 mb-4">Work together with your writing team or editors:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Team Features</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Add up to 3 team members</li>
                      <li>• Shared access to all books</li>
                      <li>• Real-time collaborative editing</li>
                      <li>• Comment and suggestion system</li>
                      <li>• Role-based permissions</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Workflow Benefits</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Streamlined review process</li>
                      <li>• Version control for team edits</li>
                      <li>• Centralized project management</li>
                      <li>• Shared credit pool</li>
                      <li>• Team communication tools</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                  <p className="text-yellow-800 text-sm">
                    <strong>Coming Soon:</strong> Team collaboration features are currently in development and will be available with the Studio plan launch.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-primary mb-4">📤 Export & Sharing Options</h3>
                <p className="text-gray-600 mb-4">Multiple ways to share and distribute your completed works:</p>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Export Formats</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="bg-red-100 rounded-lg p-4 mb-2">
                          <p className="font-medium text-red-800">PDF</p>
                        </div>
                        <p className="text-sm text-gray-600">Professional formatting for print or digital distribution</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="bg-blue-100 rounded-lg p-4 mb-2">
                          <p className="font-medium text-blue-800">ePub</p>
                        </div>
                        <p className="text-sm text-gray-600">Standard e-book format for most e-readers</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="bg-orange-100 rounded-lg p-4 mb-2">
                          <p className="font-medium text-orange-800">Kindle</p>
                        </div>
                        <p className="text-sm text-gray-600">Optimized for Amazon Kindle devices and apps</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-primary mb-4">🚀 Publishing Integration</h3>
                <p className="text-gray-600 mb-4">Seamless integration with popular publishing platforms:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Self-Publishing Platforms</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Amazon Kindle Direct Publishing (KDP)</li>
                      <li>• Apple Books</li>
                      <li>• Google Play Books</li>
                      <li>• Barnes & Noble Press</li>
                      <li>• Smashwords</li>
                    </ul>
                  </div>
                  
                  <div className="bg-orange-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Publishing Features</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Metadata generation</li>
                      <li>• ISBN assignment (Studio plan)</li>
                      <li>• Cover design assistance</li>
                      <li>• Formatting optimization</li>
                      <li>• Marketing copy generation</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-blue-800 text-sm">
                    <strong>Note:</strong> Publishing integrations and advanced publishing features are available with Pro Author plan and above.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-primary mb-4">🔗 Sharing & Feedback</h3>
                <p className="text-gray-600 mb-4">Get feedback and share your work with others:</p>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Sharing Options</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-800 mb-2">Private Sharing</p>
                        <ul className="text-gray-600 text-sm space-y-1">
                          <li>• Share with specific email addresses</li>
                          <li>• Password-protected links</li>
                          <li>• Time-limited access</li>
                          <li>• Download restrictions</li>
                        </ul>
                      </div>
                      
                      <div>
                        <p className="font-medium text-gray-800 mb-2">Public Sharing</p>
                        <ul className="text-gray-600 text-sm space-y-1">
                          <li>• Public preview links</li>
                          <li>• Social media integration</li>
                          <li>• Embed options for websites</li>
                          <li>• Community showcase</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'subscription':
        return (
          <div id="subscription" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-4">Subscription & Credits</h2>
              <p className="text-lg text-gray-600 mb-8">
                Understand ProsePilot's pricing model, credit system, and how to manage your subscription.
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-primary mb-4">💳 Subscription Plans</h3>
                <p className="text-gray-600 mb-4">Choose the plan that best fits your writing needs:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 className="font-semibold text-green-800 mb-2">Starter</h4>
                    <p className="text-2xl font-bold text-green-800 mb-2">$9/mo</p>
                    <p className="text-green-700 text-sm mb-3">5 credits/month (1 book)</p>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li>• Max 15,000 words/book</li>
                      <li>• Basic genres</li>
                      <li>• Watermarked exports</li>
                      <li>• Community support</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-6 relative">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Most Popular
                    </div>
                    <h4 className="font-semibold text-blue-800 mb-2">Pro Author</h4>
                    <p className="text-2xl font-bold text-blue-800 mb-2">$29/mo</p>
                    <p className="text-blue-700 text-sm mb-3">25 credits/month (5 books)</p>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• Max 60,000 words/book</li>
                      <li>• All genres & advanced settings</li>
                      <li>• Clean exports</li>
                      <li>• Priority support</li>
                    </ul>
                  </div>
                  
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 opacity-75">
                    <div className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium mb-2 inline-block">
                      Coming Soon
                    </div>
                    <h4 className="font-semibold text-orange-800 mb-2">Studio</h4>
                    <p className="text-2xl font-bold text-orange-800 mb-2">$79/mo</p>
                    <p className="text-orange-700 text-sm mb-3">75 credits/month (15 books)</p>
                    <ul className="text-orange-700 text-sm space-y-1">
                      <li>• Max 100,000 words/book</li>
                      <li>• Team collaboration</li>
                      <li>• AI illustrations</li>
                      <li>• Live chat support</li>
                    </ul>
                  </div>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 opacity-75">
                    <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium mb-2 inline-block">
                      Coming Soon
                    </div>
                    <h4 className="font-semibold text-red-800 mb-2">Enterprise</h4>
                    <p className="text-2xl font-bold text-red-800 mb-2">$199/mo</p>
                    <p className="text-red-700 text-sm mb-3">Unlimited credits</p>
                    <ul className="text-red-700 text-sm space-y-1">
                      <li>• Unlimited everything</li>
                      <li>• API access</li>
                      <li>• Custom AI tuning</li>
                      <li>• Dedicated support</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-primary mb-4">🪙 Credit System</h3>
                <p className="text-gray-600 mb-4">Understanding how credits work and how to manage them:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">How Credits Work</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li>• <strong>1 book = 5 credits</strong> to generate</li>
                      <li>• Credits reset monthly with your subscription</li>
                      <li>• Unused credits don't roll over</li>
                      <li>• Additional credits can be purchased</li>
                      <li>• Credits are consumed when generation starts</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Credit Packages</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">10 Credits</span>
                        <span className="font-semibold">$20</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">25 Credits</span>
                        <span className="font-semibold">$45 <span className="text-green-600 text-sm">(Save 10%)</span></span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">50 Credits</span>
                        <span className="font-semibold">$80 <span className="text-green-600 text-sm">(Save 20%)</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-primary mb-4">⚙️ Managing Your Subscription</h3>
                <p className="text-gray-600 mb-4">How to update, pause, or cancel your subscription:</p>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Subscription Management</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="font-medium text-gray-800 mb-2">Upgrading/Downgrading</p>
                        <ul className="text-gray-600 text-sm space-y-1">
                          <li>• Changes take effect next billing cycle</li>
                          <li>• Prorated billing for upgrades</li>
                          <li>• Keep current features until cycle ends</li>
                          <li>• No refunds for downgrades</li>
                        </ul>
                      </div>
                      
                      <div>
                        <p className="font-medium text-gray-800 mb-2">Cancellation</p>
                        <ul className="text-gray-600 text-sm space-y-1">
                          <li>• Cancel anytime from your account</li>
                          <li>• Access continues until period ends</li>
                          <li>• Books remain accessible (read-only)</li>
                          <li>• Can reactivate anytime</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-primary mb-4">💰 Billing & Payments</h3>
                <p className="text-gray-600 mb-4">Payment methods, billing cycles, and invoice management:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Payment Options</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Credit and debit cards</li>
                      <li>• PayPal</li>
                      <li>• Bank transfers (Enterprise)</li>
                      <li>• Secure payment processing</li>
                      <li>• Automatic billing</li>
                    </ul>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Billing Features</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Monthly or annual billing</li>
                      <li>• Downloadable invoices</li>
                      <li>• Billing history access</li>
                      <li>• Email notifications</li>
                      <li>• Tax calculations included</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div id="privacy" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-4">Privacy & Security</h2>
              <p className="text-lg text-gray-600 mb-8">
                Learn how ProsePilot protects your data, ensures privacy, and maintains security standards.
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-primary mb-4">🔒 Data Protection</h3>
                <p className="text-gray-600 mb-4">Your creative work and personal information are protected with industry-standard security:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Data Encryption</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li>• End-to-end encryption for all data</li>
                      <li>• SSL/TLS for data transmission</li>
                      <li>• Encrypted database storage</li>
                      <li>• Secure backup systems</li>
                      <li>• Regular security audits</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Access Controls</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Multi-factor authentication</li>
                      <li>• Role-based permissions</li>
                      <li>• Session management</li>
                      <li>• IP address monitoring</li>
                      <li>• Automated logout</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-primary mb-4">📋 Privacy Policy</h3>
                <p className="text-gray-600 mb-4">Understanding how we collect, use, and protect your information:</p>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">What We Collect</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-800 mb-2">Account Information</p>
                        <ul className="text-gray-600 text-sm space-y-1">
                          <li>• Email address</li>
                          <li>• Name and profile details</li>
                          <li>• Subscription information</li>
                          <li>• Payment details (encrypted)</li>
                        </ul>
                      </div>
                      
                      <div>
                        <p className="font-medium text-gray-800 mb-2">Usage Data</p>
                        <ul className="text-gray-600 text-sm space-y-1">
                          <li>• Books and content created</li>
                          <li>• Feature usage analytics</li>
                          <li>• Performance metrics</li>
                          <li>• Error logs (anonymized)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-primary mb-4">🌍 Compliance</h3>
                <p className="text-gray-600 mb-4">ProsePilot complies with international privacy and data protection regulations:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6 text-center">
                    <h4 className="font-semibold text-blue-800 mb-2">GDPR</h4>
                    <p className="text-blue-700 text-sm">European Union General Data Protection Regulation compliance</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-6 text-center">
                    <h4 className="font-semibold text-green-800 mb-2">CCPA</h4>
                    <p className="text-green-700 text-sm">California Consumer Privacy Act compliance</p>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-6 text-center">
                    <h4 className="font-semibold text-purple-800 mb-2">SOC 2</h4>
                    <p className="text-purple-700 text-sm">Security, availability, and confidentiality standards</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-primary mb-4">👤 Your Rights</h3>
                <p className="text-gray-600 mb-4">You have full control over your data and privacy settings:</p>
                
                <div className="space-y-4">
                  <div className="bg-yellow-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Data Rights</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <ul className="text-gray-600 space-y-2">
                          <li>• <strong>Access:</strong> Request copies of your data</li>
                          <li>• <strong>Correction:</strong> Update incorrect information</li>
                          <li>• <strong>Deletion:</strong> Request account and data removal</li>
                        </ul>
                      </div>
                      
                      <div>
                        <ul className="text-gray-600 space-y-2">
                          <li>• <strong>Portability:</strong> Export your content</li>
                          <li>• <strong>Restriction:</strong> Limit data processing</li>
                          <li>• <strong>Objection:</strong> Opt out of certain uses</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-primary mb-4">🛡️ Account Security</h3>
                <p className="text-gray-600 mb-4">Best practices for keeping your account secure:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-red-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Security Recommendations</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Use a strong, unique password</li>
                      <li>• Enable two-factor authentication</li>
                      <li>• Regularly review account activity</li>
                      <li>• Log out from shared devices</li>
                      <li>• Keep your email secure</li>
                    </ul>
                  </div>
                  
                  <div className="bg-orange-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Warning Signs</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Unexpected login notifications</li>
                      <li>• Changes you didn't make</li>
                      <li>• Suspicious account activity</li>
                      <li>• Unfamiliar devices in settings</li>
                      <li>• Phishing email attempts</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'faq':
        return (
          <div id="faq" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600 mb-8">
                Find answers to common questions about ProsePilot's features, pricing, and functionality.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How does the AI generate books?</h3>
                <p className="text-gray-600">
                  ProsePilot uses advanced language models trained on diverse literary works to understand narrative structure, character development, and genre conventions. When you provide a prompt, the AI analyzes your requirements and generates a complete book with coherent plot, consistent characters, and proper pacing. The AI considers your specified genre, tone, narrator perspective, and other settings to create content that matches your vision.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I edit the AI-generated content?</h3>
                <p className="text-gray-600">
                  Absolutely! The AI-generated content is meant to be a foundation for your creativity. You can edit, expand, rewrite, or completely transform any part of the generated book using our rich text editor. Many authors use the AI output as a first draft and then personalize it with their unique voice and style. The version control system tracks all your changes, so you can always revert if needed.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What happens if I run out of credits?</h3>
                <p className="text-gray-600">
                  If you exhaust your monthly credits, you have several options: wait until your next billing cycle for credits to reset, purchase additional credit packages, or upgrade to a higher plan with more monthly credits. Your existing books remain accessible for editing and export even if you're out of credits. Credits are only consumed when generating new books.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Do I own the rights to AI-generated content?</h3>
                <p className="text-gray-600">
                  Yes, you retain full ownership and copyright of all content generated through ProsePilot. The AI-generated text becomes your intellectual property, and you're free to publish, sell, or distribute it as you wish. We don't claim any rights to your creative work. However, we recommend reviewing and editing the content to ensure it meets your standards and reflects your unique voice.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How long does it take to generate a book?</h3>
                <p className="text-gray-600">
                  Book generation typically takes 3-10 minutes, depending on the length and complexity of your request. Shorter books (15,000 words) generate faster than longer ones (60,000+ words). You'll see a progress indicator during generation, and you'll receive a notification when your book is ready. You can continue using other parts of the platform while generation is in progress.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I collaborate with others on my books?</h3>
                <p className="text-gray-600">
                  Team collaboration features are available with the Studio plan (coming soon). This includes shared access to books, real-time collaborative editing, comment systems, and role-based permissions. Currently, you can share exported versions of your books for feedback, but live collaboration features are in development.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What file formats can I export to?</h3>
                <p className="text-gray-600">
                  ProsePilot supports export to PDF, ePub, and Kindle formats. PDF is great for print or digital distribution, ePub works with most e-readers, and Kindle format is optimized for Amazon's ecosystem. Higher-tier plans include additional formatting options and remove watermarks from exported files.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Is there a limit to how many books I can store?</h3>
                <p className="text-gray-600">
                  There's no limit to how many books you can store in your account. Your storage limit is based on your monthly credit allocation for generating new books. All previously generated books remain accessible indefinitely, even if you downgrade your plan or pause your subscription.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I cancel my subscription anytime?</h3>
                <p className="text-gray-600">
                  Yes, you can cancel your subscription at any time from your account settings. When you cancel, you'll continue to have access to all features until the end of your current billing period. Your books will remain accessible (in read-only mode) even after cancellation, and you can reactivate your subscription anytime to resume editing and generating new content.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What languages does ProsePilot support?</h3>
                <p className="text-gray-600">
                  ProsePilot currently supports multiple languages including English, Spanish, French, German, Italian, Portuguese, and more. The AI can generate content in your selected language and understands cultural nuances and literary conventions specific to each language. The quality and features may vary by language, with English having the most comprehensive support.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Still have questions?</h3>
                <p className="text-blue-700 mb-4">
                  Can't find the answer you're looking for? Our support team is here to help!
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Contact Support
                  </button>
                  <button className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors">
                    Join Community
                  </button>
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
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="w-64 shrink-0">
              <div className="sticky top-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">Documentation</h2>
                <nav className="flex flex-col gap-1">
                  {sections.map(({ id, label, icon }) => (
                    <button
                      key={id}
                      onClick={() => handleSectionClick(id)}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${
                        activeSection === id
                          ? 'bg-primary text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {icon}
                      <span>{label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="bg-card rounded-lg shadow p-6">
                {renderSection()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}