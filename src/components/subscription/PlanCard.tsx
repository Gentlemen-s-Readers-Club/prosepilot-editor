import React from "react";
import { Button } from "../ui/button";
import { Check } from "lucide-react";

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

interface PlanCardProps {
  plan: Plan;
  isCurrentPlan: boolean;
  canSubscribe: boolean;
  hasActiveButDifferentPlan: boolean;
  onUpgrade: (plan: Plan) => void;
  currentPlan?: string | null;
  plans: Plan[];
}

const formatPrice = (amount: string | number | undefined) => {
  if (amount === undefined) return "Loading...";
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;
  return (numericAmount / 100).toFixed(2);
};

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  isCurrentPlan,
  canSubscribe,
  hasActiveButDifferentPlan,
  onUpgrade,
  currentPlan,
  plans,
}) => {
  const getButtonText = () => {
    if (isCurrentPlan) return "Current Plan";
    if (plan.comingSoon) return "Coming Soon";

    const currentPlanIndex = plans.findIndex((p) => p.id === currentPlan);
    const thisPlanIndex = plans.findIndex((p) => p.id === plan.id);

    return thisPlanIndex < currentPlanIndex ? "Downgrade" : "Upgrade";
  };

  const isButtonDisabled = () => {
    return (
      isCurrentPlan ||
      plan.comingSoon ||
      (!canSubscribe && hasActiveButDifferentPlan)
    );
  };

  return (
    <div
      className={`relative bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105 flex flex-col h-full ${
        plan.isPopular ? "ring-2 ring-brand-accent scale-105" : ""
      } ${plan.comingSoon ? "opacity-75" : ""}`}
    >
      {plan.isPopular && (
        <div className="absolute top-0 right-0 bg-brand-accent text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
          Most Popular
        </div>
      )}
      {plan.comingSoon && (
        <div className="absolute top-0 right-0 bg-state-info text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
          Coming Soon
        </div>
      )}

      <div className="p-8 flex flex-col h-full">
        <div className="flex-1">
          {/* Plan Header */}
          <div className="text-center mb-8">
            <div
              className={`${plan.color} w-16 h-16 rounded-full flex items-center justify-center text-white mx-auto mb-4`}
            >
              {plan.icon}
            </div>
            <h3 className="text-2xl font-bold text-base-heading">
              {plan.name}
            </h3>
            <p className="text-base-paragraph mt-2">{plan.description}</p>
          </div>

          {/* Pricing */}
          <div className="text-center mb-8">
            <div className="flex items-baseline justify-center">
              <span className="text-5xl font-extrabold text-base-heading">
                {formatPrice(plan.paddlePrice?.unitPrice.amount)}
              </span>
              <span className="text-xl text-gray-500 ml-1">/month</span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {plan.credits === -1
                ? "Unlimited credits"
                : `${plan.credits} credits included`}
            </div>
          </div>

          {/* Features */}
          <ul className="space-y-4 mb-8">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="h-5 w-5 text-state-success shrink-0 mt-0.5" />
                <span className="ml-3 text-gray-700 text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <Button
          className={`w-full ${
            plan.isPopular &&
            "bg-brand-accent border-brand-accent text-white hover:bg-brand-accent/90 hover:border-brand-accent/90 hover:text-white"
          }`}
          variant={
            isCurrentPlan ? "secondary" : plan.isPopular ? "default" : "outline"
          }
          onClick={() => onUpgrade(plan)}
          disabled={isButtonDisabled()}
        >
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
};
