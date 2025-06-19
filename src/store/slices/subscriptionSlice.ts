import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabase";
import { ApiState } from "../types";
import { getPaddleConfig } from "../../lib/paddle-config";

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
  environment?: string;
}

export interface SubscriptionStatus {
  isActive: boolean;
  planId: string | null;
  planName: string | null;
  canUpgrade: boolean;
  canDowngrade: boolean;
  hasMultipleSubscriptions: boolean;
  pendingCancellation: boolean;
}

interface SubscriptionState extends ApiState {
  subscriptions: Subscription[];
  activeSubscriptions: Subscription[];
  currentPlan: string | null;
  subscriptionStatus: SubscriptionStatus;
  realtimeSubscription: any; // Supabase realtime subscription
}

// Define plan hierarchy for upgrade/downgrade logic
const planHierarchy = {
  [getPaddleConfig().subscriptionPrices.starter]: { name: "Starter", level: 1 },
  [getPaddleConfig().subscriptionPrices.pro]: { name: "Pro", level: 2 },
  [getPaddleConfig().subscriptionPrices.studio]: { name: "Studio", level: 3 },
};

const initialState: SubscriptionState = {
  subscriptions: [],
  activeSubscriptions: [],
  currentPlan: null,
  subscriptionStatus: {
    isActive: false,
    planId: null,
    planName: null,
    canUpgrade: false,
    canDowngrade: false,
    hasMultipleSubscriptions: false,
    pendingCancellation: false,
  },
  realtimeSubscription: null,
  status: "idle",
  error: null,
};

// Helper function to calculate subscription status
const calculateSubscriptionStatus = (
  subscriptions: Subscription[],
  currentPlan: string | null
) => {
  const activeSubscriptions = subscriptions.filter(
    (sub) => sub.status === "active" || sub.status === "trialing"
  );

  const currentPlanDetails = currentPlan
    ? planHierarchy[currentPlan as keyof typeof planHierarchy]
    : null;

  // Check if user has pending cancellation
  const pendingCancellation = activeSubscriptions.some(
    (sub) => sub.cancel_at_period_end
  );

  // Check if user can upgrade or downgrade
  const canUpgrade = currentPlanDetails
    ? Object.values(planHierarchy).some(
        (plan) => plan.level > currentPlanDetails.level
      )
    : true;

  const canDowngrade = currentPlanDetails
    ? Object.values(planHierarchy).some(
        (plan) => plan.level < currentPlanDetails.level
      )
    : false;

  return {
    isActive: activeSubscriptions.length > 0,
    planId: currentPlan,
    planName: currentPlanDetails?.name || null,
    canUpgrade,
    canDowngrade,
    hasMultipleSubscriptions: activeSubscriptions.length > 1,
    pendingCancellation,
  };
};

// Helper function to calculate current plan
const calculateCurrentPlan = (subscriptions: Subscription[]): string | null => {
  if (subscriptions.length === 0) return null;

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

  const config = getPaddleConfig();

  // Map price_id to plan
  if (activeSubscription.price_id === config.subscriptionPrices.starter) {
    return "starter";
  } else if (activeSubscription.price_id === config.subscriptionPrices.pro) {
    return "pro";
  } else if (activeSubscription.price_id === config.subscriptionPrices.studio) {
    return "studio";
  }

  return null;
};

export const fetchUserSubscription = createAsyncThunk(
  "subscription/fetchUserSubscription",
  async (environment: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      throw new Error("No authenticated user");
    }

    console.log("🌍 Fetching subscriptions for environment:", environment);

    const { data, error: fetchError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("environment", environment)
      .order("created_at", { ascending: false });

    if (fetchError) {
      throw fetchError;
    }

    // Handle potential missing columns by providing defaults
    const normalizedData = (data || []).map((sub) => ({
      id: sub.id,
      user_id: sub.user_id,
      customer_id: sub.customer_id || "",
      subscription_id: sub.subscription_id || sub.id,
      price_id: sub.price_id || "unknown",
      status: sub.status || "active",
      current_period_start: sub.current_period_start,
      current_period_end: sub.current_period_end,
      cancel_at_period_end: sub.cancel_at_period_end || false,
      canceled_at: sub.canceled_at,
      created_at: sub.created_at,
      updated_at: sub.updated_at || sub.created_at,
      environment: sub.environment || environment,
    }));

    return normalizedData;
  }
);

