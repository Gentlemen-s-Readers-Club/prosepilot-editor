import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { 
  Search,
  BookOpen,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  ChevronRight,
  HelpCircle,
  FileText,
  Video,
  Users,
  Zap,
  CreditCard,
  Settings,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

const helpCategories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: <BookOpen className="w-6 h-6" />,
    description: 'Learn the basics of ProsePilot',
    articles: [
      'How to create your first book',
      'Understanding credits and pricing',
      'Setting up your author profile',
      'Choosing the right plan for you'
    ]
  },
  {
    id: 'writing-features',
    title: 'Writing Features',
    icon: <FileText className="w-6 h-6" />,
    description: 'Master our AI writing tools',
    articles: [
      'Using AI story generation',
      'Character development tools',
      'Plot consistency checking',
      'Advanced writing settings'
    ]
  },
  {
    id: 'collaboration',
    title: 'Teams & Collaboration',
    icon: <Users className="w-6 h-6" />,
    description: 'Work together with your team',
    articles: [
      'Creating and managing teams',
      'Inviting team members',
      'Setting roles and permissions',
      'Collaborative writing workflows'
    ]
  },
  {
    id: 'publishing',
    title: 'Publishing & Export',
    icon: <Zap className="w-6 h-6" />,
    description: 'Get your book ready for publication',
    articles: [
      'Export formats explained',
      'Preparing for publication',
      'Cover design guidelines',
      'ISBN and metadata setup'
    ]
  },
  {
    id: 'billing',
    title: 'Billing & Subscriptions',
    icon: <CreditCard className="w-6 h-6" />,
    description: 'Manage your account and billing',
    articles: [
      'Upgrading or downgrading plans',
      'Purchasing additional credits',
      'Understanding billing cycles',
      'Cancellation and refunds'
    ]
  },
  {
    id: 'technical',
    title: 'Technical Support',
    icon: <Settings className="w-6 h-6" />,
    description: 'Troubleshooting and technical issues',
    articles: [
      'Browser compatibility',
      'Performance optimization',
      'Data backup and recovery',
      'API documentation'
    ]
  }
];

const popularArticles = [
  {
    title: 'How to create your first book with AI',
    category: 'Getting Started',
    readTime: '5 min read',
    views: '12.5k views'
  },
  {
    title: 'Understanding the credit system',
    category: 'Billing',
    readTime: '3 min read',
    views: '8.2k views'
  },
  {
    title: 'Best practices for AI-generated content',
    category: 'Writing Features',
    readTime: '7 min read',
    views: '6.8k views'
  },
  {
    title: 'Setting up team collaboration',
    category: 'Teams',
    readTime: '4 min read',
    views: '5.1k views'
  }
];

const contactOptions = [
  {
    title: 'Live Chat',
    description: 'Get instant help from our support team',
    icon: <MessageCircle className="w-8 h-8" />,
    availability: 'Available 24/7',
    action: 'Start Chat',
    primary: true
  },
  {
    title: 'Email Support',
    description: 'Send us a detailed message',
    icon: <Mail className="w-8 h-8" />,
    availability: 'Response within 24 hours',
    action: 'Send Email',
    primary: false
  },
  {
    title: 'Phone Support',
    description: 'Speak directly with our team',
    icon: <Phone className="w-8 h-8" />,
    availability: 'Mon-Fri, 9AM-6PM EST',
    action: 'Call Now',
    primary: false
  }
];

const systemStatus = {
  overall: 'operational',
  services: [
    { name: 'AI Generation Service', status: 'operational' },
    { name: 'User Authentication', status: 'operational' },
    { name: 'File Storage', status: 'operational' },
    { name: 'Export Service', status: 'operational' }
  ]
};

