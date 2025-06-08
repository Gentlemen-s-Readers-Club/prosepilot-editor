import React from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '../../components/Navigation';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import { 
  ArrowLeft,
  CreditCard,
  Clock,
  Users,
  Eye,
  ChevronRight,
  Zap,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Calendar,
  TrendingUp,
  Package
} from 'lucide-react';

export function CreditSystem() {
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
            <span className="text-sm text-gray-500">Billing & Subscriptions</span>
          </div>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Understanding the credit system
              </h1>
              <div className="flex items-center text-sm text-gray-500 space-x-4 mb-6">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  3 min read
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  8.2k views
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  Billing & Subscriptions
                </div>
              </div>
              <p className="text-xl text-gray-600 leading-relaxed">
                Learn how ProsePilot's credit system works, how to track your usage, and tips for maximizing 
                your credits to get the most value from your subscription.
              </p>
            </div>
            <div className="ml-8 hidden lg:block">
              <div className="bg-gray-50 rounded-lg p-6 w-64">
                <h3 className="font-semibold text-gray-900 mb-4">In this article</h3>
                <nav className="space-y-2 text-sm">
                  <a href="#what-are-credits" className="block text-gray-600 hover:text-primary">What are credits?</a>
                  <a href="#how-credits-work" className="block text-gray-600 hover:text-primary">How credits work</a>
                  <a href="#credit-costs" className="block text-gray-600 hover:text-primary">Credit costs by plan</a>
                  <a href="#tracking-usage" className="block text-gray-600 hover:text-primary">Tracking your usage</a>
                  <a href="#buying-credits" className="block text-gray-600 hover:text-primary">Buying additional credits</a>
                  <a href="#tips" className="block text-gray-600 hover:text-primary">Tips for maximizing credits</a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          
          {/* What are credits */}
          <section id="what-are-credits" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Zap className="w-8 h-8 text-primary mr-4" />
              What are credits?
            </h2>
            
            <p className="text-gray-700 mb-6">
              Credits are ProsePilot's usage currency that powers our AI book generation. Think of them as tokens 
              that you spend to create books, with each book requiring a specific number of credits based on its 
              length and complexity.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-blue-900 mb-3">Key credit concepts:</h4>
              <div className="space-y-3 text-blue-800">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <strong>One book = 5 credits</strong> - This is our standard rate regardless of your plan
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <strong>Monthly allocation</strong> - Credits are included with your subscription and reset each month
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <strong>No rollover</strong> - Unused monthly credits don't carry over to the next month
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <strong>Additional purchases</strong> - You can buy extra credits that never expire
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How credits work */}
          <section id="how-credits-work" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <RefreshCw className="w-8 h-8 text-primary mr-4" />
              How credits work
            </h2>

            <p className="text-gray-700 mb-6">
              When you create a book, the system deducts 5 credits from your account. The generation process 
              includes everything from initial outline creation to final content generation and consistency checking.
            </p>

            <div className="space-y-6">
              <div className="border rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">What's included in each book generation:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Content Creation</h5>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>• Complete story outline</li>
                      <li>• Character development</li>
                      <li>• Chapter-by-chapter content</li>
                      <li>• Dialogue and narrative</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Quality Assurance</h5>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>• Plot consistency checking</li>
                      <li>• Character continuity</li>
                      <li>• Style and tone consistency</li>
                      <li>• Grammar and flow optimization</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h4 className="font-semibold text-yellow-900 mb-3 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Important: When credits are deducted
                </h4>
                <p className="text-yellow-800 text-sm mb-3">
                  Credits are deducted when you click "Create Book" and the generation process begins. 
                  If generation fails due to a system error, your credits will be automatically refunded.
                </p>
                <p className="text-yellow-800 text-sm">
                  <strong>Note:</strong> Credits are not refunded if you're unsatisfied with the generated content, 
                  but you can always edit the book or generate a new version with different settings.
                </p>
              </div>
            </div>
          </section>

          {/* Credit costs by plan */}
          <section id="credit-costs" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Package className="w-8 h-8 text-primary mr-4" />
              Credit allocation by plan
            </h2>

            <p className="text-gray-700 mb-6">
              Each subscription plan includes a different number of monthly credits. Here's what you get with each plan:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="border rounded-lg p-6 text-center">
                <h4 className="font-semibold text-gray-900 mb-2">Starter</h4>
                <div className="text-3xl font-bold text-primary mb-2">5</div>
                <div className="text-sm text-gray-600 mb-3">credits/month</div>
                <div className="text-sm text-gray-500">= 1 book/month</div>
                <div className="text-lg font-semibold text-gray-900 mt-2">$9/month</div>
              </div>

              <div className="border-2 border-primary rounded-lg p-6 text-center relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">
                  Most Popular
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Pro Author</h4>
                <div className="text-3xl font-bold text-primary mb-2">25</div>
                <div className="text-sm text-gray-600 mb-3">credits/month</div>
                <div className="text-sm text-gray-500">= 5 books/month</div>
                <div className="text-lg font-semibold text-gray-900 mt-2">$29/month</div>
              </div>

              <div className="border rounded-lg p-6 text-center opacity-75">
                <h4 className="font-semibold text-gray-900 mb-2">Studio</h4>
                <div className="text-3xl font-bold text-primary mb-2">75</div>
                <div className="text-sm text-gray-600 mb-3">credits/month</div>
                <div className="text-sm text-gray-500">= 15 books/month</div>
                <div className="text-lg font-semibold text-gray-900 mt-2">$79/month</div>
                <div className="text-xs text-blue-600 mt-2">Coming Soon</div>
              </div>

              <div className="border rounded-lg p-6 text-center opacity-75">
                <h4 className="font-semibold text-gray-900 mb-2">Enterprise</h4>
                <div className="text-3xl font-bold text-primary mb-2">∞</div>
                <div className="text-sm text-gray-600 mb-3">unlimited</div>
                <div className="text-sm text-gray-500">= unlimited books</div>
                <div className="text-lg font-semibold text-gray-900 mt-2">$199/month</div>
                <div className="text-xs text-blue-600 mt-2">Coming Soon</div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-semibold text-green-900 mb-3">💡 Value comparison</h4>
              <div className="text-green-800 text-sm space-y-2">
                <p>• <strong>Starter:</strong> $1.80 per book ($9 ÷ 5 credits)</p>
                <p>• <strong>Pro Author:</strong> $1.16 per book ($29 ÷ 25 credits) - 35% savings!</p>
                <p>• <strong>Studio:</strong> $1.05 per book ($79 ÷ 75 credits) - 42% savings!</p>
              </div>
            </div>
          </section>

          {/* Tracking usage */}
          <section id="tracking-usage" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="w-8 h-8 text-primary mr-4" />
              Tracking your usage
            </h2>

            <p className="text-gray-700 mb-6">
              You can monitor your credit usage and remaining balance from multiple places in your account.
            </p>

            <div className="space-y-6">
              <div className="border rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Where to check your credits:</h4>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</div>
                    <div>
                      <h5 className="font-medium text-gray-900">Dashboard</h5>
                      <p className="text-gray-700 text-sm">Your credit balance is displayed in the top navigation bar</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</div>
                    <div>
                      <h5 className="font-medium text-gray-900">Subscription page</h5>
                      <p className="text-gray-700 text-sm">Detailed usage breakdown with monthly progress bar</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</div>
                    <div>
                      <h5 className="font-medium text-gray-900">Book creation modal</h5>
                      <p className="text-gray-700 text-sm">Shows current balance before you create a new book</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Understanding your usage display:</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Monthly credits used:</span>
                    <span className="font-medium">15/25</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{width: '60%'}}></div>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Remaining: 10 credits</span>
                    <span>Resets: Jan 15, 2025</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Buying additional credits */}
          <section id="buying-credits" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <DollarSign className="w-8 h-8 text-primary mr-4" />
              Buying additional credits
            </h2>

            <p className="text-gray-700 mb-6">
              If you need more credits than your monthly allocation, you can purchase additional credit packages 
              that never expire and stack with your monthly credits.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="border rounded-lg p-6 text-center">
                <h4 className="font-semibold text-gray-900 mb-2">Small Pack</h4>
                <div className="text-2xl font-bold text-primary mb-2">10 credits</div>
                <div className="text-lg font-semibold text-gray-900 mb-3">$20</div>
                <div className="text-sm text-gray-600 mb-4">$2.00 per credit</div>
                <div className="text-sm text-gray-500">= 2 additional books</div>
              </div>

              <div className="border-2 border-green-500 rounded-lg p-6 text-center relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Best Value
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Medium Pack</h4>
                <div className="text-2xl font-bold text-primary mb-2">25 credits</div>
                <div className="text-lg font-semibold text-gray-900 mb-3">$45</div>
                <div className="text-sm text-gray-600 mb-4">$1.80 per credit</div>
                <div className="text-sm text-gray-500">= 5 additional books</div>
                <div className="text-xs text-green-600 mt-2">Save 10%</div>
              </div>

              <div className="border rounded-lg p-6 text-center">
                <h4 className="font-semibold text-gray-900 mb-2">Large Pack</h4>
                <div className="text-2xl font-bold text-primary mb-2">50 credits</div>
                <div className="text-lg font-semibold text-gray-900 mb-3">$80</div>
                <div className="text-sm text-gray-600 mb-4">$1.60 per credit</div>
                <div className="text-sm text-gray-500">= 10 additional books</div>
                <div className="text-xs text-green-600 mt-2">Save 20%</div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-3">How purchased credits work:</h4>
              <ul className="text-blue-800 space-y-2 text-sm">
                <li>• Purchased credits are used first, before monthly credits</li>
                <li>• They never expire, even if you cancel your subscription</li>
                <li>• You can buy multiple packs and they stack together</li>
                <li>• Available for purchase from your subscription page</li>
              </ul>
            </div>
          </section>

          {/* Tips for maximizing credits */}
          <section id="tips" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Zap className="w-8 h-8 text-primary mr-4" />
              Tips for maximizing your credits
            </h2>

            <p className="text-gray-700 mb-6">
              Get the most value from your credits with these proven strategies and best practices.
            </p>

            <div className="space-y-6">
              <div className="border rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Smart usage strategies:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      Plan your books
                    </h5>
                    <ul className="text-gray-700 space-y-1 text-sm ml-7">
                      <li>• Prepare detailed outlines before generation</li>
                      <li>• Use the advanced settings for better results</li>
                      <li>• Consider shorter works to test ideas first</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      Time your usage
                    </h5>
                    <ul className="text-gray-700 space-y-1 text-sm ml-7">
                      <li>• Use monthly credits before they reset</li>
                      <li>• Buy additional credits during sales</li>
                      <li>• Track your monthly usage patterns</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h4 className="font-semibold text-amber-900 mb-3">⚡ Pro tips:</h4>
                <ul className="text-amber-800 space-y-2 text-sm">
                  <li>• <strong>Experiment with settings:</strong> Try different narrator perspectives or tones to find your preferred style</li>
                  <li>• <strong>Edit freely:</strong> The generated content is your starting point - personalize it to make it uniquely yours</li>
                  <li>• <strong>Consider series:</strong> If you're writing a series, maintain consistency by referencing previous books in your prompts</li>
                  <li>• <strong>Upgrade strategically:</strong> If you consistently use all your credits, upgrading to the next plan offers better value</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Related Articles */}
          <section className="border-t pt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link to="/help/create-first-book" className="block bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                <h4 className="font-semibold text-gray-900 mb-2">How to create your first book with AI</h4>
                <p className="text-gray-600 text-sm mb-3">Step-by-step guide to generating your first book using ProsePilot.</p>
                <div className="flex items-center text-primary text-sm">
                  <span>Read article</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
              
              <Link to="/pricing" className="block bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                <h4 className="font-semibold text-gray-900 mb-2">Compare subscription plans</h4>
                <p className="text-gray-600 text-sm mb-3">Find the right plan for your writing goals and budget.</p>
                <div className="flex items-center text-primary text-sm">
                  <span>View pricing</span>
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
          <h3 className="text-2xl font-bold text-white mb-4">Need more credits?</h3>
          <p className="text-white/90 mb-6">Upgrade your plan or purchase additional credit packages.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pricing">
              <Button className="bg-white text-primary hover:bg-gray-100 px-8 py-3">
                View Plans
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/app/subscription">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3">
                Buy Credits
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}