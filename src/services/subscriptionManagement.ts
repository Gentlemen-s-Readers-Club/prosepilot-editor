import { supabase } from "../lib/supabase";
import { getPaddleConfig } from "../lib/paddle-config";

export interface SubscriptionManagementResponse {
  success: boolean;
  action: string;
  subscriptionId: string;
  data?: Record<string, unknown>;
  error?: string;
  details?: string;
}

export interface HandleSubscriptionParams {
  action: "cancel" | "change_plan";
  subscriptionId: string;
  newPlanId?: string;
  effectiveFrom?: "immediately" | "next_billing_period";
}

/**
 * Handle subscription cancellation and upgrading via Supabase edge function
 */
export async function handleSubscription({
  action,
  subscriptionId,
  newPlanId,
  effectiveFrom,
}: HandleSubscriptionParams): Promise<SubscriptionManagementResponse> {
  try {
    // Get the Supabase URL and anon key for the edge function call
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const environment = import.meta.env.VITE_PADDLE_ENV || "sandbox";

    if (!supabaseUrl) {
      throw new Error("Supabase URL not configured");
    }

    // Get the current session for authentication
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(
      `${supabaseUrl}/functions/v1/handle-paddle-subscription`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          action,
          subscriptionId,
          newPlanId,
          effectiveFrom,
          environment,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error handling subscription:", error);
    return {
      success: false,
      action,
      subscriptionId,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(
  subscriptionId: string,
  effectiveFrom?: "immediately" | "next_billing_period"
): Promise<SubscriptionManagementResponse> {
  return handleSubscription({
    action: "cancel",
    subscriptionId,
    effectiveFrom,
  });
}

/**
 * Change a subscription to a new plan
 */
export async function changeSubscription(
  subscriptionId: string,
  newPlanId: string
): Promise<SubscriptionManagementResponse> {
  return handleSubscription({
    action: "change_plan",
    subscriptionId,
    newPlanId,
  });
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use changeSubscription instead
 */
export async function upgradeSubscription(
  subscriptionId: string,
  newPlanId: string
): Promise<SubscriptionManagementResponse> {
  return changeSubscription(subscriptionId, newPlanId);
}

/**
 * Get available plan change options for a current plan (both upgrades and downgrades)
 */
export function getAvailablePlanChanges(currentPriceId: string) {
  const config = getPaddleConfig();

  // Define plan hierarchy
  const planHierarchy = {
    [config.subscriptionPrices.starter]: {
      name: "Starter",
      level: 1,
      id: "starter",
    },
    [config.subscriptionPrices.pro]: {
      name: "Pro",
      level: 2,
      id: "pro",
    },
    [config.subscriptionPrices.studio]: {
      name: "Studio",
      level: 3,
      id: "studio",
    },
  };

  const currentPlan =
    planHierarchy[currentPriceId as keyof typeof planHierarchy];

  if (!currentPlan) {
    return [];
  }

  // Return all plans except the current one
  return Object.entries(planHierarchy)
    .filter(([priceId]) => priceId !== currentPriceId)
    .map(([priceId, plan]) => ({
      priceId,
      ...plan,
      changeType:
        plan.level > currentPlan.level
          ? ("upgrade" as const)
          : ("downgrade" as const),
    }));
}

/**
 * Legacy function for backward compatibility - now just calls getAvailablePlanChanges
 * @deprecated Use getAvailablePlanChanges instead
 */
export function getUpgradeOptions(currentPriceId: string) {
  return getAvailablePlanChanges(currentPriceId).filter(
    (option) => option.changeType === "upgrade"
  );
}

/**
 * Check if a plan change is an upgrade or downgrade
 */
export function getPlanChangeType(
  currentPriceId: string,
  newPriceId: string
): "upgrade" | "downgrade" | "same" {
  const planHierarchy = {
    pri_01jxbekwgfx9k8tm8cbejzrns6: { level: 1 }, // Starter
    pri_01jxben1kf0pfntb8162sfxhba: { level: 2 }, // Pro
  };

  const currentLevel =
    planHierarchy[currentPriceId as keyof typeof planHierarchy]?.level || 0;
  const newLevel =
    planHierarchy[newPriceId as keyof typeof planHierarchy]?.level || 0;

  if (newLevel > currentLevel) return "upgrade";
  if (newLevel < currentLevel) return "downgrade";
  return "same";
}
