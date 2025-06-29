import React from 'react';
import { FileText, Crown, Users } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from './ui/button';
import { usePaddle } from '../contexts/PaddleContext';
import { usePaddlePrices } from '../hooks/usePaddlePrices';
import { useToast } from '../hooks/use-toast';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { plans } from '../lib/consts';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Utility function to format price
const formatPrice = (
  amount: string | number | undefined,
  isDollarAmount = false
) => {
  if (amount === undefined) return "Loading...";
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;
  // If it's already in dollars (like credit packages), don't divide by 100
  return isDollarAmount
    ? numericAmount.toFixed(2)
    : (numericAmount / 100).toFixed(2);
};

export function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const { toast } = useToast();
  const { profile } = useSelector((state: RootState) => state.profile);
  const { paddle, loading: paddleLoading } = usePaddle();
  const { availablePrices, loading: pricesLoading } = usePaddlePrices(paddle);

  // Use plans with direct price IDs
  const plansWithPrices = plans.map((plan) => {
    // Find the corresponding Paddle price for display purposes
    const paddlePrice = availablePrices.find(
      (price) => price.id === plan.priceId
    );
    return {
      ...plan,
      paddlePrice,
    };
  });

  const getPlanIcon = (icon: string) => {
    switch (icon) {
      case 'FileText':
        return <FileText className="w-6 h-6" />;
      case 'Crown':
        return <Crown className="w-6 h-6" />;
      case 'Users':
        return <Users className="w-6 h-6" />;
      default:
        return null;
    }
  };

  const handleSubscribe = async (plan: (typeof plansWithPrices)[0]) => {
    if (!plan.priceId || !paddle) {
      toast({
        title: "Error",
        description: "Payment system is not available. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    if (!profile?.email) {
      toast({
        title: "Error",
        description: "Please log in to subscribe",
        variant: "destructive",
      });
      return;
    }

    try {
      const checkoutOptions = {
        items: [
          {
            priceId: plan.priceId,
            quantity: 1,
          },
        ],
        customerEmail: profile.email,
        // successUrl: `${window.location.origin}/workspace/dashboard?success=true`,
        // cancelUrl: `${window.location.origin}/workspace/dashboard?cancelled=true`,
      };

      await paddle.Checkout.open(checkoutOptions);
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Error",
        description: "Failed to open checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      onClose();
    } 
  };

  if (paddleLoading || pricesLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary mx-auto mb-4"></div>
                <p className="text-base-paragraph">Loading subscription plans...</p>
              </div>
            </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-base-heading font-heading">
                Choose Your Plan
              </DialogTitle>
              <DialogDescription className="text-base-paragraph mt-1 font-copy">
                Select a subscription plan to unlock AI-powered writing features
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Pricing Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {plansWithPrices.map((plan) => {
              const isPopular = plan.isPopular;
              const isComingSoon = plan.comingSoon;

              return (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105 flex flex-col h-full border-2 ${
                    isPopular ? "ring-2 ring-brand-accent scale-105 border-brand-accent" : "border-gray-200"
                  } ${isComingSoon ? "opacity-75" : ""}`}
                >
                  {isPopular && (
                    <div className="absolute top-0 right-0 bg-brand-accent text-white px-4 py-1 text-sm font-medium rounded-bl-lg font-copy">
                      Most Popular
                    </div>
                  )}
                  {isComingSoon && (
                    <div className="absolute top-0 right-0 bg-state-info text-white px-4 py-1 text-sm font-medium rounded-bl-lg font-copy">
                      Coming Soon
                    </div>
                  )}
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex-1">
                      {/* Plan Header */}
                      <div className="text-center mb-6">
                        <div
                          className={`${plan.color} w-16 h-16 rounded-full flex items-center justify-center text-white mx-auto mb-4`}
                        >
                          {getPlanIcon(plan.icon)}
                        </div>
                        <h3 className="text-xl font-bold text-base-heading font-heading">
                          {plan.name}
                        </h3>
                        <p className="text-base-paragraph mt-2 text-sm font-copy">
                          {plan.description}
                        </p>
                      </div>

                      {/* Pricing */}
                      <div className="text-center mb-6">
                        <div className="flex items-baseline justify-center">
                          <span className="text-4xl font-extrabold text-base-heading font-heading">
                            ${formatPrice(plan.paddlePrice?.unitPrice.amount)}
                          </span>
                          <span className="text-lg text-gray-500 ml-1">
                            /month
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-gray-500 font-copy">
                          {`${plan.credits} credits included`}
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Button
                      className={`w-full ${
                        isPopular &&
                        "bg-brand-accent border-brand-accent text-white hover:bg-brand-accent/90 hover:border-brand-accent/90 hover:text-white"
                      }`}
                      variant={isPopular ? "default" : "outline"}
                      onClick={() => handleSubscribe(plan)}
                      disabled={isComingSoon}
                    >
                      {isComingSoon ? "Coming Soon" : "Get Started"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <Button 
              variant="link" 
              onClick={() => {
                window.location.href = '/workspace/subscription';
              }}
              className="text-brand-accent hover:text-brand-accent/80 p-0 h-auto"
            >
              View detailed plan comparison
            </Button>
            <Button variant="outline" onClick={onClose}>
              Maybe Later
            </Button>
          </div>
        </DialogContent>
      </Dialog>
  );
} 