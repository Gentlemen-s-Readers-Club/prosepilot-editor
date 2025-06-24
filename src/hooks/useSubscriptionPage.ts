import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import {
  selectSubscriptions,
  selectActiveSubscriptions,
  selectCurrentPlan,
  selectSubscriptionStatus,
  selectCanSubscribeToNewPlan,
  fetchUserSubscription,
} from "../store/slices/subscriptionSlice";
import { usePaddle } from "../contexts/PaddleContext";
import { usePaddlePrices } from "./usePaddlePrices";
import { useSubscriptionManagement } from "./useSubscriptionManagement";
import { useToast } from "./use-toast";
import { Session } from "@supabase/supabase-js";

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

interface UseSubscriptionPageReturn {
  // Loading states
  isInitialLoading: boolean;
  isPlansLoading: boolean;

  // Data
  plans: Plan[];
  currentPlan: string | null;
  subscriptionStatus: any;
  activeSubscriptions: any[];
  billingHistory: any[];

  // Plan management
  handleSubscribe: (plan: any, session: Session | null) => Promise<void>;
  handleUpgrade: (plan: Plan) => void;
  confirmUpgrade: () => Promise<void>;
  hasActivePlanForPrice: (priceId: string) => boolean;

  // Subscription management
  handleCancel: () => Promise<void>;
  subscriptionManagementLoading: boolean;

  // Dialog states
  showCancelDialog: boolean;
  setShowCancelDialog: (show: boolean) => void;
  showUpgradeDialog: boolean;
  setShowUpgradeDialog: (show: boolean) => void;
  selectedPlan: Plan | null;
  setSelectedPlan: (plan: Plan | null) => void;

  // Errors
  error: string | null;
}

