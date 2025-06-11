import React from "react";
import { useSubscriptions } from "../hooks/useSubscriptions";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { Crown, Loader2 } from "lucide-react";

interface SubscriptionGuardProps {
  children: React.ReactNode;
  requiredPlan?: string; // Optional: require a specific plan
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
}

export function SubscriptionGuard({
  children,
  requiredPlan,
  fallback,
  showUpgradePrompt = true,
}: SubscriptionGuardProps) {
  const { hasActiveSubscription, hasActivePlan, loading, error } =
    useSubscriptions();

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Checking subscription...</span>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">Error checking subscription status</p>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  // Check if user has required plan
  const hasRequiredAccess = requiredPlan
    ? hasActivePlan(requiredPlan)
    : hasActiveSubscription;

  // If user has access, render children
  if (hasRequiredAccess) {
    return <>{children}</>;
  }

  // If custom fallback provided, use it
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default upgrade prompt
  if (showUpgradePrompt) {
    return (
      <div className="text-center p-8 border rounded-lg bg-card">
        <Crown className="h-12 w-12 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Premium Feature</h3>
        <p className="text-muted-foreground mb-4">
          {requiredPlan
            ? `This feature requires the ${requiredPlan} plan.`
            : "This feature requires an active subscription."}
        </p>
        <Button asChild>
          <Link to="/app/subscription">Upgrade Now</Link>
        </Button>
      </div>
    );
  }

  // Don't render anything
  return null;
}

// Utility hook for checking subscription status in components
export function useSubscriptionStatus() {
  const subscriptionData = useSubscriptions();

  return {
    ...subscriptionData,
    isPremium: subscriptionData.hasActiveSubscription,
    canAccess: (feature: string) => {
      // You can implement feature-specific access logic here
      // This is just a simple example
      const featureRequirements: Record<string, string> = {
        "advanced-editor": "pri_01jxben1kf0pfntb8162sfxhba", // Pro plan
        analytics: "pri_01jxben1kf0pfntb8162sfxhba", // Pro plan
      };

      const requiredPlan = featureRequirements[feature];
      return requiredPlan ? subscriptionData.hasActivePlan(requiredPlan) : true;
    },
  };
}