export function Support() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCategories = helpCategories.filter(category =>
    !selectedCategory || category.id === selectedCategory
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <div className="bg-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              How can we help you?
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to your questions, get support, and learn how to make the most of ProsePilot.
            </p>
            
            {/* Search Bar */}
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search for help articles, features, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg bg-white border-2 border-gray-200 focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactOptions.map((option, index) => (
              <div
                key={index}
                className={`bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow ${
                  option.primary ? 'ring-2 ring-primary' : ''
                }`}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                  option.primary ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {option.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{option.title}</h3>
                <p className="text-gray-600 mb-3">{option.description}</p>
                <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
                  <Clock className="w-4 h-4 mr-1" />
                  {option.availability}
                </div>
                <Button 
                  className={option.primary ? 'bg-primary hover:bg-primary/90' : 'bg-gray-900 hover:bg-gray-800'}
                >
                  {option.action}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center mr-4">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="font-medium text-gray-900">All Systems Operational</span>
              </div>
              <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-500">
                {systemStatus.services.map((service, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    {service.name}
                  </div>
                ))}
              </div>
            </div>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              Status Page
            </Button>
          </div>
        </div>
      </div>

      {/* Popular Articles */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Popular Help Articles</h2>
            <p className="mt-4 text-xl text-gray-600">
              Quick answers to the most common questions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {popularArticles.map((article, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <div className="mt-2 flex items-center text-sm text-gray-500 space-x-4">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                        {article.category}
                      </span>
                      <span>{article.readTime}</span>
                      <span>{article.views}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Help Categories */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Browse by Category</h2>
            <p className="mt-4 text-xl text-gray-600">
              Find detailed guides and tutorials for every feature
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {helpCategories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="flex items-center mb-4">
                  <div className="bg-primary/10 text-primary p-3 rounded-lg mr-4">
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{category.description}</p>
                  </div>
                </div>
                
                <ul className="space-y-2">
                  {category.articles.slice(0, 3).map((article, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-700 hover:text-primary transition-colors">
                      <ChevronRight className="w-4 h-4 mr-2 text-gray-400" />
                      {article}
                    </li>
                  ))}
                  {category.articles.length > 3 && (
                    <li className="text-sm text-primary font-medium">
                      +{category.articles.length - 3} more articles
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Tutorials */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Video Tutorials</h2>
            <p className="mt-4 text-xl text-gray-600">
              Watch step-by-step guides to master ProsePilot
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Getting Started with ProsePilot',
                duration: '5:32',
                thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
              },
              {
                title: 'Creating Your First AI-Generated Book',
                duration: '8:15',
                thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
              },
              {
                title: 'Advanced Writing Features',
                duration: '12:45',
                thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
              }
            ].map((video, index) => (
              <div key={index} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white rounded-full p-3">
                      <Video className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    {video.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Still Need Help?</h2>
            <p className="mt-4 text-xl text-gray-600">
              Send us a message and we'll get back to you within 24 hours
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-gray-900">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-900">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="subject" className="text-gray-900">Subject</Label>
                <select
                  id="subject"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Select a topic</option>
                  <option value="billing">Billing & Subscriptions</option>
                  <option value="technical">Technical Support</option>
                  <option value="features">Feature Questions</option>
                  <option value="account">Account Issues</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <Label htmlFor="message" className="text-gray-900">Message</Label>
                <textarea
                  id="message"
                  rows={6}
                  placeholder="Describe your issue or question in detail..."
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center">
                <input
                  id="updates"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <Label htmlFor="updates" className="ml-2 text-sm text-gray-700">
                  Send me updates about new features and improvements
                </Label>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 py-3">
                Send Message
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img src="/logo.png" alt="ProsePilot Logo" className="h-8 w-8" />
                <span className="ml-2 text-xl font-bold text-white">ProsePilot</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered writing platform for authors and creators.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/docs" className="text-gray-400 hover:text-white transition-colors">Documentation</Link></li>
                <li><Link to="/app/signup" className="text-gray-400 hover:text-white transition-colors">Sign Up</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/support" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Status Page</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">© 2025 ProsePilot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}