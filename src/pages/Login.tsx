import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { supabase } from "../lib/supabase";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "../hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";
import useAnalytics from "../hooks/useAnalytics";
import { checkAndCreatePaddleCustomer } from "../hooks/useNewUserHandler";

interface LoginFormData {
  email: string;
  password: string;
}

export function Login() {
  const { trackEvent } = useAnalytics({
    measurementId: import.meta.env.VITE_ANALYTICS_ID,
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    mode: 'onSubmit',
  });

  const onSubmit = async ({ email, password }: LoginFormData) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check and create Paddle customer for new users
      if (data.session) {
        await checkAndCreatePaddleCustomer(data.session);
      }

      trackEvent({
        category: "authentication",
        action: "login",
        label: "email",
      });
      navigate("/workspace");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Sign in failed",
      });
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/workspace`,
        },
      });

      if (error) throw error;

      trackEvent({
        category: "authentication",
        action: "login",
        label: provider,
      });
    } catch (error) {
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
        <title>ProsePilot - Login</title>
      </Helmet>
      <div className="flex flex-col min-h-[calc(100vh-64px)]">
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 flex-1">
          <div className="max-w-md w-full space-y-8 bg-white rounded-lg p-8 shadow-md">
            <div>
              <h2 className="mt-6 text-center text-3xl font-bold text-base-heading font-heading">
                Sign in to ProsePilot
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <Button
                variant="outline"
                onClick={() => handleSocialLogin("google")}
                className="w-full flex items-center justify-center gap-3 group"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-5 h-5 group-hover:brightness-0 group-hover:invert transition-all"
                />
                Continue with Google
              </Button>

              {/* <Button
                variant="outline"
                onClick={() => handleSocialLogin("facebook")}
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
                  <span className="px-2 bg-white text-brand-accent">
                    Or continue with email
                  </span>
                </div>
              </div>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="space-y-4">
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
                        required: 'Password is required'
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
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Button variant="link" asChild>
                  <Link to="/forgot-password">Forgot your password?</Link>
                </Button>
              </div>

              <Button type="submit" className="w-full" disabled={status === "loading"}>
                {status === "loading" ? "Signing in..." : "Sign in"}
              </Button>

              <div className="text-center">
                <span className="text-sm text-gray-500">
                  Don't have an account?{" "}
                  <Button variant="link" asChild>
                    <Link to="/signup">Sign up</Link>
                  </Button>
                </span>
              </div>
            </form>
          </div>
        </div>
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
