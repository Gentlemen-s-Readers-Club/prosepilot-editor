import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { CustomSelect, SelectOption } from '../components/ui/select';
import { ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet';
import useAnalytics from '../hooks/useAnalytics';
import { supabase } from '../lib/supabase';
import { toast } from '../hooks/use-toast';
import { useSelector } from 'react-redux';
import { selectCurrentPlan } from '../store/slices/subscriptionSlice';
import { plans } from '../lib/consts';

interface SupportFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const subjectOptions: SelectOption[] = [
  { value: '', label: 'Select a topic' },
  { value: 'billing', label: 'Billing & Subscriptions' },
  { value: 'technical', label: 'Technical Support' },
  { value: 'features', label: 'Feature Questions' },
  { value: 'account', label: 'Account Issues' },
  { value: 'other', label: 'Other' }
];

export function Support() {
  const currentPlan = useSelector(selectCurrentPlan);

  const { trackPageView } = useAnalytics({
    measurementId: import.meta.env.VITE_ANALYTICS_ID,
  });

  useEffect(() => {
    trackPageView(window.location.pathname, 'Support');
  }, [trackPageView]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<SelectOption>(subjectOptions[0]);
  const [subjectError, setSubjectError] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SupportFormData>({
    mode: 'onSubmit',
  });

  const onSubmit = async (formData: SupportFormData) => {
    // Validate subject manually since it's handled by CustomSelect
    if (!formData.subject || formData.subject === '') {
      setSubjectError(true);
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase.functions.invoke('sent-support-email', {
        body: {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          plan: plans.find(plan => plan.id === currentPlan)?.name,
        },
      });

      if (error) {
        console.error('Error sending support email:', error);
        toast({
          title: "Error",
          description: "Failed to send support email. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Support email sent successfully.",
          variant: "default",
        });
        setSelectedSubject(subjectOptions[0]);
        setValue('subject', '');
        setValue('name', '');
        setValue('email', '');
        setValue('message', '');
      }
    } catch (error) {
      console.error('Error sending support email:', error);
      toast({
        title: "Error",
        description: "Failed to send support email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubjectChange = (option: SelectOption) => {
    setSelectedSubject(option);
    setValue('subject', option.value);
    if (option.value === '') {
      setSubjectError(true);
    } else {
      setSubjectError(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>ProsePilot - Support</title>
      </Helmet>
      {/* Contact Form */}
      <div className="bg-base-background py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-base-heading sm:text-5xl">How can we help you?</h1>
            <p className="mt-4 text-xl text-base-paragraph">
              Send us a message and we'll get back to you within 24 hours
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-base-heading">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    className={`mt-1 ${errors.name ? 'border-state-error' : ''}`}
                    {...register('name', {
                      required: 'Name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters'
                      }
                    })}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-state-error">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email" className="text-base-heading">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className={`mt-1 ${errors.email ? 'border-state-error' : ''}`}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Please enter a valid email address'
                      }
                    })}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-state-error">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="subject" className="text-base-heading">Subject</Label>
                <div className="mt-1">
                  <CustomSelect
                    value={selectedSubject}
                    onChange={(newValue) => {
                      if (newValue && !Array.isArray(newValue)) {
                        handleSubjectChange(newValue as SelectOption);
                      }
                    }}
                    options={subjectOptions}
                    placeholder="Select a topic"
                    error={subjectError ? 'Please select a subject' : ''}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="message" className="text-base-heading">Message</Label>
                <textarea
                  id="message"
                  rows={6}
                  placeholder="Describe your issue or question in detail..."
                  className={`mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-base-border focus:outline-none focus:ring-1 focus:ring-brand-primary ${
                    errors.message ? 'border-state-error' : ''
                  }`}
                  {...register('message', {
                    required: 'Message is required',
                    minLength: {
                      value: 10,
                      message: 'Message must be at least 10 characters'
                    }
                  })}
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-state-error">{errors.message.message}</p>
                )}
              </div>

              <Button 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Message'}
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