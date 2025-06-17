import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { useCreditPurchases } from "../hooks/useCreditPurchases";
import { useSubscriptions } from "../hooks/useSubscriptions";
import { useToast } from "../hooks/use-toast";
import { Plus, CreditCard } from "lucide-react";

export function CreditPurchase() {
  const { packages, loading, error, purchaseCredits, formatPrice } =
    useCreditPurchases();
  const { hasActiveSubscription } = useSubscriptions();
  const { toast } = useToast();

  // Handle success/error from URL params (similar to subscription flow)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const creditPurchaseSuccess = urlParams.get("credit_purchase_success");

    if (creditPurchaseSuccess === "true") {
      toast({
        title: "Credit Purchase Successful!",
        description:
          "Your credits have been added to your account and are ready to use.",
        variant: "default",
      });

      // Clean up URL params
      const url = new URL(window.location.href);
      url.searchParams.delete("credit_purchase_success");
      window.history.replaceState({}, "", url);
    }
  }, [toast]);

  // Only show if user has an active subscription
  if (!hasActiveSubscription) {
    return null;
  }

  const handlePurchase = async (packageId: string) => {
    console.log("🎯 CreditPurchase - handlePurchase called:", { packageId });
    console.log("📦 Available packages:", packages);
    console.log("🔄 Loading state:", loading);

    const result = await purchaseCredits(packageId);
    console.log("🔄 Purchase result:", result);

    if (!result.success) {
      console.error("Purchase failed:", result.error);
      toast({
        title: "Purchase Failed",
        description:
          result.error ||
          "Unable to process your credit purchase. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-base-heading">
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

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-base-heading">
          Buy More Credits
        </h2>
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          Error loading credit packages: {error}
        </div>
      </div>
    );
  }

  if (packages.length === 0 && !loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-base-heading">
          Buy More Credits
        </h2>
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-4 py-3 rounded-lg">
          <p>No credit packages available. This could mean:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
            <li>Database schema not applied</li>
            <li>Credit packages not inserted</li>
            <li>Backend function not working</li>
          </ul>
          <pre className="mt-2 text-xs bg-yellow-100 p-2 rounded">
            Debug: packages = {JSON.stringify(packages, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-base-heading">
        Buy More Credits
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-base-background rounded-lg p-4 border hover:border-primary transition-colors"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="text-lg font-semibold text-base-heading">
                {pkg.credits_amount} Credits
              </div>
              {pkg.discount_percentage > 0 && (
                <div className="text-sm bg-state-success-light text-state-success px-2 py-1 rounded">
                  Save {pkg.discount_percentage}%
                </div>
              )}
            </div>
            <div className="text-2xl font-bold text-brand-accent mb-4">
              {formatPrice(pkg.price_cents, pkg.currency)}
            </div>
            <Button
              onClick={() => handlePurchase(pkg.id)}
              disabled={loading}
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
          <div className="text-sm">
            <strong>Secure Payment:</strong> All payments are processed securely
            through Paddle. Credits are added to your account immediately after
            payment confirmation.
          </div>
        </div>
      </div>
    </div>
  );
}
