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
import { SEOHead, structuredData } from '../components/SEOHead';
import useAnalytics from '../hooks/useAnalytics';

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
      'Basic genre selection',
      'AI-generated outline + simple chapter flow',
      'Plot and character consistency checker',
      'Export to ePub',
      'Community support'
    ]
  },
  {
    id: 'pro',
    name: 'Pro Author',
    price: 29,
    credits: 25, // 5 books
    icon: <Crown className="w-6 h-6" />,
    color: 'bg-state-info',
    description: 'For aspiring writers ready to go deeper',
    features: [
      '25 credits/month (5 books)',
      'All Starter features',
      'Unlock more genres',
      'Advanced book properties: narrator, tone, style',
      'Export to PDF, ePub, and Docx formats',
      'Annotations system',
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
    color: 'bg-state-warning',
    description: 'For professionals and small studios',
    features: [
      '75 credits/month (15 books)',
      'All Pro features',
      'Advanced Metadata management',
      'Team access (up to 3 users)',
      'More features coming soon'
    ],
    comingSoon: true
  }
];

// FAQ data for structured data
const pricingFaqs = [
  {
    question: "How does the credit system work?",
    answer: "Credits are used to generate AI content. Each book typically requires 5 credits. Credits refresh monthly with your subscription."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
  },
  {
    question: "What formats can I export my books in?",
    answer: "Starter plan supports ePub export. Pro and Studio plans support PDF, ePub, and DOCX formats."
  },
  {
    question: "Is there a free trial available?",
    answer: "We offer a limited free trial to test our platform. Sign up to get started with basic features."
  },
  {
    question: "Do you offer refunds?",
    answer: "We don't offer refunds, but you can cancel anytime. Your subscription will remain active until the end of your billing period."
  }
];

export function Pricing() {
  const { trackPageView } = useAnalytics({
    measurementId: import.meta.env.VITE_ANALYTICS_ID,
  });

  useEffect(() => {
    trackPageView(window.location.pathname, 'Pricing');
  }, [trackPageView]);
  
  // Structured data for pricing
  const pricingStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "ProsePilot AI Writing Platform",
    "description": "AI-powered book writing platform with multiple subscription tiers",
    "offers": plans.map(plan => ({
      "@type": "Offer",
      "name": `${plan.name} Plan`,
      "price": plan.price.toString(),
      "priceCurrency": "USD",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": plan.price.toString(),
        "priceCurrency": "USD",
        "billingIncrement": "P1M"
      },
      "description": plan.description,
      "availability": plan.comingSoon ? "PreOrder" : "InStock"
    })),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250"
    }
  };
  
  return (
    <>
      <SEOHead
        title="Pricing Plans - AI Book Writing Platform"
        description="Choose your ProsePilot plan: Starter ($9/month), Pro Author ($29/month), or Studio ($79/month). All plans include AI book generation, professional editing, and multiple export formats."
        keywords="ProsePilot pricing, AI writing cost, book writing subscription, writing software pricing, AI author pricing"
        structuredData={pricingStructuredData}
      />
      
      {/* FAQ Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData.faqPage(pricingFaqs))}
      </script>
      
      {/* Header */}
      <section className="bg-white pt-16" aria-labelledby="pricing-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 id="pricing-heading" className="text-4xl font-bold text-base-heading sm:text-5xl font-heading">
              Choose Your Writing Plan
            </h1>
            <p className="mt-4 text-xl text-base-paragraph max-w-3xl mx-auto">
              From first-time authors to publishing houses, we have a plan that fits your writing goals and budget.
            </p>
            
            {/* Trust Indicators */}
            <div className="mt-8 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center text-base-paragraph">
                <CheckCircle className="w-4 h-4 mr-2 text-brand-accent" aria-hidden="true" />
                Cancel anytime
              </div>
              <div className="flex items-center text-base-paragraph">
                <CreditCard className="w-4 h-4 mr-2 text-brand-accent" aria-hidden="true" />
                Start from just $9/month
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 bg-base-background" aria-labelledby="plans-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="plans-heading" className="sr-only font-heading">Pricing Plans</h2>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg p-8 ${
                  plan.isPopular ? 'ring-2 ring-brand-accent' : ''
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-brand-accent text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                {plan.comingSoon && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-state-warning text-white px-4 py-1 rounded-full text-sm font-medium">
                      Coming Soon
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${plan.color} text-white mb-4`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-base-heading mb-2 font-heading">{plan.name}</h3>
                  <p className="text-base-paragraph mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-base-heading">${plan.price}</span>
                    <span className="text-base-paragraph">/month</span>
                  </div>
                  
                  <div className="mb-8">
                    <span className="text-sm text-base-paragraph">
                      {plan.credits} credits/month ({Math.floor(plan.credits / 5)} books)
                    </span>
                  </div>

                  <ul className="space-y-4 mb-8 text-left">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-state-success mr-3 mt-0.5 flex-shrink-0" aria-hidden="true" />
                        <span className="text-base-paragraph">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to={plan.comingSoon ? "#" : "/signup"}>
                    <Button
                      className={`w-full ${
                        plan.isPopular
                          ? 'bg-brand-accent hover:bg-brand-accent/90'
                          : ''
                      }`}
                      disabled={plan.comingSoon}
                    >
                      {plan.comingSoon ? 'Coming Soon' : 'Get Started'}
                      {!plan.comingSoon && <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />}
                    </Button>
                  </Link>
                </div>
              </article>
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
      </section>

      {/* Credit Packages */}
      <section className="bg-white py-16" aria-labelledby="credit-packages-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="credit-packages-heading" className="text-3xl font-extrabold text-base-heading font-heading">Need More Credits?</h2>
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
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white" aria-labelledby="faq-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="faq-heading" className="text-3xl font-bold text-base-heading font-heading">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-base-paragraph">
              Everything you need to know about ProsePilot pricing and plans
            </p>
          </div>
          
          <div className="space-y-8">
            {pricingFaqs.map((faq, index) => (
              <article key={index} className="bg-base-background rounded-lg p-6">
                <h3 className="text-lg font-semibold text-base-heading mb-3 font-heading">
                  {faq.question}
                </h3>
                <p className="text-base-paragraph">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-accent/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-base-heading mb-4 font-heading">
            Ready to Start Writing?
          </h2>
          <p className="text-lg text-base-paragraph mb-8">
            Join thousands of writers who've transformed their ideas into published books with ProsePilot.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button className="px-8 py-3 text-lg">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
            <Link to="/support">
              <Button variant="outline" className="px-8 py-3 text-lg">
                <HelpCircle className="mr-2 h-5 w-5" aria-hidden="true" />
                Need Help?
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}