import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  Globe, 
  Clock, 
  FileText, 
  AlertTriangle, 
  Users, 
  Mail, 
  ExternalLink 
} from 'lucide-react';
import Footer from '../components/Footer';

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-base-background">
      {/* Header */}
      <div className="bg-white pt-16 border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center mb-6">
            <Link to="/" className="flex items-center text-base-heading hover:text-base-heading/80 mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
          
          <div className="flex items-start">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Privacy Policy
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Last Updated: June 15, 2025
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          
          {/* Introduction */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <Shield className="w-6 h-6 text-blue-600 mt-1 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">About This Policy</h3>
                <p className="text-blue-800 text-sm">
                  This Privacy Policy explains how ProsePilot ("we", "us", or "our") collects, uses, and shares your personal information 
                  when you use our website, mobile applications, and services (collectively, the "Services"). We respect your privacy and 
                  are committed to protecting your personal data. Please read this policy carefully to understand our practices regarding 
                  your personal data.
                </p>
              </div>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h3>
            <nav className="space-y-1">
              <a href="#information-we-collect" className="block text-brand-primary hover:underline py-1">1. Information We Collect</a>
              <a href="#how-we-use" className="block text-brand-primary hover:underline py-1">2. How We Use Your Information</a>
              <a href="#legal-basis" className="block text-brand-primary hover:underline py-1">3. Legal Basis for Processing</a>
              <a href="#sharing-information" className="block text-brand-primary hover:underline py-1">4. Sharing Your Information</a>
              <a href="#cookies" className="block text-brand-primary hover:underline py-1">5. Cookies and Tracking Technologies</a>
              <a href="#data-retention" className="block text-brand-primary hover:underline py-1">6. Data Retention</a>
              <a href="#data-security" className="block text-brand-primary hover:underline py-1">7. Data Security</a>
              <a href="#your-rights" className="block text-brand-primary hover:underline py-1">8. Your Rights and Choices</a>
              <a href="#international-transfers" className="block text-brand-primary hover:underline py-1">9. International Data Transfers</a>
              <a href="#children" className="block text-brand-primary hover:underline py-1">10. Children's Privacy</a>
              <a href="#changes" className="block text-brand-primary hover:underline py-1">11. Changes to This Privacy Policy</a>
              <a href="#contact" className="block text-brand-primary hover:underline py-1">12. Contact Us</a>
            </nav>
          </div>

          {/* 1. Information We Collect */}
          <section id="information-we-collect" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Database className="w-8 h-8 text-base-heading mr-4" />
              1. Information We Collect
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Information You Provide to Us</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Account Information:</strong> When you register for an account, we collect your name, email address, and password.</li>
                  <li><strong>Profile Information:</strong> Information you provide in your user profile, such as a profile picture, biography, or professional information.</li>
                  <li><strong>Content:</strong> The content you create, upload, or generate using our Services, including book outlines, manuscripts, and other written materials.</li>
                  <li><strong>Payment Information:</strong> If you subscribe to our paid services, we collect payment information, which may include credit card details, billing address, and other financial information necessary to process your payment.</li>
                  <li><strong>Communications:</strong> Information you provide when you contact us for customer support or otherwise communicate with us.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Information We Collect Automatically</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Usage Information:</strong> Information about how you use our Services, including the features you use, the time spent on the Services, and the pages you visit.</li>
                  <li><strong>Device Information:</strong> Information about the device you use to access our Services, including hardware model, operating system, unique device identifiers, and mobile network information.</li>
                  <li><strong>Log Information:</strong> Server logs, which may include your IP address, browser type, referring/exit pages, operating system, date/time stamps, and clickstream data.</li>
                  <li><strong>Location Information:</strong> General location information inferred from your IP address.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Information from Third Parties</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Social Media:</strong> If you choose to link your account with a social media platform, we may receive information from that platform, such as your profile information.</li>
                  <li><strong>Service Providers:</strong> We may receive information about you from our service providers, such as payment processors, analytics providers, and advertising partners.</li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">AI-Generated Content</h3>
                <p className="text-purple-800 text-sm">
                  When you use our AI writing features, we collect and process the prompts, instructions, and other inputs you provide to generate content. 
                  This information is used to train and improve our AI models, enhance the quality of generated content, and provide personalized recommendations. 
                  You retain ownership of both the inputs you provide and the outputs generated by our AI.
                </p>
              </div>
            </div>
          </section>

          {/* 2. How We Use Your Information */}
          <section id="how-we-use" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <FileText className="w-8 h-8 text-base-heading mr-4" />
              2. How We Use Your Information
            </h2>
            
            <div className="space-y-6">
              <p>We use the information we collect for various purposes, including:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Provision</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Providing and maintaining our Services</li>
                    <li>Processing transactions and managing your account</li>
                    <li>Generating AI content based on your inputs</li>
                    <li>Storing your files and content</li>
                    <li>Providing customer support</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Improvement</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Improving and personalizing our Services</li>
                    <li>Developing new features and functionality</li>
                    <li>Training and improving our AI models</li>
                    <li>Analyzing usage patterns and trends</li>
                    <li>Debugging and fixing issues</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Communication</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Sending administrative messages</li>
                    <li>Providing information about new features</li>
                    <li>Sending marketing communications (with consent)</li>
                    <li>Responding to your inquiries</li>
                    <li>Conducting surveys and collecting feedback</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Security and Compliance</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Protecting against fraud and unauthorized access</li>
                    <li>Enforcing our Terms of Service</li>
                    <li>Complying with legal obligations</li>
                    <li>Resolving disputes</li>
                    <li>Addressing intellectual property concerns</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Legal Basis for Processing */}
          <section id="legal-basis" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Lock className="w-8 h-8 text-base-heading mr-4" />
              3. Legal Basis for Processing
            </h2>
            
            <div className="space-y-6">
              <p>
                If you are located in the European Economic Area (EEA) or the United Kingdom, we collect and process your personal data only where we have a legal basis for doing so. The legal bases depend on the Services you use and how you use them. They include:
              </p>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Consent</h3>
                  <p className="text-gray-700">
                    You have given us permission to process your personal data for a specific purpose, such as sending you marketing communications or processing certain types of sensitive data.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance of a Contract</h3>
                  <p className="text-gray-700">
                    Processing your data is necessary to provide the Services you have signed up for, or to take steps at your request prior to providing those Services.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Legitimate Interests</h3>
                  <p className="text-gray-700">
                    Processing your data is necessary for our legitimate interests or the legitimate interests of a third party, provided those interests are not outweighed by your rights and interests.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Legal Obligation</h3>
                  <p className="text-gray-700">
                    Processing your data is necessary to comply with a legal obligation, such as retaining information for tax, legal reporting, and auditing obligations.
                  </p>
                </div>
              </div>
              
              <p>
                If you have questions about or need further information concerning the legal basis on which we collect and use your personal information, please contact us using the contact details provided below.
              </p>
            </div>
          </section>

          {/* 4. Sharing Your Information */}
          <section id="sharing-information" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Users className="w-8 h-8 text-base-heading mr-4" />
              4. Sharing Your Information
            </h2>
            
            <div className="space-y-6">
              <p>
                We may share your personal information in the following situations:
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Service Providers</h3>
                  <p className="text-gray-700 mb-2">
                    We share information with third-party vendors, consultants, and other service providers who perform services on our behalf, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Cloud storage providers</li>
                    <li>Payment processors</li>
                    <li>Analytics providers</li>
                    <li>Customer support services</li>
                    <li>Email service providers</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Business Transfers</h3>
                  <p className="text-gray-700">
                    If we are involved in a merger, acquisition, financing, reorganization, bankruptcy, or sale of our assets, your information may be transferred as part of that transaction. We will notify you of any such change in ownership or control of your personal information.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Legal Requirements</h3>
                  <p className="text-gray-700">
                    We may disclose your information where required to do so by law or subpoena or if we reasonably believe that such action is necessary to (a) comply with the law and the reasonable requests of law enforcement; (b) protect the security or integrity of our Services; and/or (c) exercise or protect the rights, property, or personal safety of ProsePilot, our users, or others.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">With Your Consent</h3>
                  <p className="text-gray-700">
                    We may share your information with third parties when you explicitly consent to such sharing.
                  </p>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-3">Third-Party Services</h3>
                <p className="text-yellow-800 text-sm mb-3">
                  Our Services may include links to third-party websites, products, or services. We are not responsible for the privacy practices of these third parties, and we encourage you to read their privacy policies before providing any information to them.
                </p>
                <p className="text-yellow-800 text-sm">
                  We use the following third-party services that may collect information about you:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm text-yellow-800 mt-2">
                  <li><strong>Google Analytics:</strong> For website analytics and user behavior tracking</li>
                  <li><strong>Paddle:</strong> For payment processing</li>
                  <li><strong>Supabase:</strong> For database and authentication services</li>
                  <li><strong>Meta Pixel:</strong> For advertising and conversion tracking</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 5. Cookies and Tracking Technologies */}
          <section id="cookies" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Eye className="w-8 h-8 text-base-heading mr-4" />
              5. Cookies and Tracking Technologies
            </h2>
            
            <div className="space-y-6">
              <p>
                We and our third-party service providers use cookies, web beacons, and other tracking technologies to collect information about your browsing activities on our Services and on third-party websites with which we have partnered.
              </p>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Types of Cookies We Use</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h4 className="font-medium text-gray-900 mb-2">Essential Cookies</h4>
                    <p className="text-sm text-gray-700">
                      These cookies are necessary for the website to function properly and cannot be switched off in our systems. They are usually set in response to actions made by you, such as setting your privacy preferences, logging in, or filling in forms.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h4 className="font-medium text-gray-900 mb-2">Performance Cookies</h4>
                    <p className="text-sm text-gray-700">
                      These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h4 className="font-medium text-gray-900 mb-2">Functional Cookies</h4>
                    <p className="text-sm text-gray-700">
                      These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h4 className="font-medium text-gray-900 mb-2">Targeting Cookies</h4>
                    <p className="text-sm text-gray-700">
                      These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant advertisements on other sites.
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Your Cookie Choices</h3>
                <p className="text-gray-700 mb-4">
                  Most web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove or reject cookies. Please note that if you choose to remove or reject cookies, this could affect the availability and functionality of our Services.
                </p>
                <p className="text-gray-700">
                  In addition to browser controls, we provide a cookie preference center that allows you to manage your cookie preferences on our website. You can access this by clicking on "Cookie Preferences" in the footer of our website.
                </p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Do Not Track</h3>
                <p className="text-blue-800 text-sm">
                  Some browsers have a "Do Not Track" feature that lets you tell websites that you do not want to have your online activities tracked. These features are not yet uniform, so we do not currently respond to such signals.
                </p>
              </div>
            </div>
          </section>

          {/* 6. Data Retention */}
          <section id="data-retention" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Clock className="w-8 h-8 text-base-heading mr-4" />
              6. Data Retention
            </h2>
            
            <div className="space-y-6">
              <p>
                We retain your personal information for as long as necessary to fulfill the purposes for which we collected it, including for the purposes of satisfying any legal, accounting, or reporting requirements.
              </p>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Retention Periods</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Account Information:</strong> We retain your account information for as long as your account is active and for a reasonable period thereafter in case you decide to reactivate the Services.</li>
                  <li><strong>Content:</strong> We retain the content you create or upload for as long as you maintain your account. If you delete specific content, we will remove it from our active systems, but it may remain in our backup systems for a limited period.</li>
                  <li><strong>Payment Information:</strong> We retain payment information as required by applicable tax and accounting laws.</li>
                  <li><strong>Usage Data:</strong> We retain usage data for a reasonable period of time, typically no more than 24 months.</li>
                </ul>
              </div>
              
              <p>
                When we no longer need to process your information for the purposes for which it was collected, we will either delete or anonymize such information, unless we are legally required to retain it for a longer period.
              </p>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Deletion</h3>
                <p className="text-gray-700 text-sm">
                  If you delete your account, we will delete or anonymize your account information and content within 30 days, except for information that we are required to retain for legal or legitimate business purposes. Please note that content you have shared with others or that others have copied may remain visible after you have deleted your account.
                </p>
              </div>
            </div>
          </section>

          {/* 7. Data Security */}
          <section id="data-security" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Lock className="w-8 h-8 text-base-heading mr-4" />
              7. Data Security
            </h2>
            
            <div className="space-y-6">
              <p>
                We have implemented appropriate technical and organizational measures designed to protect the security of your personal information. However, please note that no method of transmission over the Internet or method of electronic storage is 100% secure.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Security Measures</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Encryption of sensitive data in transit and at rest</li>
                    <li>Regular security assessments and penetration testing</li>
                    <li>Access controls and authentication mechanisms</li>
                    <li>Monitoring for suspicious activities</li>
                    <li>Regular security updates and patches</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Breach Procedures</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Incident response plan for potential breaches</li>
                    <li>Notification procedures in accordance with applicable laws</li>
                    <li>Remediation and recovery processes</li>
                    <li>Post-incident analysis and improvements</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-3">Your Responsibility</h3>
                <p className="text-yellow-800 text-sm">
                  The security of your account also depends on you keeping your account password confidential. You are responsible for maintaining the confidentiality of your password and for any activity that occurs under your account. Please notify us immediately of any unauthorized access to your account or any other breach of security.
                </p>
              </div>
            </div>
          </section>

          {/* 8. Your Rights and Choices */}
          <section id="your-rights" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Shield className="w-8 h-8 text-base-heading mr-4" />
              8. Your Rights and Choices
            </h2>
            
            <div className="space-y-6">
              <p>
                Depending on your location, you may have certain rights regarding your personal information. These may include:
              </p>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Rights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <ul className="list-disc pl-6 space-y-1">
                      <li><strong>Access:</strong> The right to access the personal information we hold about you.</li>
                      <li><strong>Rectification:</strong> The right to request that we correct inaccurate or incomplete personal information.</li>
                      <li><strong>Erasure:</strong> The right to request that we delete your personal information in certain circumstances.</li>
                      <li><strong>Restriction:</strong> The right to request that we restrict the processing of your personal information in certain circumstances.</li>
                    </ul>
                  </div>
                  <div>
                    <ul className="list-disc pl-6 space-y-1">
                      <li><strong>Data Portability:</strong> The right to receive your personal information in a structured, commonly used format.</li>
                      <li><strong>Objection:</strong> The right to object to our processing of your personal information in certain circumstances.</li>
                      <li><strong>Withdraw Consent:</strong> The right to withdraw your consent at any time where we rely on consent to process your personal information.</li>
                      <li><strong>Complaint:</strong> The right to lodge a complaint with a supervisory authority.</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">For EU/EEA Residents</h3>
                <p className="text-blue-800 text-sm">
                  If you are located in the European Economic Area (EEA), you have certain rights under the General Data Protection Regulation (GDPR). To exercise these rights, please contact us using the information provided in the "Contact Us" section below. We will respond to your request within 30 days. Please note that we may ask you to verify your identity before responding to such requests.
                </p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">For California Residents</h3>
                <p className="text-green-800 text-sm">
                  If you are a California resident, you can learn more about your consumer privacy rights by reviewing the <a href="https://oag.ca.gov/privacy/ccpa" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">California Consumer Privacy Act</a> and the <a href="https://cppa.ca.gov/" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">California Privacy Rights Act</a>.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">How to Exercise Your Rights</h3>
                <p className="text-gray-700 mb-3">
                  You can exercise your rights by:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Accessing your account settings to update your personal information</li>
                  <li>Contacting us at privacy@prosepilot.com</li>
                  <li>Using the "Delete Account" option in your account settings</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 9. International Data Transfers */}
          <section id="international-transfers" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Globe className="w-8 h-8 text-base-heading mr-4" />
              9. International Data Transfers
            </h2>
            
            <div className="space-y-6">
              <p>
                We are based in the United States and may process, store, and transfer the personal information we collect in the United States and other countries, which may have data protection laws that are different from those in your country.
              </p>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Safeguards for International Transfers</h3>
                <p className="text-gray-700 mb-3">
                  When we transfer personal information outside of the EEA, UK, or Switzerland, we ensure that appropriate safeguards are in place to protect your personal information, including:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Standard Contractual Clauses approved by the European Commission</li>
                  <li>Binding Corporate Rules</li>
                  <li>Adequacy decisions by the European Commission</li>
                  <li>Other legally approved mechanisms</li>
                </ul>
              </div>
              
              <p>
                By using our Services, you consent to the transfer of your information to the United States and other countries, which may have different data protection rules than those in your country.
              </p>
            </div>
          </section>

          {/* 10. Children's Privacy */}
          <section id="children" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <AlertTriangle className="w-8 h-8 text-base-heading mr-4" />
              10. Children's Privacy
            </h2>
            
            <div className="space-y-6">
              <p>
                Our Services are not directed to children under the age of 16, and we do not knowingly collect personal information from children under 16. If we learn that we have collected personal information from a child under 16, we will take steps to delete such information as soon as possible.
              </p>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-3">Notice to Parents and Guardians</h3>
                <p className="text-red-800 text-sm">
                  If you are a parent or guardian and you believe that your child has provided us with personal information without your consent, please contact us at privacy@prosepilot.com. We will take steps to remove that information from our servers.
                </p>
              </div>
            </div>
          </section>

          {/* 11. Changes to This Privacy Policy */}
          <section id="changes" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <FileText className="w-8 h-8 text-base-heading mr-4" />
              11. Changes to This Privacy Policy
            </h2>
            
            <div className="space-y-6">
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. If we make material changes to this Privacy Policy, we will notify you by:
              </p>
              
              <ul className="list-disc pl-6 space-y-1">
                <li>Posting the updated Privacy Policy on our website</li>
                <li>Sending an email to the email address associated with your account</li>
                <li>Displaying a prominent notice on our Services</li>
              </ul>
              
              <p>
                The date the Privacy Policy was last revised is identified at the top of the page. You are responsible for ensuring we have an up-to-date active and deliverable email address for you, and for periodically visiting our website and this Privacy Policy to check for any changes.
              </p>
            </div>
          </section>

          {/* 12. Contact Us */}
          <section id="contact" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Mail className="w-8 h-8 text-base-heading mr-4" />
              12. Contact Us
            </h2>
            
            <div className="space-y-6">
              <p>
                If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us at:
              </p>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <p><strong>Email:</strong> privacy@prosepilot.com</p>
                  <p><strong>Postal Address:</strong> ProsePilot Inc., 123 Writer's Lane, Suite 456, San Francisco, CA 94107, USA</p>
                  <p><strong>Data Protection Officer:</strong> dpo@prosepilot.com</p>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">EU Representative</h3>
                <p className="text-blue-800 text-sm">
                  For individuals in the EU/EEA, you may also contact our EU representative:
                </p>
                <div className="space-y-1 text-sm text-blue-800 mt-2">
                  <p>ProsePilot EU Representative</p>
                  <p>Email: eu-rep@prosepilot.com</p>
                  <p>Address: Bergstrasse 15, 10115 Berlin, Germany</p>
                </div>
              </div>
              
              <p>
                We will respond to your inquiry as soon as possible and within the timeframe required by applicable law.
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}