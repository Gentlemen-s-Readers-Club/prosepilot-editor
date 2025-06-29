import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { 
  Check, 
  FileText,
  Crown,
  Users,
  ArrowRight,
  CreditCard,
  HelpCircle,
  CheckCircle
} from 'lucide-react';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet-async';
import useAnalytics from '../hooks/useAnalytics';
import { plans } from '../lib/consts';

const faqs = [
  {
    question: "What are credits and how do they work?",
    answer: "Credits are used to generate books. Each book costs 5 credits to create. Credits are included with your subscription and unused credits carry over with no maximum limit."
  },
  // {
  //   question: "Can I upgrade or downgrade my plan anytime?",
  //   answer: "Yes! You can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at your next billing cycle."
  // },
  {
    question: "Can I buy additional credits?",
    answer: "Yes! You can purchase credit packs anytime from your subscription page. These credits never expire and stack with your monthly allowance."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes! You can cancel your subscription anytime. You'll be able to use your credits until the end of your current billing period."
  },
  {
    question: "What happens to my books if I cancel?",
    answer: "Your books remain accessible in read-only mode. You can still export them, but editing requires an active subscription."
  },
  {
    question: "Can I get a refund?",
    answer: "We do not offer refunds for our subscription services. However, you can cancel your subscription anytime."
  }
];

// Function to render icons based on string names
const renderIcon = (iconName: string) => {
  switch (iconName) {
    case 'FileText':
      return <FileText className="w-6 h-6" />;
    case 'Crown':
      return <Crown className="w-6 h-6" />;
    case 'Users':
      return <Users className="w-6 h-6" />;
    default:
      return <FileText className="w-6 h-6" />;
  }
};

export function Pricing() {
  const { trackPageView } = useAnalytics({
    measurementId: import.meta.env.VITE_ANALYTICS_ID,
  });

  useEffect(() => {
    trackPageView(window.location.pathname, 'Pricing');
  }, [trackPageView]);
  
  return (
    <>
      <Helmet>
        <title>ProsePilot - Pricing</title>
      </Helmet>
      {/* Header */}
      <div className="bg-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-base-heading sm:text-5xl font-heading">
              Choose Your Writing Plan
            </h1>
            <p className="mt-4 text-xl text-base-paragraph max-w-3xl mx-auto">
              From first-time authors to publishing houses, we have a plan that fits your writing goals and budget.
            </p>
            
            {/* Trust Indicators */}
            <div className="mt-8 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center text-base-paragraph">
                <CheckCircle className="w-4 h-4 mr-2 text-brand-accent" />
                Cancel anytime
              </div>
              <div className="flex items-center text-base-paragraph">
                <CreditCard className="w-4 h-4 mr-2 text-brand-accent" />
                Start from just $9/month
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105 ${
                  plan.isPopular ? 'ring-2 ring-brand-accent scale-105' : ''
                } ${plan.comingSoon ? 'opacity-75' : ''}`}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 bg-brand-accent text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                    Most Popular
                  </div>
                )}
                {plan.comingSoon && (
                  <div className="absolute top-0 right-0 bg-state-info text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                    Coming Soon
                  </div>
                )}
                
                <div className="p-8 flex flex-col h-full">
                  <div className="flex-1">
                    {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`${plan.color} w-16 h-16 rounded-full flex items-center justify-center text-white mx-auto mb-4`}>
                      {renderIcon(plan.icon)}
                    </div>
                    <h3 className="text-2xl font-bold text-base-heading font-heading">{plan.name}</h3>
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
                  </div>

                  {/* CTA Button */}
                  <Link to="/signup">
                    <Button
                      className={`w-full ${plan.isPopular && 'bg-brand-accent border-brand-accent text-white hover:bg-brand-accent/90 hover:border-brand-accent/90 hover:text-white'}`}
                      disabled={plan.comingSoon}
                      variant={plan.isPopular ? 'default' : 'outline'}
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
              <p className="text-base-paragraph"><span className="text-brand-accent">✓</span> AI story generation</p>
              <p className="text-base-paragraph"><span className="text-brand-accent">✓</span> Character development</p>
              <p className="text-base-paragraph"><span className="text-brand-accent">✓</span> Plot consistency checking</p>
              {/* <p className="text-base-paragraph"><span className="text-brand-accent">✓</span> Multiple export formats</p> */}
            </div>
          </div>
        </div>
      </div>

      {/* Credit Packages */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-base-heading font-heading">Need More Credits?</h2>
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
                className={`bg-base-background rounded-lg p-6 text-center flex flex-col justify-center items-center ${
                  pack.popular ? 'ring-2 ring-brand-accent' : ''
                }`}
              >
                {pack.popular && (
                  <div className="bg-brand-accent text-white text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
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
                <div className="text-sm text-base-paragraph mb-6">
                  Create {Math.floor(pack.credits / 5)} books
                </div>
                <Link to="/signup">
                  <Button className={`w-full ${pack.popular ? 'bg-brand-accent border-brand-accent hover:bg-brand-accent/90 hover:border-brand-accent/90 hover:text-white' : ''}`}>
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
            <h2 className="text-3xl font-extrabold text-base-heading font-heading">Frequently Asked Questions</h2>
            <p className="mt-4 text-xl text-base-paragraph">
              Everything you need to know about our pricing
            </p>
          </div>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-base-heading mb-3 flex items-center font-heading">
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