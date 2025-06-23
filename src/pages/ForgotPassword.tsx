import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet';

interface ForgotPasswordForm {
  email: string;
}

export function ForgotPassword() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ForgotPasswordForm>();

  const onSubmit = async (data: ForgotPasswordForm) => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSuccess(true);
      // Reset form after successful submission
      reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>ProsePilot - Forgot Password</title>
      </Helmet>
      <div className='flex flex-col min-h-[calc(100vh-64px)]'>
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 flex-1">
          <div className="max-w-md w-full space-y-8 bg-white rounded-lg p-8 shadow-md">
            {success ? (
              <div className="text-center">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-base-heading">
                  Check your email
                </h2>
                <p className="mt-2 text-center text-sm text-base-paragraph">
                  We've sent you an email with a link to reset your password.
                </p>
              <div className="mt-6">
                <Button onClick={() => navigate('/login')}>
                    Back to login
                </Button>
              </div>
              </div>
            ) : (
              <>
              <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-base-heading">
                  Reset your password
                </h2>
                <p className="mt-2 text-center text-sm text-base-paragraph">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>
              <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
                <div>
                  <Label htmlFor="email" className="text-base-heading">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    className={`bg-brand-brand-accent border-secondary/20 focus:border-brand-accent ${
                      errors.email ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Sending reset link...' : 'Send reset link'}
                </Button>

                <div className="text-center">
                  <Button
                    variant="link"
                    asChild
                  >
                    <Link to="/login">
                      Back to login
                    </Link>
                  </Button>
                </div>
              </form>
            </>
            )}
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}