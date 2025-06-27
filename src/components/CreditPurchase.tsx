import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { useSubscriptions } from "../hooks/useSubscriptions";
import { toast } from "../hooks/use-toast";
import { Plus, CreditCard } from "lucide-react";
import { CreditPackage, fetchCreditPackages, formatPrice } from "../store/slices/creditPurchasesSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { useCreditPurchases } from "../hooks/useCreditPurchases";

export function CreditPurchase() {
  const dispatch = useDispatch<AppDispatch>();
  const { packages, status: creditPackagesStatus } = useSelector((state: RootState) => state.creditPurchases);
  const { hasActiveSubscription } = useSubscriptions();
  const { processCreditPurchase } = useCreditPurchases();

  useEffect(() => {
    console.log("🔄 CreditPurchase - creditPackagesStatus:", creditPackagesStatus);
    if (creditPackagesStatus === "idle") {
      dispatch(fetchCreditPackages());
    }
  }, [dispatch, creditPackagesStatus]);

  const handlePurchase = async (selectedPackage: CreditPackage) => {
    try {
      processCreditPurchase(selectedPackage);
    } catch (error) {
      console.error("Error purchasing credits:", error);
      toast({
        title: "Purchase Failed",
        description: "Unable to process your credit purchase. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!packages.length || !hasActiveSubscription || creditPackagesStatus === "error") {
    return null;
  }

  if (creditPackagesStatus !== "success") {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-base-heading font-heading">
          Buy More Credits
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse"
            >
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-base-heading font-heading">
        Buy More Credits
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-base-background rounded-lg p-4 border hover:border-primary transition-colors"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="text-lg font-semibold text-base-heading font-copy">
                {pkg.credits_amount} Credits
              </div>
              {pkg.discount_percentage > 0 && (
                <div className="text-sm bg-state-success-light text-state-success px-2 py-1 rounded font-copy">
                  Save {pkg.discount_percentage}%
                </div>
              )}
            </div>
            <div className="text-2xl font-bold text-brand-accent mb-4">
              {formatPrice(pkg.price_cents, pkg.currency)}
            </div>
            <Button
              onClick={() => handlePurchase(pkg)}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Buy Credits
            </Button>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg">
        <div className="flex items-start">
          <CreditCard className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm font-copy">
            <strong>Secure Payment:</strong> All payments are processed securely
            through Paddle. Credits are added to your account immediately after
            payment confirmation.
          </div>
        </div>
      </div>
    </div>
  );
}
