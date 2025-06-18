import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  Lock,
  FileText,
  AlertTriangle,
  Users,
  CreditCard,
  Scale,
  Clock,
  Gavel,
  BookOpen,
  Zap,
} from "lucide-react";
import Footer from "../components/Footer";
import useAnalytics from "../hooks/useAnalytics";

export function TermsOfService() {
  const { trackPageView } = useAnalytics({
    measurementId: import.meta.env.VITE_ANALYTICS_ID,
  });

  useEffect(() => {
    trackPageView(window.location.pathname, "Terms of Service");
  }, [trackPageView]);

  return (
    <div className="min-h-screen bg-base-background">
      {/* Header */}
      <div className="bg-white pt-16 border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center mb-6">
            <Link
              to="/"
              className="flex items-center text-base-heading hover:text-base-heading/80 mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <div className="flex items-start">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-base-heading mb-4">
                Terms of Service
              </h1>
              <p className="text-xl text-base-paragraph leading-relaxed">
                Last Updated: June 18, 2025
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-base-paragraph">
        <div>
          {/* Introduction */}
          <div className="bg-state-info-light border border-state-info rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <Shield className="w-6 h-6 text-state-info mt-1 mr-3 shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-state-info mb-2">
                  Agreement to Terms
                </h3>
                <p className="text-state-info text-sm">
                  These Terms of Service ("Terms") constitute a legally binding
                  agreement between you and ProsePilot ("Company", "we", "us",
                  or "our") regarding your use of our AI-powered writing
                  platform and services. By accessing or using ProsePilot, you
                  agree to be bound by these Terms and our Privacy Policy.
                </p>
              </div>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-base-heading mb-4">
              Table of Contents
            </h3>
            <nav className="space-y-1">
              <a
                href="#service-description"
                className="block text-base-paragraph hover:underline py-1"
              >
                1. Service Description
              </a>
              <a
                href="#account-registration"
                className="block text-base-paragraph hover:underline py-1"
              >
                2. Account Registration
              </a>
              <a
                href="#subscription-pricing"
                className="block text-base-paragraph hover:underline py-1"
              >
                3. Subscription and Pricing
              </a>
              <a
                href="#acceptable-use"
                className="block text-base-paragraph hover:underline py-1"
              >
                4. Acceptable Use Policy
              </a>
              <a
                href="#intellectual-property"
                className="block text-base-paragraph hover:underline py-1"
              >
                5. Intellectual Property Rights
              </a>
              <a
                href="#ai-content"
                className="block text-base-paragraph hover:underline py-1"
              >
                6. AI-Generated Content
              </a>
              <a
                href="#team-collaboration"
                className="block text-base-paragraph hover:underline py-1"
              >
                7. Team Collaboration
              </a>
              <a
                href="#payment-terms"
                className="block text-base-paragraph hover:underline py-1"
              >
                8. Payment Terms
              </a>
              <a
                href="#cancellation-refunds"
                className="block text-base-paragraph hover:underline py-1"
              >
                9. Cancellation and No Refund Policy
              </a>
              <a
                href="#privacy-data"
                className="block text-base-paragraph hover:underline py-1"
              >
                10. Privacy and Data Protection
              </a>
              <a
                href="#limitation-liability"
                className="block text-base-paragraph hover:underline py-1"
              >
                11. Limitation of Liability
              </a>
              <a
                href="#termination"
                className="block text-base-paragraph hover:underline py-1"
              >
                12. Termination
              </a>
              <a
                href="#legal-compliance"
                className="block text-base-paragraph hover:underline py-1"
              >
                13. Legal Compliance
              </a>
              <a
                href="#changes-terms"
                className="block text-base-paragraph hover:underline py-1"
              >
                14. Changes to Terms
              </a>
              <a
                href="#contact-information"
                className="block text-base-paragraph hover:underline py-1"
              >
                15. Contact Information
              </a>
            </nav>
          </div>

          {/* 1. Service Description */}
          <section id="service-description" className="mb-12">
            <h2 className="text-3xl font-bold text-base-heading mb-6 flex items-center">
              <BookOpen className="w-8 h-8 mr-4 text-brand-accent" />
              1. Service Description
            </h2>

            <div className="space-y-6">
              <div className="bg-brand-accent/5 border border-brand-accent/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-base-heading mb-3">
                  What is ProsePilot?
                </h3>
                <p className="text-base-paragraph mb-4">
                  ProsePilot is an AI-powered writing platform designed to help
                  authors, content creators, and writing professionals generate,
                  edit, and publish high-quality written content. Our platform
                  combines advanced artificial intelligence with intuitive
                  writing tools to streamline the book creation process.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <h4 className="font-semibold text-base-heading mb-3 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-brand-accent" />
                    AI Writing Features
                  </h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>AI-powered book structure generation</li>
                    <li>Chapter content generation and editing</li>
                    <li>Character development assistance</li>
                    <li>Plot outline creation</li>
                    <li>Writing style and tone optimization</li>
                    <li>Content enhancement and refinement</li>
                  </ul>
                </div>

                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <h4 className="font-semibold text-base-heading mb-3 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-brand-accent" />
                    Collaboration Tools
                  </h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Team workspaces and project sharing</li>
                    <li>Real-time collaborative editing</li>
                    <li>Comment and annotation system</li>
                    <li>Version control and history tracking</li>
                    <li>Team member management</li>
                    <li>Permission-based access control</li>
                  </ul>
                </div>

                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <h4 className="font-semibold text-base-heading mb-3 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-brand-accent" />
                    Export & Publishing
                  </h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Multiple export formats (PDF, EPUB, DOCX)</li>
                    <li>Professional manuscript formatting</li>
                    <li>Cover design generation</li>
                    <li>Publishing-ready file preparation</li>
                    <li>Custom branding options</li>
                  </ul>
                </div>

                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <h4 className="font-semibold text-base-heading mb-3 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-brand-accent" />
                    Credit System
                  </h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Token-based AI usage system</li>
                    <li>Monthly credit allocations</li>
                    <li>Additional credit purchases available</li>
                    <li>Usage tracking and management</li>
                    <li>Transparent pricing model</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Account Registration */}
          <section id="account-registration" className="mb-12">
            <h2 className="text-3xl font-bold text-base-heading mb-6 flex items-center">
              <Users className="w-8 h-8 mr-4 text-brand-accent" />
              2. Account Registration
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-base-heading mb-3">
                  Account Requirements
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    You must be at least 16 years old to create an account
                  </li>
                  <li>
                    You must provide accurate, current, and complete information
                    during registration
                  </li>
                  <li>
                    You are responsible for maintaining the security of your
                    account credentials
                  </li>
                  <li>
                    You may not share your account with others or allow
                    unauthorized access
                  </li>
                  <li>
                    You must notify us immediately of any unauthorized use of
                    your account
                  </li>
                </ul>
              </div>

              <div className="bg-state-warning-light border border-state-warning rounded-lg p-6">
                <h3 className="text-lg font-semibold text-state-warning mb-3">
                  Account Security
                </h3>
                <p className="text-state-warning text-sm">
                  You are solely responsible for all activities that occur under
                  your account. We recommend using strong, unique passwords to
                  protect your account. ProsePilot will not be liable for any
                  loss or damage arising from unauthorized use of your account.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Subscription and Pricing */}
          <section id="subscription-pricing" className="mb-12">
            <h2 className="text-3xl font-bold text-base-heading mb-6 flex items-center">
              <CreditCard className="w-8 h-8 mr-4 text-brand-accent" />
              3. Subscription and Pricing
            </h2>

            <div className="space-y-6">
              <div className="bg-brand-accent/5 border border-brand-accent/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-base-heading mb-3">
                  Subscription Plans
                </h3>
                <p className="text-base-paragraph mb-4">
                  ProsePilot offers multiple subscription tiers to meet
                  different user needs. All pricing information is clearly
                  displayed on our pricing page and during the checkout process.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <h4 className="font-semibold text-base-heading mb-3">
                    Starter Plan
                  </h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Basic AI writing features</li>
                    <li>Limited monthly credits</li>
                    <li>Standard export formats</li>
                    <li>Email support</li>
                  </ul>
                </div>

                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <h4 className="font-semibold text-base-heading mb-3">
                    Professional Plan
                  </h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Advanced AI features</li>
                    <li>Increased monthly credits</li>
                    <li>Team collaboration tools</li>
                    <li>Priority support</li>
                  </ul>
                </div>

                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <h4 className="font-semibold text-base-heading mb-3">
                    Studio Plan
                  </h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Full feature access</li>
                    <li>Unlimited credits</li>
                    <li>Advanced team features</li>
                    <li>Dedicated support</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-base-heading mb-3">
                  Pricing Terms
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Subscription fees are billed monthly or annually in advance
                  </li>
                  <li>
                    All prices are displayed in USD unless otherwise specified
                  </li>
                  <li>
                    Prices may be subject to applicable taxes based on your
                    location
                  </li>
                  <li>
                    We reserve the right to change pricing with 30 days' notice
                  </li>
                  <li>
                    <strong>
                      All payments including subscription fees and credit
                      purchases are final and non-refundable
                    </strong>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 4. Acceptable Use Policy */}
          <section id="acceptable-use" className="mb-12">
            <h2 className="text-3xl font-bold text-base-heading mb-6 flex items-center">
              <Shield className="w-8 h-8 mr-4 text-brand-accent" />
              4. Acceptable Use Policy
            </h2>

            <div className="space-y-6">
              <div className="bg-state-error-light border border-state-error rounded-lg p-6">
                <h3 className="text-lg font-semibold text-state-error mb-3">
                  Prohibited Uses
                </h3>
                <p className="text-state-error text-sm mb-3">
                  You may not use ProsePilot for any of the following
                  activities:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm text-state-error">
                  <li>
                    Creating content that violates applicable laws or
                    regulations
                  </li>
                  <li>
                    Generating harmful, harassing, defamatory, or discriminatory
                    content
                  </li>
                  <li>
                    Producing content that infringes on intellectual property
                    rights
                  </li>
                  <li>Creating misleading or fraudulent content</li>
                  <li>
                    Attempting to reverse engineer or circumvent our AI systems
                  </li>
                  <li>Sharing or distributing your account credentials</li>
                  <li>Using automated systems to abuse our service</li>
                  <li>
                    Uploading malicious code or attempting to compromise our
                    platform
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-base-heading mb-3">
                  Content Standards
                </h3>
                <p className="text-base-paragraph mb-4">
                  All content created through ProsePilot must comply with our
                  content standards:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Content must not promote violence, hatred, or discrimination
                  </li>
                  <li>
                    Content must respect intellectual property rights of others
                  </li>
                  <li>
                    Content must comply with applicable laws in your
                    jurisdiction
                  </li>
                  <li>
                    Content should not contain false or misleading information
                  </li>
                  <li>
                    Adult content is permitted but must comply with applicable
                    age restrictions
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 5. Intellectual Property Rights */}
          <section id="intellectual-property" className="mb-12">
            <h2 className="text-3xl font-bold text-base-heading mb-6 flex items-center">
              <Lock className="w-8 h-8 mr-4 text-brand-accent" />
              5. Intellectual Property Rights
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-base-heading mb-3">
                  Your Content
                </h3>
                <div className="bg-state-success-light border border-state-success rounded-lg p-6 mb-4">
                  <p className="text-state-success text-sm">
                    <strong>You retain full ownership</strong> of all content
                    you create, upload, or generate using ProsePilot. This
                    includes your original input, AI-generated content based on
                    your prompts, and any modifications you make.
                  </p>
                </div>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    You own all rights to content you create using our platform
                  </li>
                  <li>
                    You may use, modify, distribute, and monetize your content
                    freely
                  </li>
                  <li>
                    You grant us a limited license to process your content to
                    provide our services
                  </li>
                  <li>
                    You are responsible for ensuring your content doesn't
                    infringe on others' rights
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-base-heading mb-3">
                  Our Platform
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>ProsePilot and all related trademarks are owned by us</li>
                  <li>
                    Our AI models, software, and platform technology are
                    protected by intellectual property laws
                  </li>
                  <li>
                    You may not copy, modify, or distribute our proprietary
                    technology
                  </li>
                  <li>
                    Any feedback or suggestions you provide may be used by us
                    without compensation
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 6. AI-Generated Content */}
          <section id="ai-content" className="mb-12">
            <h2 className="text-3xl font-bold text-base-heading mb-6 flex items-center">
              <Zap className="w-8 h-8 mr-4 text-brand-accent" />
              6. AI-Generated Content
            </h2>

            <div className="space-y-6">
              <div className="bg-brand-accent/5 border border-brand-accent/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-base-heading mb-3">
                  AI Content Ownership and Usage
                </h3>
                <p className="text-base-paragraph">
                  Content generated by our AI systems based on your inputs and
                  prompts is considered your intellectual property. You have
                  full rights to use, modify, and distribute AI-generated
                  content as you see fit.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-base-heading mb-3">
                  AI Content Disclaimer
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    AI-generated content is based on machine learning models and
                    may not always be accurate
                  </li>
                  <li>
                    You are responsible for reviewing and verifying AI-generated
                    content before use
                  </li>
                  <li>
                    We do not guarantee the originality of AI-generated content
                  </li>
                  <li>
                    AI systems may occasionally produce similar content for
                    different users
                  </li>
                  <li>
                    You should fact-check and edit AI-generated content as
                    needed
                  </li>
                </ul>
              </div>

              <div className="bg-state-warning-light border border-state-warning rounded-lg p-6">
                <h3 className="text-lg font-semibold text-state-warning mb-3">
                  AI Training and Improvement
                </h3>
                <p className="text-state-warning text-sm">
                  We may use aggregated and anonymized data from AI interactions
                  to improve our models. Personal information and your specific
                  content are not used for training without explicit consent.
                  See our Privacy Policy for detailed information about data
                  usage.
                </p>
              </div>
            </div>
          </section>

          {/* 7. Team Collaboration */}
          <section id="team-collaboration" className="mb-12">
            <h2 className="text-3xl font-bold text-base-heading mb-6 flex items-center">
              <Users className="w-8 h-8 mr-4 text-brand-accent" />
              7. Team Collaboration
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-base-heading mb-3">
                  Team Workspaces
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Team administrators are responsible for managing team member
                    access and permissions
                  </li>
                  <li>
                    All team members must comply with these Terms of Service
                  </li>
                  <li>
                    Teams are responsible for content created by their members
                  </li>
                  <li>
                    Team data and content are subject to the team
                    administrator's control
                  </li>
                  <li>
                    We may suspend team access if any member violates our terms
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-base-heading mb-3">
                  Shared Content
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Content shared within teams remains owned by the original
                    creator unless otherwise agreed
                  </li>
                  <li>
                    Team members may collaborate on shared projects according to
                    permissions set
                  </li>
                  <li>
                    Teams should establish clear agreements about content
                    ownership and usage rights
                  </li>
                  <li>
                    Removing team members may affect their access to shared
                    content
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 8. Payment Terms */}
          <section id="payment-terms" className="mb-12">
            <h2 className="text-3xl font-bold text-base-heading mb-6 flex items-center">
              <CreditCard className="w-8 h-8 mr-4 text-brand-accent" />
              8. Payment Terms
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-base-heading mb-3">
                  Subscription Billing
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Subscription fees are charged automatically at the beginning
                    of each billing cycle
                  </li>
                  <li>Payment must be made through approved payment methods</li>
                  <li>
                    Failed payments may result in service suspension after
                    reasonable notice
                  </li>
                  <li>
                    You authorize us to charge your selected payment method for
                    all fees
                  </li>
                  <li>
                    Billing disputes must be reported within 30 days of the
                    charge
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-base-heading mb-3">
                  Credit Purchases
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Additional credits can be purchased as needed</li>
                  <li>
                    Credits are applied to your account immediately upon payment
                    confirmation
                  </li>
                  <li>
                    Unused credits typically expire according to your
                    subscription plan
                  </li>
                  <li>
                    <strong>
                      Credit purchases are non-refundable under all
                      circumstances
                    </strong>
                  </li>
                </ul>
              </div>

              <div className="bg-state-info-light border border-state-info rounded-lg p-6">
                <h3 className="text-lg font-semibold text-state-info mb-3">
                  Payment Processing
                </h3>
                <p className="text-state-info text-sm">
                  All payments are processed securely through Paddle, our
                  payment processor. Your payment information is handled
                  according to industry standards and applicable payment card
                  industry regulations. We do not store your complete payment
                  information on our servers.
                </p>
              </div>
            </div>
          </section>

          {/* 9. Cancellation and No Refund Policy */}
          <section id="cancellation-refunds" className="mb-12">
            <h2 className="text-3xl font-bold text-base-heading mb-6 flex items-center">
              <Clock className="w-8 h-8 mr-4 text-brand-accent" />
              9. Cancellation and No Refund Policy
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-base-heading mb-3">
                  Cancellation Policy
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    You may cancel your subscription at any time through your
                    account settings
                  </li>
                  <li>
                    Cancellation takes effect at the end of your current billing
                    period
                  </li>
                  <li>
                    You retain access to paid features until the end of your
                    billing period
                  </li>
                  <li>
                    No partial refunds are provided for unused portions of
                    billing periods
                  </li>
                  <li>
                    Account data may be retained according to our data retention
                    policy
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-base-heading mb-3">
                  No Refund Policy
                </h3>
                <div className="bg-state-error-light border border-state-error rounded-lg p-6 mb-4">
                  <h4 className="font-semibold text-state-error mb-2">
                    All Sales Are Final
                  </h4>
                  <p className="text-state-error text-sm">
                    ProsePilot does not provide refunds for subscription fees,
                    credit purchases, or any other services. All payments are
                    final and non-refundable once processed. Please review our
                    service features and pricing carefully before making your
                    purchase.
                  </p>
                </div>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    All subscription fees are non-refundable regardless of usage
                  </li>
                  <li>Credit purchases are non-refundable once processed</li>
                  <li>Additional services and features are non-refundable</li>
                  <li>
                    Refunds will not be provided for violations of our Terms of
                    Service
                  </li>
                  <li>
                    Billing disputes may be reviewed on a case-by-case basis for
                    processing errors only
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 10. Privacy and Data Protection */}
          <section id="privacy-data" className="mb-12">
            <h2 className="text-3xl font-bold text-base-heading mb-6 flex items-center">
              <Lock className="w-8 h-8 mr-4 text-brand-accent" />
              10. Privacy and Data Protection
            </h2>

            <div className="space-y-6">
              <div className="bg-state-info-light border border-state-info rounded-lg p-6">
                <h3 className="text-lg font-semibold text-state-info mb-3">
                  Privacy Commitment
                </h3>
                <p className="text-state-info text-sm">
                  Your privacy is important to us. Our collection, use, and
                  protection of your personal information is governed by our{" "}
                  <Link
                    to="/privacy-policy"
                    className="text-brand-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  , which is incorporated into these Terms by reference.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-base-heading mb-3">
                  Data Security
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    We implement industry-standard security measures to protect
                    your data
                  </li>
                  <li>Data is encrypted in transit and at rest</li>
                  <li>
                    Access to personal data is restricted to authorized
                    personnel only
                  </li>
                  <li>We regularly review and update our security practices</li>
                  <li>
                    Data breaches are handled according to applicable legal
                    requirements
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-base-heading mb-3">
                  Your Data Rights
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    You have the right to access, correct, or delete your
                    personal information
                  </li>
                  <li>You can export your content and data at any time</li>
                  <li>You may request restrictions on data processing</li>
                  <li>
                    Data portability rights apply where technically feasible
                  </li>
                  <li>Contact us to exercise your data protection rights</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 11. Limitation of Liability */}
          <section id="limitation-liability" className="mb-12">
            <h2 className="text-3xl font-bold text-base-heading mb-6 flex items-center">
              <Scale className="w-8 h-8 mr-4 text-brand-accent" />
              11. Limitation of Liability
            </h2>

            <div className="space-y-6">
              <div className="bg-state-warning-light border border-state-warning rounded-lg p-6">
                <h3 className="text-lg font-semibold text-state-warning mb-3">
                  Service Disclaimer
                </h3>
                <p className="text-state-warning text-sm">
                  ProsePilot is provided "as is" without warranties of any kind.
                  We do not guarantee that our service will be uninterrupted,
                  error-free, or meet your specific requirements. Your use of
                  our service is at your own risk.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-base-heading mb-3">
                  Liability Limitations
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Our liability is limited to the amount you paid for the
                    service in the past 12 months
                  </li>
                  <li>
                    We are not liable for indirect, incidental, or consequential
                    damages
                  </li>
                  <li>
                    We are not responsible for content generated by AI or its
                    accuracy
                  </li>
                  <li>
                    Users are responsible for backing up their content and data
                  </li>
                  <li>
                    Force majeure events excuse performance delays or failures
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-base-heading mb-3">
                  Indemnification
                </h3>
                <p className="text-base-paragraph mb-3">
                  You agree to indemnify and hold ProsePilot harmless from any
                  claims, damages, or expenses arising from:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your use of the service in violation of these Terms</li>
                  <li>
                    Content you create, upload, or distribute through our
                    platform
                  </li>
                  <li>Your violation of any third-party rights</li>
                  <li>Your breach of applicable laws or regulations</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 12. Termination */}
          <section id="termination" className="mb-12">
            <h2 className="text-3xl font-bold text-base-heading mb-6 flex items-center">
              <AlertTriangle className="w-8 h-8 mr-4 text-brand-accent" />
              12. Termination
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-base-heading mb-3">
                  Termination by You
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    You may terminate your account at any time through account
                    settings
                  </li>
                  <li>
                    Termination does not relieve you of payment obligations for
                    services already provided
                  </li>
                  <li>
                    You should export your data before terminating your account
                  </li>
                  <li>Some provisions of these Terms survive termination</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-base-heading mb-3">
                  Termination by Us
                </h3>
                <div className="bg-state-error-light border border-state-error rounded-lg p-6 mb-4">
                  <h4 className="font-semibold text-state-error mb-2">
                    Grounds for Termination
                  </h4>
                  <p className="text-state-error text-sm">
                    We may suspend or terminate your account immediately if you
                    violate these Terms, engage in prohibited activities, or
                    fail to pay required fees. We will provide notice when
                    possible, but immediate termination may be necessary in
                    severe cases.
                  </p>
                </div>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violations of our Acceptable Use Policy</li>
                  <li>Non-payment of subscription fees</li>
                  <li>Fraudulent or abusive behavior</li>
                  <li>Legal requirements or court orders</li>
                  <li>Discontinuation of service (with reasonable notice)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-base-heading mb-3">
                  Effect of Termination
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access to the service will be immediately revoked</li>
                  <li>
                    Your data may be deleted according to our retention policy
                  </li>
                  <li>Outstanding payment obligations remain due</li>
                  <li>Intellectual property rights survive termination</li>
                  <li>
                    You may request data export within a reasonable timeframe
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 13. Legal Compliance */}
          <section id="legal-compliance" className="mb-12">
            <h2 className="text-3xl font-bold text-base-heading mb-6 flex items-center">
              <Gavel className="w-8 h-8 mr-4 text-brand-accent" />
              13. Legal Compliance
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-base-heading mb-3">
                  Governing Law
                </h3>
                <p className="text-base-paragraph mb-4">
                  These Terms are governed by the laws of the United States and
                  the State of California, without regard to conflict of law
                  principles. Any disputes will be resolved in the courts of
                  California.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-base-heading mb-3">
                  Compliance Requirements
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Users must comply with all applicable local, state, and
                    federal laws
                  </li>
                  <li>
                    International users must comply with their local regulations
                  </li>
                  <li>
                    Export control laws may apply to certain content or features
                  </li>
                  <li>
                    Professional users should consider industry-specific
                    regulations
                  </li>
                  <li>Age restrictions apply as specified in our terms</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-base-heading mb-3">
                  Dispute Resolution
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    We encourage resolution of disputes through direct
                    communication
                  </li>
                  <li>Formal disputes may be subject to binding arbitration</li>
                  <li>
                    Class action lawsuits are waived where legally permissible
                  </li>
                  <li>
                    Legal proceedings must be initiated within one year of the
                    claim arising
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 14. Changes to Terms */}
          <section id="changes-terms" className="mb-12">
            <h2 className="text-3xl font-bold text-base-heading mb-6 flex items-center">
              <FileText className="w-8 h-8 mr-4 text-brand-accent" />
              14. Changes to Terms
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-base-heading mb-3">
                  Modification Process
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We may update these Terms from time to time</li>
                  <li>
                    Material changes will be communicated via email or platform
                    notification
                  </li>
                  <li>
                    Changes take effect 30 days after notification unless
                    otherwise specified
                  </li>
                  <li>
                    Continued use of the service constitutes acceptance of
                    updated Terms
                  </li>
                  <li>
                    You may terminate your account if you disagree with changes
                  </li>
                </ul>
              </div>

              <div className="bg-state-info-light border border-state-info rounded-lg p-6">
                <h3 className="text-lg font-semibold text-state-info mb-3">
                  Notification Methods
                </h3>
                <p className="text-state-info text-sm">
                  We will notify you of significant changes through email (to
                  your registered address), in-app notifications, or prominent
                  notices on our website. It's your responsibility to keep your
                  contact information current.
                </p>
              </div>
            </div>
          </section>

          {/* 15. Contact Information */}
          <section id="contact-information" className="mb-12">
            <h2 className="text-3xl font-bold text-base-heading mb-6 flex items-center">
              <Users className="w-8 h-8 mr-4 text-brand-accent" />
              15. Contact Information
            </h2>

            <div className="space-y-6">
              <div className="bg-brand-accent/5 border border-brand-accent/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-base-heading mb-4">
                  Get in Touch
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-base-heading mb-1">
                      Legal Entity
                    </h4>
                    <p className="text-base-paragraph text-sm">
                      Paulo Guerra / David Bergmann
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-base-heading mb-1">
                      Support
                    </h4>
                    <p className="text-base-paragraph text-sm">
                      Email:{" "}
                      <a
                        href="mailto:support@prosepilot.com"
                        className="text-brand-primary hover:underline"
                      >
                        support@prosepilot.app
                      </a>
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-base-heading mb-1">
                      Business Address
                    </h4>
                    <p className="text-base-paragraph text-sm">
                      Calle El Cuarzo 36 y Obisidana.
                      <br />
                      Urbanización Las Peñas.
                      <br />
                      Tumbaco, Quito - Ecuador
                      <br />
                      EC 170902
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-base-heading mb-3">
                  Additional Resources
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <Link
                      to="/privacy-policy"
                      className="text-brand-primary hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/support"
                      className="text-brand-primary hover:underline"
                    >
                      Support Center
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/docs"
                      className="text-brand-primary hover:underline"
                    >
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/pricing"
                      className="text-brand-primary hover:underline"
                    >
                      Pricing Information
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Footer Notice */}
          <div className="bg-gray-50 rounded-lg p-6 mt-12">
            <h3 className="text-lg font-semibold text-base-heading mb-3">
              Legal Notice
            </h3>
            <p className="text-sm text-base-paragraph">
              These Terms of Service constitute the entire agreement between you
              and ProsePilot regarding your use of our service. If any provision
              is found to be unenforceable, the remaining provisions will remain
              in full force and effect. Our failure to enforce any right or
              provision does not constitute a waiver of such right or provision.
            </p>
            <p className="text-sm text-base-paragraph mt-3">
              <strong>Last Updated:</strong> June 18, 2025
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
