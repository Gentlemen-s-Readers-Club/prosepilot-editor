import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { CustomSelect, SelectOption } from '../components/ui/select';
import { ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';
import { SEOHead } from '../components/SEOHead';
import useAnalytics from '../hooks/useAnalytics';

const subjectOptions: SelectOption[] = [
  { value: '', label: 'Select a topic' },
  { value: 'billing', label: 'Billing & Subscriptions' },
  { value: 'technical', label: 'Technical Support' },
  { value: 'features', label: 'Feature Questions' },
  { value: 'account', label: 'Account Issues' },
  { value: 'other', label: 'Other' }
];

export function Support() {
  const { trackPageView } = useAnalytics({
    measurementId: import.meta.env.VITE_ANALYTICS_ID,
  });

  useEffect(() => {
    trackPageView(window.location.pathname, 'Support');
  }, [trackPageView]);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    updates: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const handleSubjectChange = (option: SelectOption) => {
    setFormData({ ...formData, subject: option.value });
  };

  return (
    <>
      <SEOHead
        title="Support - Get Help with ProsePilot"
        description="Get help with ProsePilot's AI writing platform. Contact our support team for technical assistance, billing questions, feature guidance, and account issues."
        keywords="ProsePilot support, AI writing help, technical support, customer service, writing platform assistance"
      />
      {/* Contact Form */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-base-heading sm:text-5xl">How can we help you?</h1>
            <p className="mt-4 text-xl text-base-paragraph">
              Send us a message and we'll get back to you within 24 hours
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-base-heading">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    className="mt-1"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-base-heading">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="mt-1"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="subject" className="text-base-heading">Subject</Label>
                <div className="mt-1">
                  <CustomSelect
                    value={subjectOptions.find(option => option.value === formData.subject) || subjectOptions[0]}
                    onChange={(newValue) => {
                      if (newValue && !Array.isArray(newValue)) {
                        handleSubjectChange(newValue as SelectOption);
                      }
                    }}
                    options={subjectOptions}
                    placeholder="Select a topic"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="message" className="text-base-heading">Message</Label>
                <textarea
                  id="message"
                  rows={6}
                  placeholder="Describe your issue or question in detail..."
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-base-border focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="updates"
                  checked={formData.updates}
                  onChange={(checked) => setFormData({ ...formData, updates: checked })}
                />
                <Label htmlFor="updates" className="text-sm text-gray-700">
                  Send me updates about new features and improvements
                </Label>
              </div>

              <Button 
                type="submit"
                className="w-full bg-brand-primary hover:bg-brand-primary/90 py-3"
              >
                Send Message
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}