import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export interface Subscription {
  id: string;
  user_id: string;
  customer_id?: string;
  subscription_id: string;
  price_id: string;
  status: "active" | "canceled" | "past_due" | "paused" | "trialing";
  current_period_start?: string;
  current_period_end?: string;
  cancel_at_period_end?: boolean;
  canceled_at?: string | null;
  created_at: string;
  updated_at?: string;
}

interface UseSubscriptionsReturn {
  subscriptions: Subscription[];
  activeSubscriptions: Subscription[];
  loading: boolean;
  error: string | null;
  hasActiveSubscription: boolean;
  hasActivePlan: (priceId: string) => boolean;
  canSubscribeToNewPlan: boolean;
  getCurrentPlan: () => string | null;
  getSubscriptionStatus: () => SubscriptionStatus;
  refetch: () => Promise<void>;
}

interface SubscriptionStatus {
  isActive: boolean;
  planId: string | null;
  planName: string | null;
  canUpgrade: boolean;
  canDowngrade: boolean;
  hasMultipleSubscriptions: boolean;
  pendingCancellation: boolean;
}

export function useSubscriptions(): UseSubscriptionsReturn {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Define plan hierarchy for upgrade/downgrade logic
  const planHierarchy = {
    pri_01jxbekwgfx9k8tm8cbejzrns6: { name: "Starter", level: 1 }, // Starter
    pri_01jxben1kf0pfntb8162sfxhba: { name: "Pro", level: 2 }, // Pro
  };

  // Get the authenticated user ID
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log("Authenticated user:", user);
      setUserId(user?.id || null);
    };

    getUser();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchSubscriptions = async () => {
    if (!userId) {
      console.log("No user ID available, skipping subscription fetch");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("Fetching subscriptions for user ID:", userId);

      // First, let's check what columns actually exist in the table
      const { data: testData } = await supabase
        .from("subscriptions")
        .select("*")
        .limit(1);

      console.log("Sample subscription data structure:", testData?.[0]);

      // Now fetch the user's subscriptions
      const { data, error: fetchError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      console.log("Subscriptions query result:", { data, error: fetchError });

      if (fetchError) {
        throw fetchError;
      }

      // Handle potential missing columns by providing defaults
      const normalizedData = (data || []).map((sub) => ({
        id: sub.id,
        user_id: sub.user_id,
        customer_id: sub.customer_id || "",
        subscription_id: sub.subscription_id || sub.id, // fallback to id if subscription_id missing
        price_id: sub.price_id || "unknown",
        status: sub.status || "active", // default to active if missing
        current_period_start: sub.current_period_start,
        current_period_end: sub.current_period_end,
        cancel_at_period_end: sub.cancel_at_period_end || false,
        canceled_at: sub.canceled_at,
        created_at: sub.created_at,
        updated_at: sub.updated_at || sub.created_at,
      }));

      setSubscriptions(normalizedData);
      console.log("Set normalized subscriptions:", normalizedData);
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch subscriptions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [userId]);

  // Subscribe to real-time updates for subscription changes
  useEffect(() => {
    if (!userId) return;

    const subscription = supabase
      .channel("subscriptions-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "subscriptions",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          console.log("Real-time subscription change detected");
          fetchSubscriptions();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  const activeSubscriptions = subscriptions.filter(
    (sub) => sub.status === "active" || sub.status === "trialing"
  );

  const hasActiveSubscription = activeSubscriptions.length > 0;

  const hasActivePlan = (priceId: string): boolean => {
    return activeSubscriptions.some((sub) => sub.price_id === priceId);
  };

  // Check if user can subscribe to a new plan (should only have one active subscription)
  const canSubscribeToNewPlan = !hasActiveSubscription;

  const getCurrentPlan = (): string | null => {
    if (!subscriptions || subscriptions.length === 0) return null;

    // Sort by created_at descending to get the most recent subscription first
    const sortedSubscriptions = [...subscriptions].sort(
      (a, b) =>
        new Date(b.created_at || "").getTime() -
        new Date(a.created_at || "").getTime()
    );

    // Find the most recent active subscription
    const activeSubscription = sortedSubscriptions.find(
      (sub) => sub.status === "active" || sub.status === "trialing"
    );

    if (!activeSubscription) return null;

    // Map price_id to plan
    if (activeSubscription.price_id === "pri_01jxbekwgfx9k8tm8cbejzrns6") {
      return "starter";
    } else if (
      activeSubscription.price_id === "pri_01jxben1kf0pfntb8162sfxhba"
    ) {
      return "pro";
    }

    return null;
  };

  const getSubscriptionStatus = (): SubscriptionStatus => {
    const currentPlanId = getCurrentPlan();
    const currentPlan = currentPlanId
      ? planHierarchy[currentPlanId as keyof typeof planHierarchy]
      : null;

    // Check if user has pending cancellation
    const pendingCancellation = activeSubscriptions.some(
      (sub) => sub.cancel_at_period_end
    );

    // Check if user can upgrade or downgrade
    const canUpgrade = currentPlan
      ? Object.values(planHierarchy).some(
          (plan) => plan.level > currentPlan.level
        )
      : true;

    const canDowngrade = currentPlan
      ? Object.values(planHierarchy).some(
          (plan) => plan.level < currentPlan.level
        )
      : false;

    const status = {
      isActive: hasActiveSubscription,
      planId: currentPlanId,
      planName: currentPlan?.name || null,
      canUpgrade,
      canDowngrade,
      hasMultipleSubscriptions: activeSubscriptions.length > 1,
      pendingCancellation,
    };

    console.log("getSubscriptionStatus returning:", status);
    console.log("activeSubscriptions:", activeSubscriptions);
    console.log("hasActiveSubscription:", hasActiveSubscription);
    console.log("canSubscribeToNewPlan:", !hasActiveSubscription);

    return status;
  };

  return {
    subscriptions,
    activeSubscriptions,
    loading,
    error,
    hasActiveSubscription,
    hasActivePlan,
    canSubscribeToNewPlan,
    getCurrentPlan,
    getSubscriptionStatus,
    refetch: fetchSubscriptions,
  };
}
