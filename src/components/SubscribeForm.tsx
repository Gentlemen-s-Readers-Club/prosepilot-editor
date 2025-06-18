import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Mail, CheckCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface SubscribeFormProps {
  className?: string;
  variant?: 'default' | 'inline' | 'minimal';
  placeholder?: string;
  buttonText?: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
}

export function SubscribeForm({ 
  className = '', 
  variant = 'default',
  placeholder = "Enter your email address",
  buttonText = "Subscribe"
}: SubscribeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('first_name', data.firstName);
      formData.append('last_name', data.lastName);
      formData.append('email', data.email);
      formData.append('tags', JSON.stringify(['newsletter']));
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/subscribe-newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formData as unknown as Record<string, string>).toString(),
      });

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        setIsSubscribed(true);
        reset();
        toast({
          title: "Success!",
          description: responseData.message || "You've been subscribed to our newsletter",
        });
      } else {
        // Handle specific error cases
        let errorMessage = "Failed to subscribe. Please try again.";
        
        if (responseData.error) {
          switch (responseData.error) {
            case 'ALREADY_SUBSCRIBED':
              errorMessage = "This email is already subscribed to our newsletter.";
              break;
            case 'INVALID_EMAIL':
              errorMessage = "Please enter a valid email address.";
              break;
            case 'UNKNOWN_ERROR':
              errorMessage = "An unexpected error occurred. Please try again later.";
              break;
            default:
              errorMessage = responseData.message || errorMessage;
          }
        }
        
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to subscribe. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (variant === 'inline') {
    return isSubscribed ? (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex items-center gap-2 text-state-success">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Successfully subscribed!</span>
        </div>
      </div>
    ) : (
      <form onSubmit={handleSubmit(onSubmit)} className={`flex gap-2 ${className}`}>
        <div className="relative">
          <Input
            type="text"
            placeholder="First name"
            className={`bg-white border-gray-300 ${errors.firstName ? 'border-state-error' : ''}`}
            disabled={isSubmitting}
            {...register('firstName', { 
              required: 'First name is required',
              minLength: { value: 2, message: 'First name must be at least 2 characters' }
            })}
          />
          {errors.firstName && (
            <span className="left-0 text-xs text-state-error">
              {errors.firstName.message}
            </span>
          )}
        </div>
        <div className="relative">
          <Input
            type="text"
            placeholder="Last name"
            className={`bg-white border-gray-300 ${errors.lastName ? 'border-state-error' : ''}`}
            disabled={isSubmitting}
            {...register('lastName', { 
              required: 'Last name is required',
              minLength: { value: 2, message: 'Last name must be at least 2 characters' }
            })}
          />
          {errors.lastName && (
            <span className="left-0 text-xs text-state-error">
              {errors.lastName.message}
            </span>
          )}
        </div>
        <div className="flex-1 relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="email"
            placeholder={placeholder}
            className={`pl-10 bg-white border-gray-300 ${errors.email ? 'border-state-error' : ''}`}
            disabled={isSubmitting}
            {...register('email', { 
              required: 'Email is required',
              pattern: { 
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
                message: 'Invalid email address' 
              }
            })}
          />
          {errors.email && (
            <span className="left-0 text-xs text-state-error">
              {errors.email.message}
            </span>
          )}
        </div>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="whitespace-nowrap"
        >
          {isSubmitting ? 'Subscribing...' : buttonText}
        </Button>
      </form>
    );
  }

  if (variant === 'minimal') {
    return isSubscribed ? (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex items-center gap-2 text-state-success">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Successfully subscribed!</span>
        </div>
      </div>
    ) : (
      <form onSubmit={handleSubmit(onSubmit)} className={`space-y-3 ${className}`}>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="First name"
              className={`bg-white/10 border-white/20 text-white placeholder:text-white/70 ${errors.firstName ? 'border-state-error' : ''}`}
              disabled={isSubmitting}
              {...register('firstName', { 
                required: 'First name is required',
                minLength: { value: 2, message: 'First name must be at least 2 characters' }
              })}
            />
            {errors.firstName && (
              <span className="left-0 text-xs text-state-error">
                {errors.firstName.message}
              </span>
            )}
          </div>
          <div className="relative">
            <Input
              type="text"
              placeholder="Last name"
              className={`bg-white/10 border-white/20 text-white placeholder:text-white/70 ${errors.lastName ? 'border-state-error' : ''}`}
              disabled={isSubmitting}
              {...register('lastName', { 
                required: 'Last name is required',
                minLength: { value: 2, message: 'Last name must be at least 2 characters' }
              })}
            />
            {errors.lastName && (
              <span className="left-0 text-xs text-state-error">
                {errors.lastName.message}
              </span>
            )}
          </div>
        </div>
        <div className="relative">
          <Input
            type="email"
            placeholder={placeholder}
            className={`bg-white/10 border-white/20 text-white placeholder:text-white/70 ${errors.email ? 'border-state-error' : ''}`}
            disabled={isSubmitting}
            {...register('email', { 
              required: 'Email is required',
              pattern: { 
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
                message: 'Invalid email address' 
              }
            })}
          />
          {errors.email && (
            <span className="left-0 text-xs text-state-error">
              {errors.email.message}
            </span>
          )}
        </div>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          variant="secondaryOutline"
          className="w-full border-2 font-semibold text-md"
        >
          {isSubmitting ? 'Subscribing...' : buttonText}
        </Button>
      </form>
    );
  }

  return (
    <div className={`bg-white rounded-lg p-6 shadow-lg ${className}`}>
      {isSubscribed ? (
        <div className={`flex items-center gap-3 ${className}`}>
          <div className="flex items-center gap-2 text-state-success">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Successfully subscribed!</span>
          </div>
        </div>
      ) :(
      <>
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-brand-primary/10 p-2 rounded-lg">
            <Mail className="w-5 h-5 text-brand-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-base-heading">Stay Updated</h3>
            <p className="text-sm text-base-paragraph">Get writing tips and product updates</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <Input
                type="text"
                placeholder="First name"
                className={`bg-white border-gray-200 ${errors.firstName ? 'border-state-error' : ''}`}
                disabled={isSubmitting}
                {...register('firstName', { 
                  required: 'First name is required',
                  minLength: { value: 2, message: 'First name must be at least 2 characters' }
                })}
              />
              {errors.firstName && (
                <span className="left-0 text-xs text-state-error">
                  {errors.firstName.message}
                </span>
              )}
            </div>
            <div className="relative">
              <Input
                type="text"
                placeholder="Last name"
                className={`bg-white border-gray-200 ${errors.lastName ? 'border-state-error' : ''}`}
                disabled={isSubmitting}
                {...register('lastName', { 
                  required: 'Last name is required',
                  minLength: { value: 2, message: 'Last name must be at least 2 characters' }
                })}
              />
              {errors.lastName && (
                <span className="left-0 text-xs text-state-error">
                  {errors.lastName.message}
                </span>
              )}
            </div>
          </div>
          <div className="relative">
            <Input
              type="email"
              placeholder={placeholder}
              className={`bg-white border-gray-200 ${errors.email ? 'border-state-error' : ''}`}
              disabled={isSubmitting}
              {...register('email', { 
                required: 'Email is required',
                pattern: { 
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
                  message: 'Invalid email address' 
                }
              })}
            />
            {errors.email && (
              <span className="left-0 text-xs text-state-error">
                {errors.email.message}
              </span>
            )}
          </div>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Subscribing...' : buttonText}
          </Button>
        </form>
        
        <p className="text-xs text-gray-500 mt-3">
          No spam, unsubscribe at any time.
        </p>
      </>
    )}
    </div>
  );
}