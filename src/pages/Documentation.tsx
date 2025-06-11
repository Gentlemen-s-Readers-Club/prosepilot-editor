import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Sparkles, 
  Users, 
  CreditCard, 
  Search,
  ChevronRight,
  Play,
  FileText,
  Lightbulb,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import Footer from '../components/Footer';

interface DocSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  articles: DocArticle[];
  color: string;
}

interface DocArticle {
  id: string;
  title: string;
  description: string;
  readTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  link: string;
  popular?: boolean;
}

const docSections: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Everything you need to know to start writing with AI',
    icon: <Sparkles className="w-6 h-6" />,
    color: 'from-blue-500 to-cyan-500',
    articles: [
      {
        id: 'first-book',
        title: 'How to create your first book with AI',
        description: 'Step-by-step guide to generating your first book using ProsePilot',
        readTime: '5 min',
        difficulty: 'Beginner',
        link: '/help/create-first-book',
        popular: true
      },
      {
        id: 'ai-best-practices',
        title: 'Best practices for AI-generated content',
        description: 'Tips and techniques for getting the best results from our AI',
        readTime: '7 min',
        difficulty: 'Intermediate',
        link: '/help/ai-best-practices',
        popular: true
      }
    ]
  },
  {
    id: 'billing',
    title: 'Billing & Subscriptions',
    description: 'Manage your account, credits, and subscription plans',
    icon: <CreditCard className="w-6 h-6" />,
    color: 'from-green-500 to-emerald-500',
    articles: [
      {
        id: 'credit-system',
        title: 'Understanding the credit system',
        description: 'Learn how credits work and how to manage your usage effectively',
        readTime: '3 min',
        difficulty: 'Beginner',
        link: '/help/credit-system',
        popular: true
      }
    ]
  },
  {
    id: 'collaboration',
    title: 'Teams & Collaboration',
    description: 'Work together with other writers on shared projects',
    icon: <Users className="w-6 h-6" />,
    color: 'from-purple-500 to-pink-500',
    articles: [
      {
        id: 'team-collaboration',
        title: 'Setting up team collaboration',
        description: 'Learn how to work with others on your writing projects',
        readTime: '4 min',
        difficulty: 'Intermediate',
        link: '/help/team-collaboration'
      }
    ]
  }
];

const quickLinks = [
  { title: 'API Documentation', icon: <FileText className="w-4 h-4" />, link: '#', description: 'Integrate with our API' },
  { title: 'Video Tutorials', icon: <Play className="w-4 h-4" />, link: '#', description: 'Watch step-by-step guides' },
  { title: 'Community Forum', icon: <Users className="w-4 h-4" />, link: '#', description: 'Connect with other writers' },
  { title: 'Feature Requests', icon: <Lightbulb className="w-4 h-4" />, link: '#', description: 'Suggest new features' }
];

const popularTopics = [
  'How to write better prompts',
  'Exporting your finished book',
  'Managing team permissions',
  'Understanding AI limitations',
  'Troubleshooting generation issues'
];

export function Documentation() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-brand-primary via-brand-primary to-brand-accent pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <BookOpen className="w-5 h-5 text-white mr-2" />
              <span className="text-white font-medium">Documentation & Help Center</span>
            </div>
            
            <h1 className="text-5xl font-extrabold text-white mb-6">
              Everything you need to know
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-10">
              Comprehensive guides, tutorials, and resources to help you master AI-powered writing 
              and get the most out of ProsePilot.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg bg-white/95 backdrop-blur-sm border-0 rounded-xl shadow-lg focus:ring-2 focus:ring-white/50"
                />
              </div>
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-10">
                  <p className="text-gray-500 text-sm">Search results for "{searchQuery}"</p>
                  <div className="mt-2 space-y-2">
                    {docSections.flatMap(section => section.articles)
                      .filter(article => 
                        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        article.description.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .slice(0, 5)
                      .map(article => (
                        <Link
                          key={article.id}
                          to={article.link}
                          className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="font-medium text-gray-900">{article.title}</div>
                          <div className="text-sm text-gray-600">{article.description}</div>
                        </Link>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: '50+', label: 'Help Articles', icon: <FileText className="w-5 h-5" /> },
              { number: '10k+', label: 'Questions Answered', icon: <CheckCircle className="w-5 h-5" /> },
              { number: '24/7', label: 'Support Available', icon: <Clock className="w-5 h-5" /> },
              { number: '4.9★', label: 'Help Rating', icon: <Star className="w-5 h-5" /> }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-primary/10 rounded-full mb-3">
                  <div className="text-brand-primary">{stat.icon}</div>
                </div>
                <div className="text-3xl font-bold text-base-heading mb-1">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Main Documentation Sections */}
            <div className="lg:col-span-3">
              <div className="space-y-8">
                {docSections.map((section) => (
                  <div key={section.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Section Header */}
                    <div className={`bg-gradient-to-r ${section.color} p-6`}>
                      <div className="flex items-center text-white">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 mr-4">
                          {section.icon}
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">{section.title}</h2>
                          <p className="text-white/90 mt-1">{section.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Articles */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {section.articles.map((article) => (
                          <Link
                            key={article.id}
                            to={article.link}
                            className="group relative bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-all duration-200 hover:shadow-md"
                          >
                            {article.popular && (
                              <div className="absolute top-4 right-4">
                                <span className="bg-brand-accent text-white text-xs font-medium px-2 py-1 rounded-full">
                                  Popular
                                </span>
                              </div>
                            )}
                            
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="font-semibold text-base-heading group-hover:text-brand-primary transition-colors">
                                {article.title}
                              </h3>
                              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-brand-primary transition-colors" />
                            </div>
                            
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {article.description}
                            </p>
                            
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-3">
                                <span className="text-gray-500">{article.readTime} read</span>
                                <span className={`px-2 py-1 rounded-full ${
                                  article.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                                  article.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {article.difficulty}
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              
              {/* Quick Links */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-base-heading mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-brand-accent" />
                  Quick Links
                </h3>
                <div className="space-y-3">
                  {quickLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.link}
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="text-brand-accent mr-3">{link.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 group-hover:text-brand-primary transition-colors">
                          {link.title}
                        </div>
                        <div className="text-sm text-gray-500">{link.description}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-brand-primary transition-colors" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Popular Topics */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-base-heading mb-4 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-brand-accent" />
                  Popular Topics
                </h3>
                <div className="space-y-2">
                  {popularTopics.map((topic, index) => (
                    <a
                      key={index}
                      href="#"
                      className="block text-sm text-gray-600 hover:text-brand-primary transition-colors py-2 border-b border-gray-100 last:border-0"
                    >
                      {topic}
                    </a>
                  ))}
                </div>
              </div>

              {/* Contact Support */}
              <div className="bg-gradient-to-br from-brand-primary to-brand-accent rounded-2xl p-6 text-white">
                <div className="text-center">
                  <Shield className="w-12 h-12 mx-auto mb-4 text-white/90" />
                  <h3 className="text-lg font-semibold mb-2">Need More Help?</h3>
                  <p className="text-white/90 text-sm mb-4">
                    Can't find what you're looking for? Our support team is here to help.
                  </p>
                  <Link to="/support">
                    <Button className="bg-white text-brand-primary hover:bg-gray-100 w-full">
                      Contact Support
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Globe className="w-12 h-12 text-brand-accent mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-base-heading mb-4">
            Stay Updated
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Get the latest documentation updates, tutorials, and writing tips delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1"
            />
            <Button className="bg-brand-primary hover:bg-brand-primary/90">
              Subscribe
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            No spam, unsubscribe at any time.
          </p>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}