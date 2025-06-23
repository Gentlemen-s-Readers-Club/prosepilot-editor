import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet';
import useAnalytics from '../hooks/useAnalytics';
import { RootState } from '../store';
import { useSelector } from 'react-redux';

interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
}

export function Signup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { trackEvent } = useAnalytics({
    measurementId: import.meta.env.VITE_ANALYTICS_ID,
  });
  const { status } = useSelector((state: RootState) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    mode: 'onSubmit',
  });

  const watchedPassword = watch('password', '');

  const calculatePasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength += 1;
    if (pass.match(/[A-Z]/)) strength += 1;
    if (pass.match(/[a-z]/)) strength += 1;
    if (pass.match(/[0-9]/)) strength += 1;
    if (pass.match(/[^A-Za-z0-9]/)) strength += 1;
    return strength;
  };

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(watchedPassword));
  }, [watchedPassword]);

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 0: return 'bg-state-error';
      case 1: return 'bg-state-error';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-state-success';
      case 5: return 'bg-state-success';
      default: return 'bg-gray-200';
    }
  };

  const getStrengthText = () => {
    switch (passwordStrength) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      case 5: return 'Very Strong';
      default: return '';
    }
  };

  const onSubmit = async ({ email, password }: SignupFormData) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
  
      if (error) {
        throw new Error(error.message);
      }

      trackEvent({
        category: "authentication",
        action: "signup",
        label: "email",
      });
      
      setSuccess(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Sign up failed",
      });
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/workspace`,
        },
      });

      if (error) throw error;
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>ProsePilot - Sign Up</title>
      </Helmet>
      <div className='flex flex-col min-h-[calc(100vh-64px)]'>
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 flex-1">
          <div className="max-w-md w-full space-y-8 bg-white rounded-lg p-8 shadow-md">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-base-heading">
                Create your account
              </h2>
            </div>
            {success ? (
              <div className="flex flex-col gap-4">
                <p className="text-center text-sm text-gray-500">
                  Please check your email to verify your account.
                </p>
              <Button
                onClick={() => navigate('/login')}
                className="w-full mt-8"
              >
                Back to Login
              </Button>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-4">
                  <Button
                    variant="outline"
                    onClick={() => handleSocialLogin('google')}
                    className="group w-full flex items-center justify-center gap-3"
                  >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" 
                      className="w-5 h-5 group-hover:brightness-0 group-hover:invert transition-all" />
                    Continue with Google
                  </Button>

                  {/* <Button
                    variant="outline"
                    onClick={() => handleSocialLogin('facebook')}
                    className="group w-full flex items-center justify-center gap-3"
                  >
                    <Facebook className="w-5 h-5 text-[#1877F2] group-hover:text-white transition-colors" />
                    Continue with Facebook
                  </Button> */}

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-brand-accent" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-base-background text-brand-accent">Or continue with email</span>
                    </div>
                  </div>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        {...register('fullName', {
                          required: 'Full name is required',
                          minLength: {
                            value: 2,
                            message: 'Full name must be at least 2 characters long'
                          }
                        })}
                        className={`bg-brand-brand-accent ${
                          errors.fullName ? 'border-state-error' : ''
                        }`}
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-sm text-state-error">{errors.fullName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Email address</Label>
                      <Input
                        id="email"
                        type="email"
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
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          {...register('password', {
                            required: 'Password is required',
                            minLength: {
                              value: 8,
                              message: 'Password must be at least 8 characters long'
                            },
                            pattern: {
                              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/,
                              message: 'Password must contain uppercase, lowercase, number, and special character'
                            }
                          })}
                          className={`bg-brand-brand-accent pr-10 ${
                            errors.password ? 'border-state-error' : ''
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-sm text-state-error">{errors.password.message}</p>
                      )}
                      {watchedPassword && (
                        <div className="mt-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-500">Password strength:</span>
                            <span className="text-sm font-medium text-gray-700">{getStrengthText()}</span>
                          </div>
                          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${getStrengthColor()}`}
                              style={{ width: `${(passwordStrength / 5) * 100}%` }}
                            />
                          </div>
                          <ul className="mt-2 text-sm text-gray-500 space-y-1">
                            <li className={watchedPassword.length >= 8 ? "text-state-success" : ""}>• At least 8 characters</li>
                            <li className={watchedPassword.match(/[A-Z]/) ? "text-state-success" : ""}>• At least one uppercase letter</li>
                            <li className={watchedPassword.match(/[a-z]/) ? "text-state-success" : ""}>• At least one lowercase letter</li>
                            <li className={watchedPassword.match(/[0-9]/) ? "text-state-success" : ""}>• At least one number</li>
                            <li className={watchedPassword.match(/[^A-Za-z0-9]/) ? "text-state-success" : ""}>• At least one special character</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={status === "loading" || passwordStrength < 3}
                  >
                    {status === "loading" ? 'Creating account...' : 'Create account'}
                  </Button>

                  <div className="text-center">
                    <span className="text-sm text-gray-500">
                      Already have an account?{' '}
                      <Button
                        variant="link"
                        asChild
                      >
                        <Link to="/login">
                          Sign in
                        </Link>
                      </Button>
                    </span>
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