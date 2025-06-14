import React, { useState } from 'react';
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

export function SubscribeForm({ 
  className = '', 
  variant = 'default',
  placeholder = "Enter your email address",
  buttonText = "Subscribe"
}: SubscribeFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        variant: "destructive",
        title: "Invalid email",
        description: "Please enter a valid email address",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubscribed(true);
      setEmail('');
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to subscribe. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex items-center gap-2 text-state-success">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Successfully subscribed!</span>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <div className="flex-1 relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            className="pl-10 bg-white border-gray-300"
            disabled={isSubmitting}
          />
        </div>
        <Button 
          type="submit" 
          disabled={isSubmitting || !email}
          className="whitespace-nowrap"
        >
          {isSubmitting ? 'Subscribing...' : buttonText}
        </Button>
      </form>
    );
  }

  if (variant === 'minimal') {
    return (
      <form onSubmit={handleSubmit} className={`space-y-3 ${className}`}>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
          disabled={isSubmitting}
        />
        <Button 
          type="submit" 
          disabled={isSubmitting || !email}
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
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-brand-primary/10 p-2 rounded-lg">
          <Mail className="w-5 h-5 text-brand-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Stay Updated</h3>
          <p className="text-sm text-gray-600">Get writing tips and product updates</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className="bg-gray-50 border-gray-200"
          disabled={isSubmitting}
        />
        <Button 
          type="submit" 
          disabled={isSubmitting || !email}
          className="w-full"
        >
          {isSubmitting ? 'Subscribing...' : buttonText}
        </Button>
      </form>
      
      <p className="text-xs text-gray-500 mt-3">
        No spam, unsubscribe at any time.
      </p>
    </div>
  );
}