import React, { useState, useEffect } from "react";
import { Navigation } from "../components/Navigation";
import { Button } from "../components/ui/button";
import { Check, AlertCircle, Clock, FileText, Download, Users, Zap, Crown, Plus } from "lucide-react";
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
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { 
  selectSubscriptions, 
  selectActiveSubscriptions, 
  selectCurrentPlan, 
  selectSubscriptionStatus, 
  selectCanSubscribeToNewPlan,
  fetchSubscriptions
} from "../store/slices/subscriptionSlice";
import { supabase } from "../lib/supabase";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";

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

interface Plan {
  id: string;
  name: string;
  price: number;
  icon: JSX.Element;
  color: string;
  description: string;
  features: string[];
  credits: number;
  priceId: string;
  isPopular?: boolean;
  comingSoon?: boolean;
}

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 9,
    credits: 5, // 1 book
    icon: <FileText className="w-6 h-6" />,
    color: "bg-state-success",
    description: "Perfect for hobbyists and first-time authors",
    features: [
      "5 credits/month (1 book)",
      "Basic genre selection",
      "AI-generated outline + simple chapter flow",
      "Plot and character consistency checker",
      "Export to ePub",
      "Community support",
    ],
    priceId: "pri_01jxbekwgfx9k8tm8cbejzrns6",
  },
  {
    id: "pro",
    name: "Pro Author",
    price: 29,
    credits: 25, // 5 books
    icon: <Crown className="w-6 h-6" />,
    color: "bg-state-info",
    description: "For aspiring writers ready to go deeper",
    features: [
      "25 credits/month (5 books)",
      "All Starter features",
      "Unlock more genres",
      "Advanced book properties: narrator, tone, style",
      "Export to PDF, ePub, and Docx formats",
      "Priority email support",
    ],
    priceId: "pri_01jxben1kf0pfntb8162sfxhba",
    isPopular: true,
  },
  {
    id: "studio",
    name: "Studio",
    price: 79,
    credits: 75, // 15 books
    icon: <Users className="w-6 h-6" />,
    color: "bg-state-warning",
    description: "For professionals and small studios",
    features: [
      "75 credits/month (15 books)",
      "All Pro features",
      "AI-generated illustrations (50 credits/month)",
      "Cover generation",
      "Metadata & ISBN generation",
      "Team access (up to 3 users)",
      "Priority live chat support",
    ],
    priceId: "pri_01jxben1kf0pfntb8162sfxhba", // Using same as pro for now
    comingSoon: true,
  }
];

const mockBillingHistory = [
  {
    id: '1',
    date: '2025-03-15',
    amount: 29,
    status: 'paid',
    description: 'Pro Author Plan - Monthly'
  },
  {
    id: '2',
    date: '2025-02-15',
    amount: 29,
    status: 'paid',
    description: 'Pro Author Plan - Monthly'
  },
  {
    id: '3',
    date: '2025-01-15',
    amount: 9,
    status: 'paid',
    description: 'Starter Plan - Monthly'
  }
];

const creditPackages = [
  { id: 'small', credits: 10, price: 20 },
  { id: 'medium', credits: 25, price: 45, savings: 10 },
  { id: 'large', credits: 50, price: 80, savings: 20 },
];

