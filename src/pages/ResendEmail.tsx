import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { supabase } from "../lib/supabase";
import { useToast } from "../hooks/use-toast";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Footer from "../components/Footer";

interface ResendEmailFormData {
  email: string;
}

export function ResendEmail() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendEmailFormData>({
    mode: 'onSubmit',
  });

  const onSubmit = async ({ email }: ResendEmailFormData) => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setSuccess(true);
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>ProsePilot - Resend Verification Email</title>
      </Helmet>
      <div className="flex flex-col min-h-[calc(100vh-64px)]">
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 flex-1">
          <div className="max-w-md w-full space-y-8 bg-white rounded-lg p-8 shadow-md">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-base-heading">
                Resend Verification Email
              </h2>
              {success ? (
                <p className="mt-2 text-center text-sm text-gray-500">
                  Verification email has been sent. Please check your inbox.
                </p>
              ) : (
                <p className="mt-2 text-center text-sm text-base-paragraph">
                  Enter your email address and we'll send you a new verification link.
                </p>
              )}
            </div>
            {success ? (
              <div className="flex flex-col gap-4">
                <Button
                  onClick={() => navigate('/login')}
                  className="w-full mt-8"
                >
                  Back to Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6" noValidate>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Please enter a valid email address'
                        }
                      })}
                      className={`bg-brand-brand-accent ${
                        errors.email ? 'border-state-error' : ''
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-state-error">{errors.email.message}</p>
                    )}
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Resend Email"}
                </Button>
                <div className="text-center">
                  <Button variant="link" asChild>
                    <Link to="/login">
                      Back to login
                    </Link>
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
} 