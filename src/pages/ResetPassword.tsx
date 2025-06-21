import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export function ResetPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { trackEvent } = useAnalytics({
    measurementId: import.meta.env.VITE_ANALYTICS_ID,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    mode: 'onSubmit',
  });

  const watchedPassword = watch('password', '');

  // Calculate password strength
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

  const onSubmit = async (data: ResetPasswordFormData) => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) throw error;

      trackEvent({
        category: "authentication",
        action: "password_reset",
        label: "success",
      });

      toast({
        title: "Success",
        description: "Your password has been reset successfully.",
      });

      // Redirect to login page
      navigate('/workspace');
    } catch (error: unknown) {
      console.error('Error resetting password:', error);
      
      trackEvent({
        category: "authentication",
        action: "password_reset",
        label: "error",
      });

      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to reset password. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>ProsePilot - Reset Password</title>
      </Helmet>
      <div className='flex flex-col min-h-[calc(100vh-64px)]'>
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 flex-1">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-base-heading">
                Reset your password
              </h2>
              <p className="mt-2 text-center text-sm text-base-paragraph">
                Enter your new password below.
              </p>
            </div>
            
            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="password" className="text-base-heading">New Password</Label>
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
                      className={`bg-brand-brand-accent border-secondary/20 focus:border-brand-accent pr-10 ${
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

                <div>
                  <Label htmlFor="confirmPassword" className="text-base-heading">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (value) => {
                          const password = watch('password');
                          return value === password || 'Passwords do not match';
                        }
                      })}
                      className={`bg-brand-brand-accent border-secondary/20 focus:border-brand-accent pr-10 ${
                        errors.confirmPassword ? 'border-state-error' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-state-error">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || passwordStrength < 3}
              >
                {loading ? 'Resetting password...' : 'Reset Password'}
              </Button>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
} 