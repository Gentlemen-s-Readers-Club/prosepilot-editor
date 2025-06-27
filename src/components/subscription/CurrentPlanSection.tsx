import React from "react";
import { Button } from "../ui/button";
import { Clock } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { selectCurrentPlan } from "../../store/slices/subscriptionSlice";
import { CreditPurchase } from "../CreditPurchase";
import { CurrentPlanSkeleton } from "./SubscriptionSkeleton";

interface Plan {
  id: string;
  name: string;
  price: number;
  credits: number;
}

interface CurrentPlanSectionProps {
  plans: Plan[];
  loading: boolean;
  onCancelSubscription: () => void;
  subscriptionManagementLoading: boolean;
}

export const CurrentPlanSection: React.FC<CurrentPlanSectionProps> = ({
  plans,
  loading,
  onCancelSubscription,
  subscriptionManagementLoading,
}) => {
  const currentPlan = useSelector(selectCurrentPlan);
  const subscriptions = useSelector(
    (state: RootState) => state.subscription.subscriptions
  );
  const { balance } = useSelector((state: RootState) => state.userCredits);

  if (loading) {
    return <CurrentPlanSkeleton />;
  }

  const currentPlanDetails = plans.find((p) => p.id === currentPlan);
  const currentSubscription = subscriptions.find(
    (s) => s.status === "active" || s.status === "trialing"
  );

  const renderCreditBalance = () => {
    const currentCredits = balance?.current_balance || 0;
    const totalEarned = balance?.total_earned || 0;
    const totalConsumed = balance?.total_consumed || 0;
    const totalAccountCredits = totalEarned;
    const accountUsageProgress =
      totalAccountCredits > 0 ? (totalConsumed / totalAccountCredits) * 100 : 0;

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700 font-copy">Account credits used:</span>
          <span className="text-sm font-semibold text-gray-900 font-copy">
            {totalConsumed}/{totalAccountCredits}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gray-800 h-2 rounded-full transition-all duration-300"
            style={{ width: `${accountUsageProgress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="font-copy">
            {totalAccountCredits > 0
              ? `${Math.round(
                  (currentCredits / totalAccountCredits) * 100
                )}% remaining`
              : "0% remaining"}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-base-heading font-heading">
          Current Subscription
        </h2>
        {currentPlan && (
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-base-paragraph" />
            <span className="text-base-heading font-copy">
              Next billing date:{" "}
              {currentSubscription?.current_period_end
                ? new Date(
                    currentSubscription.current_period_end
                  ).toLocaleDateString()
                : "Loading..."}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <div className="text-base-heading font-copy">Current Plan</div>
          <div className="text-lg font-bold text-base-paragraph font-copy">
            {currentPlanDetails?.name || "No Active Plan"}
          </div>
          <div className="text-base-heading font-copy">
            {currentPlanDetails ? `$${currentPlanDetails.price}/month` : "Free"}
          </div>
          {currentPlan && (
            <div className="text-sm text-gray-600 font-copy">
              Monthly credits: {currentPlanDetails?.credits || 0}
            </div>
          )}
        </div>

        {currentPlan && (
          <>
            <div className="space-y-2">
              <div className="text-base-heading font-copy">Credit Balance</div>
              {renderCreditBalance()}
            </div>

            <div className="flex items-center justify-end space-x-4">
              <Button
                variant="destructive"
                onClick={onCancelSubscription}
                disabled={subscriptionManagementLoading}
              >
                Cancel Subscription
              </Button>
            </div>
          </>
        )}
      </div>

      {currentPlan && (
        <div className="mt-8 pt-8 border-t">
          <CreditPurchase />
        </div>
      )}
    </div>
  );
};
