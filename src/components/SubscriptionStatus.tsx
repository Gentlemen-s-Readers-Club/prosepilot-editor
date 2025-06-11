import React from "react";
import { useSubscriptions } from "../hooks/useSubscriptions";
import { AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react";
import { cn } from "../lib/utils";

interface SubscriptionStatusProps {
  showDetails?: boolean;
  className?: string;
}

interface BadgeProps {
  variant: "default" | "destructive" | "secondary" | "outline";
  className?: string;
  children: React.ReactNode;
}

function Badge({ variant, className, children }: BadgeProps) {
  const variantStyles = {
    default: "bg-primary text-primary-foreground border-primary",
    destructive: "bg-red-100 text-red-800 border-red-200",
    secondary: "bg-gray-100 text-gray-800 border-gray-200",
    outline: "bg-transparent text-foreground border-border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function SubscriptionStatus({
  showDetails = false,
  className = "",
}: SubscriptionStatusProps) {
  const { loading, error, getSubscriptionStatus } = useSubscriptions();

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Clock className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <XCircle className="h-4 w-4 text-red-500" />
        <span className="text-sm text-red-500">Error loading subscription</span>
      </div>
    );
  }

  const status = getSubscriptionStatus();

  const getStatusBadge = () => {
    if (status.hasMultipleSubscriptions) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Multiple Subscriptions
        </Badge>
      );
    }

    if (status.pendingCancellation) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Cancelling at Period End
        </Badge>
      );
    }

    if (status.isActive) {
      return (
        <Badge variant="default" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          {status.planName || "Active"}
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <XCircle className="h-3 w-3" />
        No Active Subscription
      </Badge>
    );
  };

  const getStatusIcon = () => {
    if (status.hasMultipleSubscriptions) {
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    }
    if (status.isActive) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <XCircle className="h-4 w-4 text-gray-400" />;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {!showDetails && getStatusIcon()}
      {getStatusBadge()}
      {showDetails && status.hasMultipleSubscriptions && (
        <span className="text-xs text-orange-600 ml-2">
          Contact support to resolve this
        </span>
      )}
    </div>
  );
}

// Utility hook for components that need subscription status info
export function useSubscriptionStatus() {
  const subscriptions = useSubscriptions();
  const status = subscriptions.getSubscriptionStatus();

  return {
    ...subscriptions,
    status,
    isActive: status.isActive,
    canSubscribe: subscriptions.canSubscribeToNewPlan,
    isPremium: status.isActive,
    planName: status.planName,
    hasIssues: status.hasMultipleSubscriptions,
  };
}