export const setupRealtimeSubscriptions = createAsyncThunk(
  "subscription/setupRealtimeSubscriptions",
  async (_, { dispatch }) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      throw new Error("No authenticated user");
    }

    // Get current environment
    const environment = import.meta.env.VITE_PADDLE_ENV || "sandbox";
    console.log(
      "🌍 Setting up realtime subscriptions for environment:",
      environment
    );

    const subscription = supabase
      .channel("subscriptions-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "subscriptions",
          filter: `user_id=eq.${session.user.id} and environment=eq.${environment}`,
        },
        () => {
          console.log("Real-time subscription change detected");
          dispatch(fetchUserSubscription(environment));
        }
      )
      .subscribe();

    return subscription;
  }
);

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    clearSubscriptions: (state) => {
      state.subscriptions = [];
      state.activeSubscriptions = [];
      state.currentPlan = null;
      state.subscriptionStatus = {
        isActive: false,
        planId: null,
        planName: null,
        canUpgrade: false,
        canDowngrade: false,
        hasMultipleSubscriptions: false,
        pendingCancellation: false,
      };
      state.error = null;
    },
    addSubscription: (state, action: PayloadAction<Subscription>) => {
      state.subscriptions.push(action.payload);
      if (
        action.payload.status === "active" ||
        action.payload.status === "trialing"
      ) {
        state.activeSubscriptions.push(action.payload);
      }

      // Recalculate derived state
      state.currentPlan = calculateCurrentPlan(state.subscriptions);
      state.subscriptionStatus = calculateSubscriptionStatus(
        state.subscriptions,
        state.currentPlan
      );
    },
    updateSubscription: (state, action: PayloadAction<Subscription>) => {
      const index = state.subscriptions.findIndex(
        (sub) => sub.id === action.payload.id
      );
      if (index !== -1) {
        state.subscriptions[index] = action.payload;
      }

      const activeIndex = state.activeSubscriptions.findIndex(
        (sub) => sub.id === action.payload.id
      );
      if (activeIndex !== -1) {
        state.activeSubscriptions[activeIndex] = action.payload;
      }

      // Recalculate derived state
      state.currentPlan = calculateCurrentPlan(state.subscriptions);
      state.subscriptionStatus = calculateSubscriptionStatus(
        state.subscriptions,
        state.currentPlan
      );
    },
    removeSubscription: (state, action: PayloadAction<string>) => {
      state.subscriptions = state.subscriptions.filter(
        (sub) => sub.id !== action.payload
      );
      state.activeSubscriptions = state.activeSubscriptions.filter(
        (sub) => sub.id !== action.payload
      );

      // Recalculate derived state
      state.currentPlan = calculateCurrentPlan(state.subscriptions);
      state.subscriptionStatus = calculateSubscriptionStatus(
        state.subscriptions,
        state.currentPlan
      );
    },
    clearRealtimeSubscription: (state) => {
      if (state.realtimeSubscription) {
        state.realtimeSubscription.unsubscribe();
        state.realtimeSubscription = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserSubscription.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserSubscription.fulfilled, (state, action) => {
        state.status = "success";
        state.subscriptions = action.payload;

        // Calculate active subscriptions
        state.activeSubscriptions = action.payload.filter(
          (sub) => sub.status === "active" || sub.status === "trialing"
        );

        // Calculate current plan
        state.currentPlan = calculateCurrentPlan(state.subscriptions);

        // Calculate subscription status
        state.subscriptionStatus = calculateSubscriptionStatus(
          state.subscriptions,
          state.currentPlan
        );
      })
      .addCase(fetchUserSubscription.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message || "Failed to fetch subscriptions";
      })
      .addCase(setupRealtimeSubscriptions.fulfilled, (state, action) => {
        state.realtimeSubscription = action.payload;
      });
  },
});

// Selectors
export const selectSubscriptions = (state: {
  subscription: SubscriptionState;
}) => state.subscription.subscriptions;
export const selectActiveSubscriptions = (state: {
  subscription: SubscriptionState;
}) => state.subscription.activeSubscriptions;
export const selectCurrentPlan = (state: { subscription: SubscriptionState }) =>
  state.subscription.currentPlan;
export const selectSubscriptionStatus = (state: {
  subscription: SubscriptionState;
}) => state.subscription.subscriptionStatus;
export const selectHasActiveSubscription = (state: {
  subscription: SubscriptionState;
}) => state.subscription.activeSubscriptions.length > 0;
export const selectCanSubscribeToNewPlan = (state: {
  subscription: SubscriptionState;
}) => state.subscription.activeSubscriptions.length === 0;

// Helper functions
export const hasActivePlan = (
  state: { subscription: SubscriptionState },
  priceId: string
): boolean => {
  return state.subscription.activeSubscriptions.some(
    (sub) => sub.price_id === priceId
  );
};

// Helper function to check if user has Studio plan
// Note: Currently Studio uses the same price ID as Pro, so this will need to be updated when Studio gets its own price ID
export const hasStudioPlan = (state: {
  subscription: SubscriptionState;
}): boolean => {
  // For now, return false since Studio is coming soon
  // When Studio is ready, this should check for the Studio price ID
  // Example: return state.subscription.activeSubscriptions.some((sub) => sub.price_id === "pri_studio_price_id");
  return false;
};

// Helper function to check if user has Pro or Studio plan (for features that require Pro+)
export const hasProOrStudioPlan = (state: {
  subscription: SubscriptionState;
}): boolean => {
  return state.subscription.activeSubscriptions.some(
    (sub) =>
      sub.price_id === "pri_01jxben1kf0pfntb8162sfxhba" || // Pro plan
      sub.price_id === "pri_01jxxb51m8t8edd9w3wvw96bt4" // Studio plan
  );
};

export const {
  clearSubscriptions,
  addSubscription,
  updateSubscription,
  removeSubscription,
  clearRealtimeSubscription,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
