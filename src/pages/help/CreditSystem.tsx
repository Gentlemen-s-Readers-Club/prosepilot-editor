import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "../../components/Navigation";
import { Button } from "../../components/ui/button";
import {
  ArrowLeft,
  Clock,
  Users,
  Eye,
  ChevronRight,
  Zap,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  DollarSign,
  TrendingUp,
  Package,
} from "lucide-react";
import Footer from "../../components/Footer";
import useAnalytics from "../../hooks/useAnalytics";

export function CreditSystem() {
  const { trackPageView } = useAnalytics({
    measurementId: import.meta.env.VITE_ANALYTICS_ID,
  });

  useEffect(() => {
    trackPageView(window.location.pathname);
  }, [trackPageView]);
  
  return (
    <div className="min-h-screen bg-base-background">
      <Navigation />

      {/* Header */}
      <div className="bg-white pt-16 border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link
              to="/docs"
              className="flex items-center text-base-heading hover:text-base-heading/80 mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Documentation
            </Link>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-base-heading mb-4">
                Understanding the credit system
              </h1>
              <div className="flex items-center text-sm text-base-paragraph space-x-4 mb-6">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-brand-accent" />3 min read
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1 text-brand-accent" />
                  8.2k views
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1 text-brand-accent" />
                  Billing & Subscriptions
                </div>
              </div>
              <p className="text-xl text-base-paragraph leading-relaxed">
                Learn how ProsePilot's credit system works, how to track your
                usage, and tips for maximizing your credits to get the most
                value from your subscription.
              </p>
            </div>
            <div className="ml-8 hidden lg:block">
              <div className="bg-gray-50 rounded-lg p-6 w-64">
                <h3 className="font-semibold text-base-heading mb-4">
                  In this article
                </h3>
                <nav className="space-y-2 text-sm">
                  <a
                    href="#what-are-credits"
                    className="block text-base-paragraph hover:text-base-heading"
                  >
                    What are credits?
                  </a>
                  <a
                    href="#how-credits-work"
                    className="block text-base-paragraph hover:text-base-heading"
                  >
                    How credits work
                  </a>
                  <a
                    href="#credit-costs"
                    className="block text-base-paragraph hover:text-base-heading"
                  >
                    Credit costs by plan
                  </a>
                  <a
                    href="#tracking-usage"
                    className="block text-base-paragraph hover:text-base-heading"
                  >
                    Tracking your usage
                  </a>
                  <a
                    href="#buying-credits"
                    className="block text-base-paragraph hover:text-base-heading"
                  >
                    Buying additional credits
                  </a>
                  <a
                    href="#tips"
                    className="block text-base-paragraph hover:text-base-heading"
                  >
                    Tips for maximizing credits
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div>
          {/* What are credits */}
          <section id="what-are-credits" className="mb-12">
            <h2 className="text-3xl font-bold text-base-heading mb-6 flex items-center">
              <Zap className="w-8 h-8 mr-4 text-brand-accent" />
              What are credits?
            </h2>

            <p className="text-gray-700 mb-6">
              Credits are ProsePilot's usage currency that powers our AI book
              generation. Think of them as tokens that you spend to create
              books, with each book requiring a specific number of credits based
              on its length and complexity.
            </p>

            <div className="bg-state-info-light border border-state-info rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-state-info mb-3">
                Key credit concepts:
              </h4>
              <div className="space-y-3 text-state-info">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-state-info mt-0.5 mr-3" />
                  <div>
                    <strong>One book = 5 credits</strong> - This is our standard
                    rate regardless of your plan
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-state-info mt-0.5 mr-3" />
                  <div>
                    <strong>Monthly allocation</strong> - Credits are included
                    with your subscription and reset each month
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-state-info mt-0.5 mr-3" />
                  <div>
                    <strong>Credits accumulate</strong> - Unused monthly credits
                    carry over with no maximum limit
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-state-info mt-0.5 mr-3" />
                  <div>
                    <strong>Additional purchases</strong> - You can buy extra
                    credits that never expire
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How credits work */}
          <section id="how-credits-work" className="mb-12">
            <h2 className="text-3xl font-bold text-base-heading mb-6 flex items-center">
              <RefreshCw className="w-8 h-8 mr-4 text-brand-accent" />
              How credits work
            </h2>

            <p className="text-gray-700 mb-6">
              When you create a book, the system deducts 5 credits from your
              account. The generation process includes everything from initial
              outline creation to final content generation and consistency
              checking.
            </p>

            <div className="space-y-6">
              <div className="border rounded-lg p-6 bg-white">
                <h4 className="font-semibold text-base-heading mb-3">
                  What's included in each book generation:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-base-heading mb-2">
                      Content Creation
                    </h5>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>• Complete story outline</li>
                      <li>• Character development</li>
                      <li>• Chapter-by-chapter content</li>
                      <li>• Dialogue and narrative</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-base-heading mb-2">
                      Quality Assurance
                    </h5>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>• Plot consistency checking</li>
                      <li>• Character continuity</li>
                      <li>• Style and tone consistency</li>
                      <li>• Grammar and flow optimization</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-state-warning-light border border-state-warning rounded-lg p-6">
                <h4 className="font-semibold text-state-warning mb-3 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Important: When credits are deducted
                </h4>
                <p className="text-state-warning text-sm mb-3">
                  Credits are deducted when you click "Create Book" and the
                  generation process begins. If generation fails due to a system
                  error, your credits will be automatically refunded.
                </p>
                <p className="text-state-warning text-sm">
                  <strong>Note:</strong> Credits are not refunded if you're
                  unsatisfied with the generated content, but you can always
                  edit the book or generate a new version with different
                  settings.
                </p>
              </div>
            </div>
          </section>

          {/* Credit costs by plan */}
          <section id="credit-costs" className="mb-12">
            <h2 className="text-3xl font-bold text-base-heading mb-6 flex items-center">
              <Package className="w-8 h-8 mr-4 text-brand-accent" />
              Credit allocation by plan
            </h2>

            <p className="text-gray-700 mb-6">
              Each subscription plan includes a different number of monthly
              credits. Here's what you get with each plan:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="border rounded-lg p-6 text-center bg-white">
                <h4 className="font-semibold text-base-heading mb-2">
                  Starter
                </h4>
                <div className="text-3xl font-bold text-brand-accent mb-2">
                  15
                </div>
                <div className="text-sm text-brand-accent mb-3">
                  credits/month
                </div>
                <div className="text-sm text-base-paragraph">
                  = 3 books
                </div>
                <div className="text-lg font-semibold text-base-heading mt-2">
                  $9/month
                </div>
              </div>

              <div className="border-2 border-base-border rounded-lg p-6 text-center relative bg-white">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-brand-primary text-white px-3 py-1 rounded-full text-xs font-medium">
                  Most Popular
                </div>
                <h4 className="font-semibold text-base-heading mb-2">
                  Pro Author
                </h4>
                <div className="text-3xl font-bold text-brand-accent mb-2">
                  55
                </div>
                <div className="text-sm text-brand-accent mb-3">
                  credits/month
                </div>
                <div className="text-sm text-base-paragraph">
                  = 11 books
                </div>
                <div className="text-lg font-semibold text-base-heading mt-2">
                  $29/month
                </div>
              </div>

              <div className="border rounded-lg p-6 text-center opacity-75 bg-white">
                <h4 className="font-semibold text-base-heading mb-2">Studio</h4>
                <div className="text-3xl font-bold text-brand-accent mb-2">
                  160
                </div>
                <div className="text-sm text-brand-accent mb-3">
                  credits/month
                </div>
                <div className="text-sm text-base-paragraph">
                  = 32 books
                </div>
                <div className="text-lg font-semibold text-base-heading mt-2">
                  $79/month
                </div>
                <div className="text-xs text-blue-600 mt-2">Coming Soon</div>
              </div>
            </div>

            <div className="bg-state-success-light border border-state-success rounded-lg p-6">
              <h4 className="font-semibold text-state-success mb-3">
                💡 Value comparison
              </h4>
              <div className="text-state-success text-sm space-y-2">
                <p>
                  • <strong>Starter:</strong> $3.00 per book ($9 ÷ 15 credits)
                </p>
                <p>
                  • <strong>Pro Author:</strong> $2.64 per book ($29 ÷ 55
                  credits) - 12% savings!
                </p>
                <p>
                  • <strong>Studio:</strong> $2.47 per book ($79 ÷ 160 credits) -
                  17% savings!
                </p>
              </div>
            </div>
          </section>

          {/* Tracking usage */}
          <section id="tracking-usage" className="mb-12">
            <h2 className="text-3xl font-bold text-base-heading mb-6 flex items-center">
              <TrendingUp className="w-8 h-8 mr-4 text-brand-accent" />
              Tracking your usage
            </h2>

            <p className="text-gray-700 mb-6">
              You can monitor your credit usage and remaining balance from
              multiple places in your account.
            </p>

            <div className="space-y-6">
              <div className="border rounded-lg p-6 bg-white">
                <h4 className="font-semibold text-base-heading mb-3">
                  Where to check your credits:
                </h4>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-brand-accent/15 text-brand-accent rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      1
                    </div>
                    <div>
                      <h5 className="font-medium text-base-heading">
                        Dashboard
                      </h5>
                      <p className="text-gray-700 text-sm">
                        Your credit balance is displayed in the top navigation
                        bar
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-brand-accent/15 text-brand-accent rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      2
                    </div>
                    <div>
                      <h5 className="font-medium text-base-heading">
                        Subscription page
                      </h5>
                      <p className="text-gray-700 text-sm">
                        Detailed usage breakdown with monthly progress bar
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-brand-accent/15 text-brand-accent rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      3
                    </div>
                    <div>
                      <h5 className="font-medium text-base-heading">
                        Book creation modal
                      </h5>
                      <p className="text-gray-700 text-sm">
                        Shows current balance before you create a new book
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-base-heading mb-3">
                  Understanding your usage display:
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Monthly credits used:</span>
                    <span className="font-medium">5/15</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-brand-primary h-2 rounded-full"
                      style={{ width: "33.33%" }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-base-paragraph">
                    <span>Remaining: 10 credits</span>
                    <span>Resets: Jun 15, 2025</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Buying additional credits */}
          <section id="buying-credits" className="mb-12">
            <h2 className="text-3xl font-bold text-base-heading mb-6 flex items-center">
              <DollarSign className="w-8 h-8 mr-4 text-brand-accent" />
              Buying additional credits
            </h2>

            <p className="text-gray-700 mb-6">
              If you need more credits than your monthly allocation, you can
              purchase additional credit packages that never expire and stack
              with your monthly credits.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="border rounded-lg p-6 text-center bg-white">
                <h4 className="font-semibold text-base-heading mb-2">
                  Small Pack
                </h4>
                <div className="text-2xl font-bold text-brand-accent mb-2">
                  10 credits
                </div>
                <div className="text-lg font-semibold text-base-heading mb-3">
                  $4.99
                </div>
                <div className="text-sm text-base-paragraph mb-4">
                  $0.50 per credit
                </div>
                <div className="text-sm text-base-paragraph">
                  = 2 additional books
                </div>
              </div>

              <div className="border-2 border-brand-accent rounded-lg p-6 text-center relative bg-white">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-brand-accent text-white px-3 py-1 rounded-full text-xs font-medium">
                  Best Value
                </div>
                <h4 className="font-semibold text-base-heading mb-2">
                  Medium Pack
                </h4>
                <div className="text-2xl font-bold text-brand-accent mb-2">
                  25 credits
                </div>
                <div className="text-lg font-semibold text-base-heading mb-3">
                  $11.99
                </div>
                <div className="text-sm text-base-paragraph mb-4">
                  $0.48 per credit
                </div>
                <div className="text-sm text-base-paragraph">
                  = 5 additional books
                </div>
                <div className="text-xs text-state-success mt-2">Save 10%</div>
              </div>

              <div className="border rounded-lg p-6 text-center bg-white">
                <h4 className="font-semibold text-base-heading mb-2">
                  Large Pack
                </h4>
                <div className="text-2xl font-bold text-brand-accent mb-2">
                  50 credits
                </div>
                <div className="text-lg font-semibold text-base-heading mb-3">
                  $21.99
                </div>
                <div className="text-sm text-base-paragraph mb-4">
                  $0.44 per credit
                </div>
                <div className="text-sm text-base-paragraph">
                  = 10 additional books
                </div>
                <div className="text-xs text-state-success mt-2">Save 20%</div>
              </div>
            </div>

            <div className="bg-state-info-light border border-state-info rounded-lg p-6">
              <h4 className="font-semibold text-state-info mb-3">
                How purchased credits work:
              </h4>
              <ul className="text-state-info space-y-2 text-sm">
                <li>
                  • Purchased credits are used first, before monthly credits
                </li>
                <li>
                  • They never expire, even if you cancel your subscription
                </li>
                <li>• You can buy multiple packs and they stack together</li>
                <li>• Available for purchase from your subscription page</li>
              </ul>
            </div>
          </section>

          {/* Tips for maximizing credits */}
          <section id="tips" className="mb-12">
            <h2 className="text-3xl font-bold text-base-heading mb-6 flex items-center">
              <Zap className="w-8 h-8 mr-4 text-brand-accent" />
              Tips for maximizing your credits
            </h2>

            <p className="text-gray-700 mb-6">
              Get the most value from your credits with these proven strategies
              and best practices.
            </p>

            <div className="space-y-6">
              <div className="border rounded-lg p-6 bg-white">
                <h4 className="font-semibold text-base-heading mb-4">
                  Smart usage strategies:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-base-heading mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 text-state-success mr-2" />
                      Plan your books
                    </h5>
                    <ul className="text-gray-700 space-y-1 text-sm ml-7">
                      <li>• Prepare detailed outlines before generation</li>
                      <li>• Use the advanced settings for better results</li>
                      <li>• Consider shorter works to test ideas first</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-base-heading mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 text-state-success mr-2" />
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

              <div className="bg-state-warning-light border border-state-warning rounded-lg p-6">
                <h4 className="font-semibold text-state-warning mb-3">
                  ⚡ Pro tips:
                </h4>
                <ul className="text-state-warning space-y-2 text-sm">
                  <li>
                    • <strong>Experiment with settings:</strong> Try different
                    narrator perspectives or tones to find your preferred style
                  </li>
                  <li>
                    • <strong>Edit freely:</strong> The generated content is
                    your starting point - personalize it to make it uniquely
                    yours
                  </li>
                  <li>
                    • <strong>Consider series:</strong> If you're writing a
                    series, maintain consistency by referencing previous books
                    in your prompts
                  </li>
                  <li>
                    • <strong>Upgrade strategically:</strong> If you
                    consistently use all your credits, upgrading to the next
                    plan offers better value
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Related Articles */}
          <section className="border-t pt-8">
            <h3 className="text-2xl font-bold text-base-heading mb-6">
              Related Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link
                to="/help/create-first-book"
                className="block bg-white shadow-md rounded-lg p-6 hover:bg-gray-100 transition-colors"
              >
                <h4 className="font-semibold text-base-heading mb-2">
                  How to create your first book with AI
                </h4>
                <p className="text-base-paragraph text-sm mb-3">
                  Step-by-step guide to generating your first book using
                  ProsePilot.
                </p>
                <div className="flex items-center text-brand-accent text-sm">
                  <span>Read article</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Link>

              <Link
                to="/pricing"
                className="block bg-white shadow-md rounded-lg p-6 hover:bg-gray-100 transition-colors"
              >
                <h4 className="font-semibold text-base-heading mb-2">
                  Compare subscription plans
                </h4>
                <p className="text-base-paragraph text-sm mb-3">
                  Find the right plan for your writing goals and budget.
                </p>
                <div className="flex items-center text-brand-accent text-sm">
                  <span>View pricing</span>
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
          <h3 className="text-2xl font-bold text-white mb-4">
            Need more credits?
          </h3>
          <p className="text-white/90 mb-6">
            Upgrade your plan or purchase additional credit packages.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pricing">
              <Button className="bg-white text-base-heading hover:bg-gray-100 px-8 py-3">
                View Plans
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/workspace/subscription">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-3"
              >
                Buy Credits
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
