import { supabase } from "../lib/supabase";

/**
 * Get subscription usage statistics
 */
export async function getSubscriptionUsage(subscriptionId: string) {
  try {
    // This would typically call your backend API to get usage stats
    console.log("Fetching usage for subscription:", subscriptionId);

    // For now, return mock data
    return {
      creditsUsed: 0,
      creditsLimit: 0,
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
    };
  } catch (error) {
    console.error("Error fetching subscription usage:", error);
    throw error;
  }
}

/**
 * Check if user has multiple active subscriptions and get cleanup actions
 */
export async function checkSubscriptionHealth() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data: subscriptions, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      throw error;
    }

    const activeSubscriptions =
      subscriptions?.filter(
        (sub) => sub.status === "active" || sub.status === "trialing"
      ) || [];

    return {
      totalSubscriptions: subscriptions?.length || 0,
      activeSubscriptions: activeSubscriptions.length,
      hasMultipleActive: activeSubscriptions.length > 1,
      subscriptions: subscriptions || [],
      activeOnes: activeSubscriptions,
      needsCleanup: activeSubscriptions.length > 1,
    };
  } catch (error) {
    console.error("Error checking subscription health:", error);
    throw error;
  }
}

/**
 * Get user's current active subscription
 */
export async function getCurrentSubscription() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return null;
    }

    // Get current environment
    const environment = import.meta.env.VITE_PADDLE_ENV || "sandbox";
    console.log(
      "🌍 Getting current subscription for environment:",
      environment
    );

    const { data: subscriptions, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("environment", environment)
      .in("status", ["active", "trialing"])
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      throw error;
    }

    return subscriptions?.[0] || null;
  } catch (error) {
    console.error("Error getting current subscription:", error);
    return null;
  }
}

/**
 * Get available plan upgrades for the user
 */
export async function getAvailableUpgrades(currentPriceId: string) {
  // Define plan hierarchy (you can move this to a config file)
  const planHierarchy = {
    pri_01jxbekwgfx9k8tm8cbejzrns6: { name: "Starter", level: 1 }, // Starter
    pri_01jxben1kf0pfntb8162sfxhba: { name: "Pro", level: 2 }, // Pro
    pri_01jxxb51m8t8edd9w3wvw96bt4: { name: "Studio", level: 3 }, // Studio
  };

  const currentPlan =
    planHierarchy[currentPriceId as keyof typeof planHierarchy];
  if (!currentPlan) return [];

  // Return plans with higher levels (upgrades)
  return Object.entries(planHierarchy)
    .filter(([, plan]) => plan.level > currentPlan.level)
    .map(([priceId, plan]) => ({ priceId, ...plan }));
}
