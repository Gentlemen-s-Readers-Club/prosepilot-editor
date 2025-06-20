import React, { useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "../hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
// Using regular Dialog for confirmation instead of AlertDialog
import { Loader2, AlertTriangle, ArrowUp, X, Clock, Zap } from "lucide-react";
import {
  cancelSubscription,
  changeSubscription,
  getAvailablePlanChanges,
} from "../services/subscriptionManagement";
import { Subscription } from "../hooks/useSubscriptions";

interface SubscriptionManagementProps {
  subscription: Subscription;
  availablePlans: Array<{
    id: string;
    name: string;
    priceId: string;
    price: number;
    description: string;
    features: string[];
  }>;
  onSuccess?: () => void;
}

export function SubscriptionManagement({
  subscription,
  availablePlans,
  onSuccess,
}: SubscriptionManagementProps) {
  const { toast } = useToast();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedNewPlan, setSelectedNewPlan] = useState<string | null>(null);
  const [cancellationTiming, setCancellationTiming] = useState<
    "next_billing_period" | "immediately"
  >("next_billing_period");

  // Get available plan change options (upgrades and downgrades)
  const planChangeOptions = getAvailablePlanChanges(subscription.price_id);
  const canChangePlan = planChangeOptions.length > 0;

  // Get current plan details
  const currentPlan = availablePlans.find(
    (plan) => plan.priceId === subscription.price_id
  );

  // Handle subscription cancellation
  const handleCancellation = async () => {
    if (!subscription.subscription_id) return;

    setIsProcessing(true);
    try {
      const result = await cancelSubscription(
        subscription.subscription_id,
        cancellationTiming
      );

      if (result.success) {
        const isImmediate = cancellationTiming === "immediately";
        toast({
          title: "Subscription Cancelled",
          description: isImmediate
            ? "Your subscription has been cancelled immediately. You no longer have access to premium features."
            : "Your subscription has been cancelled and will end at the end of your current billing period.",
        });
        setShowCancelDialog(false);
        onSuccess?.();
      } else {
        throw new Error(result.error || "Failed to cancel subscription");
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast({
        title: "Cancellation Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle subscription plan change
  const handlePlanChange = async () => {
    if (!subscription.subscription_id || !selectedNewPlan) return;

    setIsProcessing(true);
    try {
      const result = await changeSubscription(
        subscription.subscription_id,
        selectedNewPlan
      );

      if (result.success) {
        const newPlan = availablePlans.find(
          (plan) => plan.priceId === selectedNewPlan
        );
        const selectedOption = planChangeOptions.find(
          (option) => option.priceId === selectedNewPlan
        );
        toast({
          title: "Subscription Changed",
          description: `Your subscription has been ${
            selectedOption?.changeType === "upgrade" ? "upgraded" : "changed"
          } to ${newPlan?.name}. Changes will take effect ${
            selectedOption?.changeType === "upgrade"
              ? "immediately"
              : "at your next billing cycle"
          }.`,
        });
        setShowUpgradeDialog(false);
        setSelectedNewPlan(null);
        onSuccess?.();
      } else {
        throw new Error(result.error || "Failed to change subscription");
      }
    } catch (error) {
      console.error("Error upgrading subscription:", error);
      toast({
        title: "Plan Change Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to change subscription plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Check if subscription is active
  const isActive =
    subscription.status === "active" || subscription.status === "trialing";
  const isPendingCancellation = subscription.cancel_at_period_end;

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Change Plan Button */}
      {canChangePlan && isActive && !isPendingCancellation && (
        <Button
          variant="default"
          size="sm"
          onClick={() => setShowUpgradeDialog(true)}
          className="flex items-center gap-2"
        >
          <ArrowUp className="h-4 w-4" />
          Change Plan
        </Button>
      )}

      {/* Cancel Button */}
      {isActive && !isPendingCancellation && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCancelDialog(true)}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <X className="h-4 w-4" />
          Cancel Subscription
        </Button>
      )}

      {/* Pending Cancellation Notice */}
      {isPendingCancellation && (
        <div className="text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded-md font-copy">
          Subscription will be cancelled at the end of your billing period
        </div>
      )}

      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading">Change Your Subscription Plan</DialogTitle>
            <DialogDescription className="font-copy">
              Choose a new plan to switch to. For upgrades, you'll be charged
              the prorated difference immediately. For downgrades, the change
              will take effect at your next billing cycle.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Current Plan Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-sm text-gray-700 mb-1 font-heading">
                Current Plan
              </h4>
              <div className="text-lg font-semibold font-copy">
                {currentPlan?.name || "Unknown Plan"}
              </div>
              <div className="text-sm text-gray-600 font-copy">
                ${(currentPlan?.price || 0) / 100}/month
              </div>
            </div>

            {/* Plan Change Options */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-700 font-heading">
                Available Plans
              </h4>
              {planChangeOptions.map((option) => {
                const plan = availablePlans.find(
                  (p) => p.priceId === option.priceId
                );
                if (!plan) return null;

                const isSelected = selectedNewPlan === option.priceId;

                return (
                  <div
                    key={option.priceId}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedNewPlan(option.priceId)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold font-copy">{plan.name}</div>
                        <div className="text-sm text-gray-600 font-copy">
                          {plan.description}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold font-copy">
                          ${plan.price / 100}/month
                        </div>
                        <div
                          className={`text-sm font-copy ${
                            option.changeType === "upgrade"
                              ? "text-green-600"
                              : "text-blue-600"
                          }`}
                        >
                          {option.changeType === "upgrade" ? "+" : ""}$
                          {(plan.price - (currentPlan?.price || 0)) / 100}/month
                          <span className="ml-1 text-gray-500">
                            ({option.changeType})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowUpgradeDialog(false);
                setSelectedNewPlan(null);
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePlanChange}
              disabled={!selectedNewPlan || isProcessing}
            >
              {isProcessing && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              Change Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancellation Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-heading">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Cancel Subscription?
            </DialogTitle>
            <DialogDescription className="font-copy">
              Choose when you'd like your subscription to end.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-3">
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  cancellationTiming === "next_billing_period"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setCancellationTiming("next_billing_period")}
              >
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-4 h-4 mt-0.5">
                    <div
                      className={`w-3 h-3 rounded-full border-2 ${
                        cancellationTiming === "next_billing_period"
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {cancellationTiming === "next_billing_period" && (
                        <div className="w-1 h-1 bg-white rounded-full mx-auto mt-0.5" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-600" />
                      <span className="font-medium font-copy">End of billing period</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 font-copy">
                      Keep access until your next billing date. No further
                      charges will be made.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  cancellationTiming === "immediately"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setCancellationTiming("immediately")}
              >
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-4 h-4 mt-0.5">
                    <div
                      className={`w-3 h-3 rounded-full border-2 ${
                        cancellationTiming === "immediately"
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {cancellationTiming === "immediately" && (
                        <div className="w-1 h-1 bg-white rounded-full mx-auto mt-0.5" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-gray-600" />
                      <span className="font-medium font-copy">Cancel immediately</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 font-copy">
                      Lose access to premium features right away.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600 font-copy">
                <strong>Note:</strong> You can reactivate anytime by subscribing
                to a new plan.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              disabled={isProcessing}
            >
              Keep Subscription
            </Button>
            <Button
              onClick={handleCancellation}
              disabled={isProcessing}
              variant="destructive"
            >
              {isProcessing && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              {cancellationTiming === "immediately"
                ? "Cancel Now"
                : "Schedule Cancellation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
