import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { 
  Check, 
  FileText, 
  Crown, 
  Users, 
  Zap,
  ArrowRight,
  CreditCard,
  HelpCircle,
  CheckCircle
} from 'lucide-react';
import Footer from '../components/Footer';

interface Plan {
  id: string;
  name: string;
  price: number;
  icon: JSX.Element;
  color: string;
  description: string;
  features: string[];
  credits: number;
  isPopular?: boolean;
  comingSoon?: boolean;
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 9,
    credits: 5, // 1 book
    icon: <FileText className="w-6 h-6" />,
    color: 'bg-state-success',
    description: 'Perfect for hobbyists and first-time authors',
    features: [
      '5 credits/month (1 book)',
      'Max 15,000 words/book',
      'Basic genre selection',
      'AI-generated outline + simple chapter flow',
      'Plot and character consistency checker',
      'Export to watermarked PDF and ePub',
      'Community support'
    ]
  },
  {
    id: 'pro',
    name: 'Pro Author',
    price: 29,
    credits: 25, // 5 books
    icon: <Crown className="w-6 h-6" />,
    color: 'bg-blue-500',
    description: 'For aspiring writers ready to go deeper',
    features: [
      '25 credits/month (5 books)',
      'Max 60,000 words/book',
      'Unlock more genres',
      'Advanced book properties (narrator, tone, style)',
      'Cover generation (non-watermarked)',
      'Export to clean PDF, ePub, and Kindle formats',
      'AI-generated blurbs & summaries',
      'Priority email support'
    ],
    isPopular: true
  },
  {
    id: 'studio',
    name: 'Studio',
    price: 79,
    credits: 75, // 15 books
    icon: <Users className="w-6 h-6" />,
    color: 'bg-orange-500',
    description: 'For professionals and small studios',
    features: [
      '75 credits/month (15 books)',
      'Max 100,000 words/book',
      'All Pro features',
      'AI-generated illustrations (50 credits/month)',
      'Cover designer with AI title/tagline generator',
      'Metadata & ISBN generation',
      'Publish-ready formatting',
      'Team access (up to 3 users)',
      'Priority live chat support'
    ],
    comingSoon: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    credits: -1, // Unlimited
    icon: <Zap className="w-6 h-6" />,
    color: 'bg-red-500',
    description: 'For publishers, agencies, and heavy users',
    features: [
      'Unlimited credits',
      'Unlimited users per team',
      'All Studio features',
      'API access',
      'Bulk book/series generation',
      'Custom AI model tuning',
      'Dedicated onboarding & success manager',
      'SLA-based priority support'
    ],
    comingSoon: true
  }
];

const faqs = [
  {
    question: "What are credits and how do they work?",
    answer: "Credits are used to generate books. Each book costs 5 credits to create. Credits reset monthly with your subscription and unused credits don't roll over."
  },
  {
    question: "Can I upgrade or downgrade my plan anytime?",
    answer: "Yes! You can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at your next billing cycle."
  },
  {
    question: "Do you offer annual billing discounts?",
    answer: "Yes! Annual subscribers save 20% compared to monthly billing. You can switch to annual billing from your subscription settings."
  },
  {
    question: "What happens to my books if I cancel?",
    answer: "Your books remain accessible in read-only mode. You can still export them, but editing requires an active subscription."
  },
  {
    question: "Can I buy additional credits?",
    answer: "Yes! You can purchase credit packs anytime from your subscription page. These credits never expire and stack with your monthly allowance."
  }
];

export function Pricing() {
  return (
    <>
      {/* Header */}
      <div className="bg-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-base-heading sm:text-5xl">
              Choose Your Writing Plan
            </h1>
            <p className="mt-4 text-xl text-base-paragraph max-w-3xl mx-auto">
              From first-time authors to publishing houses, we have a plan that fits your writing goals and budget.
            </p>
            
            {/* Trust Indicators */}
            <div className="mt-8 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-blue-500" />
                Cancel anytime
              </div>
              <div className="flex items-center">
                <CreditCard className="w-4 h-4 mr-2 text-purple-500" />
                Start from just $9/month
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105 ${
                  plan.isPopular ? 'ring-2 ring-brand-primary scale-105' : ''
                } ${plan.comingSoon ? 'opacity-75' : ''}`}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 bg-brand-primary text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                    Most Popular
                  </div>
                )}
                {plan.comingSoon && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                    Coming Soon
                  </div>
                )}
                
                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`${plan.color} w-16 h-16 rounded-full flex items-center justify-center text-white mx-auto mb-4`}>
                      {plan.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-base-heading">{plan.name}</h3>
                    <p className="text-base-paragraph mt-2">{plan.description}</p>
                  </div>

                  {/* Pricing */}
                  <div className="text-center mb-8">
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-extrabold text-base-heading">${plan.price}</span>
                      <span className="text-xl text-gray-500 ml-1">/month</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      {plan.credits === -1 ? 'Unlimited credits' : `${plan.credits} credits included`}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-state-success shrink-0 mt-0.5" />
                        <span className="ml-3 text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link to="/app/signup">
                    <Button
                      className={`w-full ${
                        plan.isPopular 
                          ? 'bg-brand-primary hover:bg-brand-primary/90' 
                          : 'bg-base-heading hover:bg-gray-800'
                      }`}
                      disabled={plan.comingSoon}
                    >
                      {plan.comingSoon ? 'Coming Soon' : 'Get Started'}
                      {!plan.comingSoon && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-center">
            <p className="text-base-paragraph mb-4">
              All plans include our core AI writing features and export capabilities
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
              <span>✓ AI story generation</span>
              <span>✓ Character development</span>
              <span>✓ Plot consistency checking</span>
              <span>✓ Multiple export formats</span>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Packages */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-base-heading">Need More Credits?</h2>
            <p className="mt-4 text-xl text-base-paragraph">
              Purchase additional credits that never expire
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { credits: 10, price: 20, popular: false },
              { credits: 25, price: 45, savings: 10, popular: true },
              { credits: 50, price: 80, savings: 20, popular: false }
            ].map((pack, index) => (
              <div
                key={index}
                className={`bg-gray-50 rounded-lg p-6 text-center ${
                  pack.popular ? 'ring-2 ring-brand-primary' : ''
                }`}
              >
                {pack.popular && (
                  <div className="bg-brand-primary text-white text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
                    Best Value
                  </div>
                )}
                <div className="text-3xl font-bold text-base-heading mb-2">
                  {pack.credits} Credits
                </div>
                <div className="text-2xl font-bold text-base-heading mb-4">
                  ${pack.price}
                </div>
                {pack.savings && (
                  <div className="text-sm text-state-success font-medium mb-4">
                    Save {pack.savings}%
                  </div>
                )}
                <div className="text-sm text-gray-500 mb-6">
                  Create {Math.floor(pack.credits / 5)} books
                </div>
                <Link to="/app/signup">
                  <Button variant="outline" className="w-full">
                    Purchase Credits
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-base-heading">Frequently Asked Questions</h2>
            <p className="mt-4 text-xl text-base-paragraph">
              Everything you need to know about our pricing
            </p>
          </div>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-base-heading mb-3 flex items-center">
                  <HelpCircle className="w-5 h-5 text-base-heading mr-3" />
                  {faq.question}
                </h3>
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-base-paragraph mb-4">Still have questions?</p>
            <Link to="/support">
              <Button>
                Contact Support
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}