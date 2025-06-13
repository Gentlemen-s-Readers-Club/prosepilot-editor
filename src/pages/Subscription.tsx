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
import { useSubscriptions } from "../hooks/useSubscriptions";

import { supabase } from "../lib/supabase";

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
  const [creditsUsed] = useState(0);
  const [creditsLimit] = useState(0);
  const [showBuyCreditsDialog, setShowBuyCreditsDialog] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<
    (typeof creditPackages)[0] | null
  >(null);

  const { paddle, loading: paddleLoading, error: paddleError } = usePaddle();
  const {
    loading: pricesLoading,
    error: pricesError,
    availablePrices,
  } = usePaddlePrices(paddle);

  const {
    subscriptions,
    loading: subscriptionsLoading,
    error: subscriptionsError,
    hasActivePlan,
    canSubscribeToNewPlan,
    getCurrentPlan,
    getSubscriptionStatus,
    refetch: refetchSubscriptions,
  } = useSubscriptions();

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
      // Refresh subscription data
      refetchSubscriptions();
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

  // Get current plan and subscription status from the hook
  const currentPlan = getCurrentPlan();
  const subscriptionStatus = getSubscriptionStatus();

  // Show loading state if profile is still loading
  if (
    profileStatus === "loading" ||
    paddleLoading ||
    pricesLoading ||
    subscriptionsLoading
  ) {
    return (
      <div className="min-h-screen bg-base-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-base-border mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Loading subscription system...
          </p>
        </div>
      </div>
    );
  }

  // Show error state if there are any errors
  if (
    profileStatus === "error" ||
    paddleError ||
    pricesError ||
    subscriptionsError
  ) {
    return (
      <div className="min-h-screen bg-base-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-state-error mb-4">
            Failed to load subscription system
          </h2>
          <p className="text-muted-foreground">
            {paddleError ||
              pricesError ||
              subscriptionsError ||
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

    // Get the current authenticated user ID
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.id) {
      toast({
        title: "Error",
        description: "Authentication required to subscribe",
        variant: "destructive",
      });
      return;
    }

    // Enhanced subscription validation
    if (hasActivePlan(plan.priceId)) {
      toast({
        title: "Already Subscribed",
        description: "You already have an active subscription to this plan.",
        variant: "destructive",
      });
      return;
    }

    // Check if user has any active subscription and wants to subscribe to a different plan
    if (!canSubscribeToNewPlan && !hasActivePlan(plan.priceId)) {
      toast({
        title: "Multiple Subscriptions Not Allowed",
        description:
          "You can only have one active subscription. Please cancel your current subscription first or switch plans instead.",
        variant: "destructive",
      });
      return;
    }

    // Check for plan switching logic
    if (
      subscriptionStatus.isActive &&
      subscriptionStatus.planId !== plan.priceId
    ) {
      const currentPlanDetails = plans.find(
        (p) => p.priceId === subscriptionStatus.planId
      );
      toast({
        title: "Plan Switch Required",
        description: `You currently have the ${
          currentPlanDetails?.name || "current"
        } plan. To change plans, please cancel your current subscription first, then subscribe to the new plan.`,
        variant: "destructive",
      });
      return;
    }

    try {
      // Validate that the price ID exists
      const priceExists = availablePrices.find((p) => p.id === plan.priceId);
      if (!priceExists) {
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
          allowLogout: false,
          showAddDiscounts: false,
          showAddTaxId: false,
          successUrl: `${window.location.origin}/app/subscription?success=true`,
        },
        customData: {
          user_id: user.id, // Use the authenticated user ID instead of profile.id
        },
      });
    } catch (error) {
      const paddleError = error as Error & {
        code?: string;
        details?: unknown;
        response?: unknown;
      };
      console.error("Failed to open checkout:", paddleError);

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
        customData: {
          user_id: profile.id,
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

  // Update the plan card rendering to focus on upgrades
  const getButtonText = (
    plan: (typeof plans)[0],
    isCurrentPlan: boolean,
    hasActiveButDifferentPlan: boolean
  ) => {
    if (isCurrentPlan) {
      return "Current Plan";
    }
    if (hasActiveButDifferentPlan) {
      // currentPlan returns 'starter' or 'pro', so match against plan.id
      const currentPlanName =
        plans.find((p) => p.id === currentPlan)?.name || "Unknown";
      return `Upgrade from ${currentPlanName}`;
    }
    return "Subscribe";
  };

  const getButtonVariant = (
    isCurrentPlan: boolean,
    hasActiveButDifferentPlan: boolean
  ) => {
    if (isCurrentPlan) {
      return "outline" as const;
    }
    if (hasActiveButDifferentPlan) {
      return "default" as const; // Upgrade button
    }
    return "default" as const;
  };

  return (
    <div className="bg-base-background pt-16">
      <Navigation />
      <div className="min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-base-heading mb-8">
            Subscription Plans
          </h1>

          {/* Current Subscriptions Section - Simplified */}
          {subscriptions.length > 0 && (
            <div className="bg-brand-brand-accent border border-brand-accent rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-base-heading mb-4">
                My Subscriptions
              </h2>
              <div className="space-y-4">
                {subscriptions.map((subscription) => {
                  const plan = plans.find(
                    (p) => p.priceId === subscription.price_id
                  );
                  const isActive =
                    subscription.status === "active" ||
                    subscription.status === "trialing";

                  return (
                    <div
                      key={subscription.id}
                      className={`p-4 border rounded-lg ${
                        isActive
                          ? "border-green-300 bg-green-50"
                          : subscription.status === "canceled"
                          ? "border-gray-300 bg-gray-50"
                          : "border-gray-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">
                              {plan?.name || "Unknown Plan"}
                            </h3>
                            <div
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                subscription.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : subscription.status === "canceled"
                                  ? "bg-gray-100 text-gray-800"
                                  : subscription.status === "trialing"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {subscription.status.charAt(0).toUpperCase() +
                                subscription.status.slice(1)}
                            </div>
                          </div>

                          <div className="space-y-1 text-sm text-muted-foreground">
                            {subscription.current_period_start && (
                              <p>
                                <strong>Started:</strong>{" "}
                                {new Date(
                                  subscription.current_period_start
                                ).toLocaleDateString()}
                              </p>
                            )}
                            {subscription.current_period_end && (
                              <p>
                                <strong>
                                  {subscription.status === "active"
                                    ? "Renews"
                                    : "Ended"}
                                  :
                                </strong>{" "}
                                {new Date(
                                  subscription.current_period_end
                                ).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                          {isActive && (
                            <div className="text-sm text-green-600 font-medium">
                              ✓ Active
                            </div>
                          )}
                          {subscription.status === "canceled" && (
                            <div className="text-xs text-gray-600 text-center">
                              To resubscribe, choose a plan below
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Subscription health warning */}
              {subscriptionStatus.hasMultipleSubscriptions && (
                <div className="mt-4 p-3 bg-orange-100 border border-orange-300 rounded-lg">
                  <p className="text-orange-800 text-sm">
                    <strong>⚠️ Notice:</strong> You have multiple subscriptions.
                    Our system will automatically manage this to ensure you're
                    only billed for one active plan.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {plansWithPrices.map((plan) => {
              const isCurrentPlan = currentPlan === plan.id;
              const canSubscribeToThisPlan =
                canSubscribeToNewPlan || isCurrentPlan;
              const hasActiveButDifferentPlan =
                subscriptionStatus.isActive && !isCurrentPlan;

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-lg p-6 ${
                    isCurrentPlan
                      ? "bg-brand-primary/10 border-2 border-brand-primary"
                      : "bg-brand-brand-accent border border-brand-accent"
                  }`}
                >
                  {isCurrentPlan && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-brand-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                      Current Plan
                    </div>
                  )}

                  {subscriptionStatus.hasMultipleSubscriptions && (
                    <div className="absolute -top-3 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Multiple Subscriptions Detected
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-base-heading flex items-center gap-2">
                        {plan.icon} {plan.name}
                      </h3>
                      <p className="text-muted-foreground mt-1">
                        {plan.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-base-heading">
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
                        <Check className="h-5 w-5 text-brand-primary flex-shrink-0" />
                        <span className="text-secondary">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      variant={getButtonVariant(
                        isCurrentPlan,
                        hasActiveButDifferentPlan
                      )}
                      onClick={() => handleSubscribe(plan)}
                      disabled={
                        !plan.priceId ||
                        isCurrentPlan ||
                        (!canSubscribeToThisPlan && hasActiveButDifferentPlan)
                      }
                      title={getButtonText(
                        plan,
                        isCurrentPlan,
                        hasActiveButDifferentPlan
                      )}
                    >
                      {getButtonText(
                        plan,
                        isCurrentPlan,
                        hasActiveButDifferentPlan
                      )}
                    </Button>

                    {hasActiveButDifferentPlan && (
                      <div className="text-xs text-muted-foreground text-center mt-2">
                        You can only have one active subscription at a time.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Subscription Status Alert */}
          {subscriptionStatus.hasMultipleSubscriptions && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <h3 className="font-semibold text-orange-800">
                  Multiple Subscriptions Detected
                </h3>
              </div>
              <p className="text-orange-700 mt-2">
                You have multiple active subscriptions. This may cause billing
                issues. Please contact support to resolve this issue.
              </p>
            </div>
          )}

          {/* Credits Section */}
          <div className="bg-brand-brand-accent border border-brand-accent rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-base-heading flex items-center gap-2">
                  <Zap className="h-6 w-6" /> Credits
                </h2>
                <p className="text-muted-foreground mt-1">
                  Purchase additional credits for your account
                </p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-base-heading">
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
                        ? "border-base-border bg-brand-primary/10"
                        : "border-brand-accent hover:border-base-border"
                    }`}
                    onClick={() => setSelectedPackage(pkg)}
                  >
                    <div className="font-bold text-lg">{pkg.name}</div>
                    <div className="text-2xl font-bold text-base-heading mt-2">
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
