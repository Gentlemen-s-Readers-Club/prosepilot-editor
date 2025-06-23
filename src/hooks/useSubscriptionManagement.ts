import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useToast } from "./use-toast";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export interface SubscriptionManagementResponse {
  success: boolean;
  message?: string;
  error?: string;
  subscription?: any;
}

export const useSubscriptionManagement = () => {
  const { session } = useSelector((state: RootState) => ({
    session: state.auth.session,
  })); 
  const { toast } = useToast();
  const user = session?.user;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cancel a subscription
  const cancelSubscription = async (
    subscriptionId: string,
    cancellationReason?: string
  ): Promise<SubscriptionManagementResponse> => {
    if (!user) {
      const error = "User not authenticated";
      setError(error);
      return { success: false, error };
    }

    try {
      setLoading(true);
      setError(null);

      console.log("🚫 Cancelling subscription:", subscriptionId);

      const { data, error } = await supabase.functions.invoke(
        "handle-subscription-management",
        {
          body: {
            action: "cancel_subscription",
            user_id: user.id,
            subscription_id: subscriptionId,
            cancellation_reason: cancellationReason,
          },
        }
      );

      if (error) {
        console.error("❌ Supabase function error:", error);
        throw error;
      }

      if (!data.success) {
        console.error("❌ Cancellation failed:", data.error);
        throw new Error(data.error);
      }

      console.log("✅ Subscription cancelled successfully:", data);

      toast({
        title: "Subscription Cancelled",
        description:
          "Your subscription has been cancelled immediately. You will no longer be charged. Your existing credits will remain in your account.",
      });

      return {
        success: true,
        message: data.message,
        subscription: data.subscription,
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to cancel subscription";
      console.error("❌ Error cancelling subscription:", err);
      setError(errorMessage);

      toast({
        title: "Cancellation Failed",
        description: errorMessage,
        variant: "destructive",
      });

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Get subscription details from Paddle
  const getSubscriptionDetails = async (
    subscriptionId: string
  ): Promise<SubscriptionManagementResponse> => {
    if (!user) {
      const error = "User not authenticated";
      setError(error);
      return { success: false, error };
    }

    try {
      setLoading(true);
      setError(null);

      console.log("📋 Fetching subscription details:", subscriptionId);

      const { data, error } = await supabase.functions.invoke(
        "handle-subscription-management",
        {
          body: {
            action: "get_subscription_details",
            user_id: user.id,
            subscription_id: subscriptionId,
          },
        }
      );

      if (error) {
        console.error("❌ Supabase function error:", error);
        throw error;
      }

      if (!data.success) {
        console.error("❌ Failed to fetch details:", data.error);
        throw new Error(data.error);
      }

      console.log("✅ Subscription details fetched:", data);

      return {
        success: true,
        subscription: data.subscription,
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch subscription details";
      console.error("❌ Error fetching subscription details:", err);
      setError(errorMessage);

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    cancelSubscription,
    getSubscriptionDetails,
  };
};
