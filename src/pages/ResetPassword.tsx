import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet';
import useAnalytics from '../hooks/useAnalytics';

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { trackEvent } = useAnalytics({
    measurementId: import.meta.env.VITE_ANALYTICS_ID,
  });

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

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
    setPasswordStrength(calculatePasswordStrength(password));
  }, [password]);

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

  // Check if the reset token is valid
  useEffect(() => {
    const checkToken = async () => {
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      const type = searchParams.get('type');

      if (!accessToken || !refreshToken || type !== 'recovery') {
        setIsValidToken(false);
        return;
      }

      try {
        // Set the session with the tokens from the URL
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error('Token validation error:', error);
          setIsValidToken(false);
        } else {
          setIsValidToken(true);
        }
      } catch (error) {
        console.error('Error validating token:', error);
        setIsValidToken(false);
      }
    };

    checkToken();
  }, [searchParams]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password.length < 8) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Password must be at least 8 characters long",
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match",
      });
      setLoading(false);
      return;
    }

    if (passwordStrength < 3) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Password is not strong enough",
      });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      trackEvent({
        category: "authentication",
        action: "password_reset",
        label: "success",
      });

      toast({
        title: "Success",
        description: "Your password has been reset successfully. You can now sign in with your new password.",
      });

      // Redirect to login page
      navigate('/workspace/login');
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

  // Show loading while checking token
  if (isValidToken === null) {
    return (
      <>
        <Helmet>
          <title>ProsePilot - Reset Password</title>
        </Helmet>
        <div className='flex flex-col min-h-[calc(100vh-64px)]'>
          <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 flex-1">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-accent mx-auto mb-4"></div>
              <p className="text-base-paragraph">Validating reset link...</p>
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  // Show error if token is invalid
  if (isValidToken === false) {
    return (
      <>
        <Helmet>
          <title>ProsePilot - Invalid Reset Link</title>
        </Helmet>
        <div className='flex flex-col min-h-[calc(100vh-64px)]'>
          <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 flex-1">
            <div className="max-w-md w-full space-y-8 text-center">
              <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-base-heading">
                  Invalid Reset Link
                </h2>
                <p className="mt-2 text-center text-sm text-base-paragraph">
                  This password reset link is invalid or has expired. Please request a new password reset.
                </p>
              </div>
              
              <div className="space-y-4">
                <Button
                  onClick={() => navigate('/workspace/forgot-password')}
                  className="w-full"
                >
                  Request New Reset Link
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate('/workspace/login')}
                  className="w-full"
                >
                  Back to Login
                </Button>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }

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
            
            <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="password" className="text-base-heading">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-brand-brand-accent border-secondary/20 focus:border-brand-accent pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  
                  {password && (
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
                        <li className={password.length >= 8 ? "text-state-success" : ""}>• At least 8 characters</li>
                        <li className={password.match(/[A-Z]/) ? "text-state-success" : ""}>• At least one uppercase letter</li>
                        <li className={password.match(/[a-z]/) ? "text-state-success" : ""}>• At least one lowercase letter</li>
                        <li className={password.match(/[0-9]/) ? "text-state-success" : ""}>• At least one number</li>
                        <li className={password.match(/[^A-Za-z0-9]/) ? "text-state-success" : ""}>• At least one special character</li>
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
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="bg-brand-brand-accent border-secondary/20 focus:border-brand-accent pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || passwordStrength < 3 || password.length < 8 || password !== confirmPassword}
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