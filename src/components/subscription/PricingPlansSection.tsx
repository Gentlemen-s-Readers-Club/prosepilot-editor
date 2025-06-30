import React from "react";
import { useSelector } from "react-redux";
import {
  selectCurrentPlan,
  selectSubscriptionStatus,
  selectCanSubscribeToNewPlan,
} from "../../store/slices/subscriptionSlice";
import { PlanCard } from "./PlanCard";
import { PricingPlansSkeleton } from "./SubscriptionSkeleton";

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
  paddlePrice?: {
    unitPrice: {
      amount: string;
    };
  };
}

interface PricingPlansSectionProps {
  plans: Plan[];
  loading: boolean;
  onUpgrade: (plan: Plan) => void;
}

export const PricingPlansSection: React.FC<PricingPlansSectionProps> = ({
  plans,
  loading,
  onUpgrade,
}) => {
  const currentPlan = useSelector(selectCurrentPlan);
  const subscriptionStatus = useSelector(selectSubscriptionStatus);
  const canSubscribeToNewPlan = useSelector(selectCanSubscribeToNewPlan);

  if (loading) {
    return <PricingPlansSkeleton />;
  }

  return (
    <div className="space-y-12 mt-20">
      <h2 className="text-3xl font-bold text-base-heading text-center font-heading">
        Available Plans
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => {
          const isCurrentPlan = currentPlan === plan.id;
          const canSubscribeToThisPlan = canSubscribeToNewPlan || isCurrentPlan;
          const hasActiveButDifferentPlan =
            subscriptionStatus.isActive && !isCurrentPlan;

          return (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrentPlan={isCurrentPlan}
              canSubscribe={canSubscribeToThisPlan}
              hasActiveButDifferentPlan={hasActiveButDifferentPlan}
              onUpgrade={onUpgrade}
              currentPlan={currentPlan}
              plans={plans}
            />
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="mt-40 text-center">
        <p className="text-base-paragraph mb-4 font-copy">
          All plans include our core AI writing features and export capabilities
        </p>
        <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
          <p className="text-base-paragraph font-copy">
            <span className="text-brand-accent">✓</span> AI story generation
          </p>
          <p className="text-base-paragraph font-copy">
            <span className="text-brand-accent">✓</span> Character development
          </p>
          <p className="text-base-paragraph font-copy">
            <span className="text-brand-accent">✓</span> Plot consistency
            checking
          </p>
        </div>
      </div>
    </div>
  );
};