export function Subscription() {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, status: profileStatus } = useSelector(
    (state: RootState) => state.profile
  );
  const { toast } = useToast();
  const [creditsUsed] = useState(15);
  const [creditsLimit] = useState(25);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showBuyCreditsDialog, setShowBuyCreditsDialog] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<typeof creditPackages[0] | null>(null);

  const { paddle, loading: paddleLoading, error: paddleError } = usePaddle();
  const {
    loading: pricesLoading,
    error: pricesError,
    availablePrices,
  } = usePaddlePrices(paddle);

  // Use Redux selectors instead of useSubscriptions hook
  const subscriptions = useSelector(selectSubscriptions);
  const activeSubscriptions = useSelector(selectActiveSubscriptions);
  const currentPlan = useSelector(selectCurrentPlan);
  const subscriptionStatus = useSelector(selectSubscriptionStatus);
  const canSubscribeToNewPlan = useSelector(selectCanSubscribeToNewPlan);
  const { status: subscriptionsLoading, error: subscriptionsError } = useSelector(
    (state: RootState) => state.subscription
  );

  // Helper function to check if user has active plan
  const hasActivePlanForPrice = (priceId: string) => {
    return activeSubscriptions.some((sub) => sub.price_id === priceId);
  };

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
      dispatch(fetchSubscriptions());
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
  }, [toast, dispatch]);

  // Show loading state if profile is still loading
  if (
    profileStatus === "loading" ||
    paddleLoading ||
    pricesLoading ||
    subscriptionsLoading === 'loading'
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
  if (
    profileStatus === "error" ||
    paddleError ||
    pricesError ||
    subscriptionsError
  ) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
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
    if (hasActivePlanForPrice(plan.priceId)) {
      toast({
        title: "Already Subscribed",
        description: "You already have an active subscription to this plan.",
        variant: "destructive",
      });
      return;
    }

    // Check if user has any active subscription and wants to subscribe to a different plan
    if (!canSubscribeToNewPlan && !hasActivePlanForPrice(plan.priceId)) {
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

  const handleUpgrade = (plan: Plan) => {
    if (plan.comingSoon) {
      return;
    }
    setSelectedPlan(plan);
    setShowUpgradeDialog(true);
  };

  const confirmUpgrade = async () => {
    if (!selectedPlan) return;
    
    // Use the existing handleSubscribe logic
    const planWithPrices = plansWithPrices.find(p => p.id === selectedPlan.id);
    if (planWithPrices) {
      await handleSubscribe(planWithPrices);
    }
    setShowUpgradeDialog(false);
  };

  const handleCancel = async () => {
    // TODO: Implement cancellation logic
    toast({
      title: "Cancellation",
      description: "Subscription cancellation feature coming soon.",
    });
    setShowCancelDialog(false);
  };

  const handleBuyCredits = (pkg: typeof creditPackages[0]) => {
    setSelectedPackage(pkg);
    setShowBuyCreditsDialog(true);
  };

  const confirmBuyCredits = async () => {
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

  // Get current plan details
  const currentPlanDetails = plans.find(p => p.id === currentPlan);
  const currentSubscription = subscriptions.find(s => 
    s.status === "active" || s.status === "trialing"
  );

  return (
    <>
      <Helmet>
        <title>ProsePilot - Subscription</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Current Plan Status */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-base-heading">Current Subscription</h2>
              {currentPlan && (
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-base-paragraph" />
                <span className="text-base-heading">
                  Next billing date: {currentSubscription?.current_period_end 
                    ? new Date(currentSubscription.current_period_end).toLocaleDateString()
                    : "Loading..."}
                </span>
              </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="text-base-heading">Current Plan</div>
                <div className="text-lg font-bold text-base-paragraph">
                  {currentPlanDetails?.name || "No Active Plan"}
                </div>
                <div className="text-base-heading">
                  {currentPlanDetails ? `$${currentPlanDetails.price}/month` : "Free"}
                </div>
              </div>

              {currentPlan && (
                <>
                  <div className="space-y-2">
                    <div className="text-base-heading">Monthly Credits Used</div>
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block text-base-heading">
                            {creditsLimit > 0 ? Math.round((creditsUsed / creditsLimit) * 100) : 0}%
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-base-heading">
                            {creditsUsed}/{creditsLimit > 0 ? creditsLimit : "∞"} credits
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-brand-secondary">
                        <div
                          style={{ width: `${creditsLimit > 0 ? (creditsUsed / creditsLimit) * 100 : 0}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-brand-primary"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-4">
                      <Button
                        variant="destructive"
                        onClick={() => setShowCancelDialog(true)}
                      >
                        Cancel Subscription
                      </Button>
                  </div>
                </>
              )}
            </div>

            {/* Credits Section */}
            {currentPlan && (
            <div className="mt-8 pt-8 border-t">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-base-heading">Buy More Credits</h3>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {creditPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="bg-base-background rounded-lg p-4 border hover:border-primary transition-colors"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-lg font-semibold text-base-heading">
                        {pkg.credits} Credits
                      </div>
                      {!!pkg.savings && (
                        <div className="text-sm bg-state-success-light text-state-success px-2 py-1 rounded">
                          Save {pkg.savings}%
                        </div>
                      )}
                    </div>
                    <div className="text-2xl font-bold text-brand-accent mb-4">${pkg.price}</div>
                    <Button
                      onClick={() => handleBuyCredits(pkg)}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Buy Credits
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            )}
          </div>

          {/* Pricing Plans */}
          <div className="space-y-12 mt-20">
            <h2 className="text-3xl font-bold text-base-heading text-center">Available Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {plansWithPrices.map((plan) => {
                const isCurrentPlan = currentPlan === plan.id;
                const canSubscribeToThisPlan =
                  canSubscribeToNewPlan || isCurrentPlan;
                const hasActiveButDifferentPlan =
                  subscriptionStatus.isActive && !isCurrentPlan;

                return (
                  <div
                    key={plan.id}
                    className={`relative bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105 flex flex-col h-full ${
                      plan.isPopular ? 'ring-2 ring-brand-accent scale-105' : ''
                    } ${plan.comingSoon ? 'opacity-75' : ''}`}
                  >
                    {plan.isPopular && (
                      <div className="absolute top-0 right-0 bg-brand-accent text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                        Most Popular
                      </div>
                    )}
                    {plan.comingSoon && (
                      <div className="absolute top-0 right-0 bg-state-info text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                        Coming Soon
                      </div>
                    )}
                    <div className="p-8 flex flex-col h-full">
                      <div className="flex-1">
                        {/* Plan Header */}
                        <div className="text-center mb-8">
                          <div className={`${plan.color} w-16 h-16 rounded-full flex items-center justify-center text-white mx-auto mb-4`}>
                            {plan.icon}
                          </div>
                          <h3 className="text-2xl font-bold text-base-heading">{plan.name}</h3>
                          <p className="text-base-paragraph mt-2">{plan.description}</p>
                        </div>

                        {/* Pricing */}
                        <div className="text-center mb-8">
                          <div className="flex items-baseline justify-center">
                            <span className="text-5xl font-extrabold text-base-heading">
                              ${formatPrice(plan.paddlePrice?.unitPrice.amount)}
                            </span>
                            <span className="text-xl text-gray-500 ml-1">/month</span>
                          </div>
                          <div className="mt-2 text-sm text-gray-500">
                            {plan.credits === -1 ? 'Unlimited credits' : `${plan.credits} credits included`}
                          </div>
                        </div>

                        {/* Features */}
                        <ul className="space-y-4 mb-8">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <Check className="h-5 w-5 text-state-success shrink-0 mt-0.5" />
                              <span className="ml-3 text-gray-700 text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* CTA Button */}
                      <Button
                        className={`w-full ${plan.isPopular && 'bg-brand-accent border-brand-accent text-white hover:bg-brand-accent/90 hover:border-brand-accent/90 hover:text-white'}`}
                        variant={isCurrentPlan ? 'secondary' : plan.isPopular ? 'default' : 'outline'}
                        onClick={() => handleUpgrade(plan)}
                        disabled={
                          isCurrentPlan || 
                          plan.comingSoon ||
                          (!canSubscribeToThisPlan && hasActiveButDifferentPlan)
                        }
                      >
                        {isCurrentPlan ? 'Current Plan' : 
                         plan.comingSoon ? 'Coming Soon' : 
                         plans.findIndex(p => p.id === plan.id) < plans.findIndex(p => p.id === currentPlan) ? 'Downgrade' : 'Upgrade'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Additional Info */}
            <div className="mt-40 text-center">
              <p className="text-base-paragraph mb-4">
                All plans include our core AI writing features and export capabilities
              </p>
              <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
                <p className="text-base-paragraph"><span className="text-brand-accent">✓</span> AI story generation</p>
                <p className="text-base-paragraph"><span className="text-brand-accent">✓</span> Character development</p>
                <p className="text-base-paragraph"><span className="text-brand-accent">✓</span> Plot consistency checking</p>
                {/* <p className="text-base-paragraph"><span className="text-brand-accent">✓</span> Multiple export formats</p> */}
              </div>
            </div>
          </div>

          {/* Billing History */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-base-heading mb-6">Billing History</h2>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-base-paragraph uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-base-paragraph uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-base-paragraph uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-base-paragraph uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-base-paragraph uppercase tracking-wider">
                      Invoice
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockBillingHistory.map((bill) => (
                    <tr key={bill.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(bill.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-base-heading">
                        {bill.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${bill.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {bill.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="ghost" className="text-base-heading hover:text-base-heading/80">
                          <Download className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Subscription Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your current billing period.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4">
            <div className="flex">
              <div className="shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Before you cancel
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Your subscription will remain active until {currentSubscription?.current_period_end 
                      ? new Date(currentSubscription.current_period_end).toLocaleDateString()
                      : "the end of your billing period"}</li>
                    <li>You'll lose access to premium features after that date</li>
                    <li>Existing content will remain accessible but locked for editing</li>
                    <li>Unused credits will be lost</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
            >
              Keep Subscription
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
            >
              Cancel Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upgrade/Downgrade Plan Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {plans.findIndex(p => p.id === selectedPlan?.id) < plans.findIndex(p => p.id === currentPlan) 
                ? `Downgrade to ${selectedPlan?.name}`
                : `Upgrade to ${selectedPlan?.name}`}
            </DialogTitle>
            <DialogDescription>
              You're about to {plans.findIndex(p => p.id === selectedPlan?.id) < plans.findIndex(p => p.id === currentPlan) ? 'downgrade' : 'upgrade'} to 
              the {selectedPlan?.name} plan. Changes will take effect at the start of your next billing period.
              {plans.findIndex(p => p.id === selectedPlan?.id) < plans.findIndex(p => p.id === currentPlan) && 
                " You'll continue to have access to your current plan's features until then."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">New Plan Cost</div>
                  <div className="text-sm text-base-paragraph">Starting next billing period</div>
                </div>
                <div className="text-lg font-bold">${selectedPlan?.price}/mo</div>
              </div>
            </div>
            {plans.findIndex(p => p.id === selectedPlan?.id) < plans.findIndex(p => p.id === currentPlan) ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <div className="shrink-0">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Features You'll Lose
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <ul className="list-disc pl-5 space-y-1">
                        {plans.find(p => p.id === currentPlan)?.features
                          .filter(f => !selectedPlan?.features.includes(f))
                          .map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex">
                  <div className="shrink-0">
                    <Zap className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      New Features You'll Get
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <ul className="list-disc pl-5 space-y-1">
                        {selectedPlan?.features
                          .filter(f => !plans.find(p => p.id === currentPlan)?.features.includes(f))
                          .map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUpgradeDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmUpgrade}>
              Confirm {plans.findIndex(p => p.id === selectedPlan?.id) < plans.findIndex(p => p.id === currentPlan) ? 'Downgrade' : 'Upgrade'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Buy Credits Dialog */}
      <Dialog open={showBuyCreditsDialog} onOpenChange={setShowBuyCreditsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buy Additional Credits</DialogTitle>
            <DialogDescription>
              You're about to purchase {selectedPackage?.credits} credits for ${selectedPackage?.price}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{selectedPackage?.credits} Credits</div>
                  <div className="text-sm text-base-paragraph">
                    Can be used for {Math.floor((selectedPackage?.credits || 0) / 5)} books
                  </div>
                </div>
                <div className="text-lg font-bold">${selectedPackage?.price}</div>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="shrink-0">
                  <AlertCircle className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    About Credits
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Credits never expire</li>
                      <li>Each book costs 5 credits to create</li>
                      <li>Credits are non-refundable</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBuyCreditsDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmBuyCredits}
            >
              Buy Credits
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <Footer />
    </>
  );
}
