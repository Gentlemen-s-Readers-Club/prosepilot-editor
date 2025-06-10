import React, { useState, useEffect } from "react";
import { Navigation } from "../components/Navigation";
import { Button } from "../components/ui/button";
import { Check, Crown, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { usePaddle } from "../contexts/PaddleContext";
import { usePaddlePrices } from "../hooks/usePaddlePrices";
import { useToast } from "../hooks/use-toast";
import { useSelector } from "react-redux";
import { RootState } from "../store";

// Utility function to format price
const formatPrice = (
  amount: string | number | undefined,
  isDollarAmount = false
) => {
  if (amount === undefined) return "Loading...";
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;
  // If it's already in dollars (like credit packages), don't divide by 100
  return isDollarAmount
    ? numericAmount.toFixed(2)
    : (numericAmount / 100).toFixed(2);
};

const plans = [
  {
    id: "starter",
    name: "Starter",
    icon: <Zap className="h-6 w-6" />,
    color: "bg-blue-500/10 text-blue-500",
    description: "Perfect for getting started with AI writing assistance",
    features: [
      "Up to 25 AI responses per month",
      "Basic writing assistance",
      "Standard response time",
      "Email support",
    ],
    credits: 25,
    priceId: "pri_01jxbekwgfx9k8tm8cbejzrns6", // From your usePaddlePrices hook
    price: 900, // $9.00 in cents
  },
  {
    id: "pro",
    name: "Pro",
    icon: <Crown className="h-6 w-6" />,
    color: "bg-purple-500/10 text-purple-500",
    description: "For professionals who need more power and features",
    features: [
      "Unlimited AI responses",
      "Advanced writing features",
      "Priority response time",
      "Priority support",
      "Custom templates",
      "Analytics dashboard",
    ],
    credits: -1, // Unlimited
    isPopular: true,
    priceId: "pri_01jxben1kf0pfntb8162sfxhba", // From your usePaddlePrices hook
    price: 2900, // $29.00 in cents
  },
];

const creditPackages = [
  {
    id: 1,
    name: "Small Pack",
    credits: 10,
    price: 5,
  },
  {
    id: 2,
    name: "Medium Pack",
    credits: 25,
    price: 10,
  },
  {
    id: 3,
    name: "Large Pack",
    credits: 50,
    price: 18,
  },
];

export function Subscription() {
  const { profile, status: profileStatus } = useSelector(
    (state: RootState) => state.profile
  );
  const { toast } = useToast();
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [creditsUsed] = useState(0);
  const [creditsLimit] = useState(0);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showBuyCreditsDialog, setShowBuyCreditsDialog] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<
    (typeof creditPackages)[0] | null
  >(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);

  const { paddle, loading: paddleLoading, error: paddleError } = usePaddle();
  const {
    loading: pricesLoading,
    error: pricesError,
    availablePrices,
  } = usePaddlePrices(paddle);

  // Debug logging
  useEffect(() => {
    console.log("Profile status:", profileStatus);
    console.log("Profile data:", profile);
    console.log("Paddle loading:", paddleLoading);
    console.log("Paddle error:", paddleError);
  }, [profile, profileStatus, paddleLoading, paddleError]);

  // Handle URL parameters for checkout success/cancel
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get("success");
    const cancelled = urlParams.get("cancelled");

    if (success === "true") {
      toast({
        title: "Success!",
        description: "Your subscription has been activated successfully.",
      });
      // Clean up URL
      window.history.replaceState({}, "", window.location.pathname);
    } else if (cancelled === "true") {
      toast({
        title: "Cancelled",
        description: "Your checkout was cancelled.",
        variant: "destructive",
      });
      // Clean up URL
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [toast]);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      setSubscriptionLoading(true);

      if (!profile?.email) {
        if (profileStatus === "error") {
          console.error("Profile status error, skipping subscription fetch");
        } else if (profileStatus === "success") {
          console.warn("Profile loaded but no email found:", profile);
        } else {
          console.log("Profile not yet loaded, status:", profileStatus);
        }
        setSubscriptionLoading(false);
        return;
      }

      try {
        console.log("User email for subscription check:", profile.email);
        console.log("User profile data:", profile);
        setCurrentPlan(null);
      } catch (error) {
        console.error("Error fetching subscription status:", error);
        toast({
          title: "Error",
          description: "Failed to fetch subscription status. Please try again.",
          variant: "destructive",
        });
        setCurrentPlan(null);
      } finally {
        setSubscriptionLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [profile?.email, profileStatus, toast]);

  // Show loading state if profile is still loading
  if (
    profileStatus === "loading" ||
    paddleLoading ||
    pricesLoading ||
    subscriptionLoading
  ) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Loading subscription system...
          </p>
        </div>
      </div>
    );
  }

  // Show error state if there are any errors
  if (profileStatus === "error" || paddleError || pricesError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">
            Failed to load subscription system
          </h2>
          <p className="text-muted-foreground">
            {paddleError ||
              pricesError ||
              "Please refresh the page to try again."}
          </p>
        </div>
      </div>
    );
  }

  // Use plans with direct price IDs
  const plansWithPrices = plans.map((plan) => {
    // Find the corresponding Paddle price for display purposes
    const paddlePrice = availablePrices.find(
      (price) => price.id === plan.priceId
    );
    return {
      ...plan,
      paddlePrice,
    };
  });

  const handleSubscribe = async (plan: (typeof plansWithPrices)[0]) => {
    if (!plan.priceId || !paddle) {
      return;
    }

    if (!profile?.email) {
      toast({
        title: "Error",
        description: "Please log in to subscribe",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Opening checkout with price ID:", plan.priceId);
      console.log("Customer email:", profile.email);
      console.log("Available prices:", availablePrices);

      // Validate that the price ID exists
      const priceExists = availablePrices.find((p) => p.id === plan.priceId);
      if (!priceExists) {
        console.error("Price ID not found in available prices:", plan.priceId);
        toast({
          title: "Error",
          description:
            "This subscription plan is not available. Please try again later.",
          variant: "destructive",
        });
        return;
      }

      await paddle.Checkout.open({
        items: [
          {
            priceId: plan.priceId,
            quantity: 1,
          },
        ],
        customer: {
          email: profile.email,
        },
        settings: {
          displayMode: "overlay",
          theme: "light",
          successUrl: `${window.location.origin}/app/subscription?success=true`,
        },
      });
    } catch (error) {
      const paddleError = error as Error & {
        code?: string;
        details?: unknown;
        response?: unknown;
      };
      console.error("Failed to open checkout:", paddleError);
      console.error("Error details:", {
        message: paddleError.message,
        code: paddleError.code,
        details: paddleError.details,
        response: paddleError.response,
      });

      const errorMessage =
        paddleError.message || "Failed to open checkout. Please try again.";
      toast({
        title: "Checkout Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleBuyCredits = async () => {
    if (!selectedPackage || !paddle) {
      return;
    }

    if (!profile?.email) {
      toast({
        title: "Error",
        description: "Please log in to purchase credits",
        variant: "destructive",
      });
      return;
    }

    try {
      await paddle.Checkout.open({
        items: [
          {
            priceId: selectedPackage.id.toString(), // You'll need to create actual price IDs in Paddle for credit packages
            quantity: 1,
          },
        ],
        customer: {
          email: profile.email,
        },
        settings: {
          displayMode: "inline",
          theme: "light",
          locale: "en",
          frameTarget: "paddle-checkout-container",
          frameStyle:
            "width: 100%; min-width: 312px; background-color: transparent; border: none;",
          frameInitialHeight: 450,
          successUrl: `${window.location.origin}/dashboard?success=true`,
        },
      });
    } catch (error) {
      console.error("Failed to open checkout:", error);
      toast({
        title: "Error",
        description: "Failed to open checkout. Please try again.",
        variant: "destructive",
      });
    }
    setShowBuyCreditsDialog(false);
  };

  const handleCancel = async () => {
    // Here you would implement the actual cancellation logic
    // This might involve calling your backend API which would then
    // use Paddle's API to cancel the subscription
    setShowCancelDialog(false);
  };

  return (
    <div className="bg-background pt-16">
      <Navigation />
      <div className="min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-primary mb-8">
            Subscription Plans
          </h1>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {plansWithPrices.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-lg p-6 ${
                  currentPlan === plan.id
                    ? "bg-primary/10 border-2 border-primary"
                    : "bg-card border border-border"
                }`}
              >
                {currentPlan === plan.id && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                    Current Plan
                  </div>
                )}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                      {plan.icon} {plan.name}
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      {plan.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      ${formatPrice(plan.paddlePrice?.unitPrice.amount)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      per month
                    </div>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={currentPlan === plan.id ? "outline" : "default"}
                  onClick={() => handleSubscribe(plan)}
                  disabled={!plan.priceId || currentPlan === plan.id}
                >
                  {currentPlan === plan.id
                    ? "Current Plan"
                    : currentPlan
                    ? "Switch Plan"
                    : "Subscribe"}
                </Button>
              </div>
            ))}
          </div>

          {/* Credits Section */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                  <Zap className="h-6 w-6" /> Credits
                </h2>
                <p className="text-muted-foreground mt-1">
                  Purchase additional credits for your account
                </p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-primary">
                  {creditsUsed} / {creditsLimit}
                </div>
                <div className="text-sm text-muted-foreground">
                  Credits Used
                </div>
              </div>
            </div>
            <Button onClick={() => setShowBuyCreditsDialog(true)}>
              Buy Credits
            </Button>
          </div>

          {/* Cancel Dialog */}
          <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cancel Subscription</DialogTitle>
                <DialogDescription>
                  Are you sure you want to cancel your subscription? You'll lose
                  access to all premium features at the end of your current
                  billing period.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowCancelDialog(false)}
                >
                  Keep Subscription
                </Button>
                <Button variant="destructive" onClick={handleCancel}>
                  Cancel Subscription
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Buy Credits Dialog */}
          <Dialog
            open={showBuyCreditsDialog}
            onOpenChange={setShowBuyCreditsDialog}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Buy Credits</DialogTitle>
                <DialogDescription>
                  Select a credit package to purchase
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                {creditPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedPackage?.id === pkg.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary"
                    }`}
                    onClick={() => setSelectedPackage(pkg)}
                  >
                    <div className="font-bold text-lg">{pkg.name}</div>
                    <div className="text-2xl font-bold text-primary mt-2">
                      ${formatPrice(pkg.price, true)}
                    </div>
                    <div className="text-muted-foreground text-sm mt-1">
                      {pkg.credits} credits
                    </div>
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowBuyCreditsDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleBuyCredits} disabled={!selectedPackage}>
                  Buy Now
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