export function useSubscriptionPage(plans: Plan[]): UseSubscriptionPageReturn {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  
  // Redux state
  const { session } = useSelector((state: RootState) => (state.auth));
  const subscriptions = useSelector(selectSubscriptions);
  const activeSubscriptions = useSelector(selectActiveSubscriptions);
  const currentPlan = useSelector(selectCurrentPlan);
  const subscriptionStatus = useSelector(selectSubscriptionStatus);
  const canSubscribeToNewPlan = useSelector(selectCanSubscribeToNewPlan);
  const { status: subscriptionsLoading, error: subscriptionsError } =
    useSelector((state: RootState) => state.subscription);
  const { profile, status: profileStatus } = useSelector(
    (state: RootState) => state.profile
  );

  // External hooks
  const { paddle, loading: paddleLoading, error: paddleError } = usePaddle();
  const {
    loading: pricesLoading,
    error: pricesError,
    availablePrices,
  } = usePaddlePrices(paddle);
  const { loading: subscriptionManagementLoading, cancelSubscription } =
    useSubscriptionManagement();

  // Local state
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  // Mock billing history - in a real app, this would come from an API
  const billingHistory = [
    {
      id: "1",
      date: "2025-03-15",
      amount: 29,
      status: "paid",
      description: "Pro Author Plan - Monthly",
    },
    {
      id: "2",
      date: "2025-02-15",
      amount: 29,
      status: "paid",
      description: "Pro Author Plan - Monthly",
    },
    {
      id: "3",
      date: "2025-01-15",
      amount: 9,
      status: "paid",
      description: "Starter Plan - Monthly",
    },
  ];

  // Loading state calculation
  const isInitialLoading =
    profileStatus === "loading" ||
    paddleLoading ||
    subscriptionsLoading === "loading";
  const isPlansLoading = pricesLoading;

  // Error calculation
  const error = paddleError || pricesError || subscriptionsError;

  // Helper function to check if user has active plan
  const hasActivePlanForPrice = useCallback(
    (priceId: string) => {
      return activeSubscriptions.some((sub) => sub.price_id === priceId);
    },
    [activeSubscriptions]
  );

  // Handle URL parameters for checkout success/cancel
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get("success");
    const creditPurchaseSuccess = urlParams.get("credit_purchase_success");
    const cancelled = urlParams.get("cancelled");

    if (success === "true") {
      toast({
        title: "Success!",
        description: "Your subscription has been activated successfully.",
      });
      dispatch(fetchUserSubscription());
      window.history.replaceState({}, "", window.location.pathname);
    } else if (creditPurchaseSuccess === "true") {
      toast({
        title: "Credit Purchase Successful!",
        description:
          "Your credits have been added to your account and are ready to use.",
      });
      window.history.replaceState({}, "", window.location.pathname);
    } else if (cancelled === "true") {
      toast({
        title: "Cancelled",
        description: "Your checkout was cancelled.",
        variant: "destructive",
      });
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [toast, dispatch]);

  // Handle subscription
  const handleSubscribe = useCallback(
    async (plan: any, session: Session | null) => {
      if (!plan.priceId || !paddle) return;

      if (!profile?.email) {
        toast({
          title: "Error",
          description: "Please log in to subscribe",
          variant: "destructive",
        });
        return;
      }

      if (!session?.user.id) {
        toast({
          title: "Error",
          description: "Authentication required to subscribe",
          variant: "destructive",
        });
        return;
      }

      if (hasActivePlanForPrice(plan.priceId)) {
        toast({
          title: "Already Subscribed",
          description: "You already have an active subscription to this plan.",
          variant: "destructive",
        });
        return;
      }

      if (!canSubscribeToNewPlan && !hasActivePlanForPrice(plan.priceId)) {
        toast({
          title: "Multiple Subscriptions Not Allowed",
          description:
            "You can only have one active subscription. Please cancel your current subscription first or switch plans instead.",
          variant: "destructive",
        });
        return;
      }

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
          items: [{ priceId: plan.priceId, quantity: 1 }],
          customer: { email: profile.email },
          settings: {
            displayMode: "overlay",
            theme: "light",
            allowLogout: false,
            showAddDiscounts: false,
            showAddTaxId: false,
            successUrl: `${window.location.origin}/workspace/subscription?success=true`,
          },
          customData: {
            user_id: session?.user.id || '',
            type: "subscription",
          },
        });
      } catch (error) {
        const paddleError = error as Error & { message?: string };
        console.error("Failed to open checkout:", paddleError);
        toast({
          title: "Checkout Error",
          description:
            paddleError.message || "Failed to open checkout. Please try again.",
          variant: "destructive",
        });
      }
    },
    [
      paddle,
      profile,
      hasActivePlanForPrice,
      canSubscribeToNewPlan,
      subscriptionStatus,
      plans,
      availablePrices,
      toast,
    ]
  );

  // Handle upgrade
  const handleUpgrade = useCallback((plan: Plan) => {
    if (plan.comingSoon) return;
    setSelectedPlan(plan);
    setShowUpgradeDialog(true);
  }, []);

  // Confirm upgrade
  const confirmUpgrade = useCallback(async () => {
    if (!selectedPlan) return;

    const plansWithPrices = plans.map((plan) => {
      const paddlePrice = availablePrices.find(
        (price) => price.id === plan.priceId
      );
      return { ...plan, paddlePrice };
    });

    const planWithPrices = plansWithPrices.find(
      (p) => p.id === selectedPlan.id
    );
    if (planWithPrices) {
      await handleSubscribe(planWithPrices, session);
    }
    setShowUpgradeDialog(false);
  }, [selectedPlan, plans, availablePrices, handleSubscribe, session]);

  // Handle cancel
  const handleCancel = useCallback(async () => {
    const currentSubscription = subscriptions.find(
      (s) => s.status === "active" || s.status === "trialing"
    );

    if (!currentSubscription?.subscription_id) {
      toast({
        title: "Error",
        description: "No active subscription found to cancel.",
        variant: "destructive",
      });
      setShowCancelDialog(false);
      return;
    }

    try {
      const result = await cancelSubscription(
        currentSubscription.subscription_id,
        "User requested cancellation from app"
      );

      if (result.success) {
        dispatch(fetchUserSubscription());
      }
    } catch (error) {
      console.error("Error in handleCancel:", error);
    }

    setShowCancelDialog(false);
  }, [subscriptions, cancelSubscription, toast, dispatch]);

  return {
    // Loading states
    isInitialLoading,
    isPlansLoading,

    // Data
    plans: plans.map((plan) => {
      const paddlePrice = availablePrices.find(
        (price) => price.id === plan.priceId
      );
      return { ...plan, paddlePrice };
    }),
    currentPlan,
    subscriptionStatus,
    activeSubscriptions,
    billingHistory,

    // Plan management
    handleSubscribe,
    handleUpgrade,
    confirmUpgrade,
    hasActivePlanForPrice,

    // Subscription management
    handleCancel,
    subscriptionManagementLoading,

    // Dialog states
    showCancelDialog,
    setShowCancelDialog,
    showUpgradeDialog,
    setShowUpgradeDialog,
    selectedPlan,
    setSelectedPlan,

    // Errors
    error,
  };
}
