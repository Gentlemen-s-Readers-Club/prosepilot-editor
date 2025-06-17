import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";
import { usePaddle } from "../contexts/PaddleContext";

export interface CreditPackage {
  id: string;
  name: string;
  product_id: string;
  price_id: string;
  credits_amount: number;
  price_cents: number;
  currency: string;
  discount_percentage: number;
  is_active: boolean;
}

export interface CreditPurchase {
  id: string;
  user_id: string;
  credit_package_id: string;
  paddle_transaction_id?: string;
  status: "pending" | "completed" | "failed" | "refunded";
  credits_amount: number;
  price_paid_cents: number;
  currency: string;
  paddle_checkout_id?: string;
  completed_at?: string;
  created_at: string;
  credit_packages?: CreditPackage;
}

export const useCreditPurchases = () => {
  const { session } = useAuth();
  const { paddle, loading: paddleLoading } = usePaddle();
  const user = session?.user;
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [purchases, setPurchases] = useState<CreditPurchase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch available credit packages
  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke(
        "handle-credit-purchase",
        {
          body: {
            action: "get_packages",
            user_id: user?.id,
          },
        }
      );

      if (error) throw error;

      if (data.success) {
        setPackages(data.packages);
        console.log("✅ Fetched packages from database:", data.packages);
      } else {
        throw new Error(data.error);
      }

      // If no packages from database, add a test package for debugging
      if (data.packages.length === 0) {
        console.log("⚠️ No packages from database, adding test package");
        const testPackage = {
          id: "test-package",
          name: "Test Package",
          product_id: "pro_01jxxajygrq55gpvpcr40fsnhj", // Use the credit packages product ID
          price_id: "pri_01jxben1kf0pfntb8162sfxhba", // Use a known working subscription price ID for testing
          credits_amount: 10,
          price_cents: 2000,
          currency: "USD",
          discount_percentage: 0,
          is_active: true,
        };
        setPackages([testPackage]);
      }
    } catch (err) {
      console.error("Error fetching credit packages:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch credit packages"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's purchase history
  const fetchPurchases = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke(
        "handle-credit-purchase",
        {
          body: {
            action: "get_user_purchases",
            user_id: user.id,
          },
        }
      );

      if (error) throw error;

      if (data.success) {
        setPurchases(data.purchases);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error("Error fetching purchases:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch purchases"
      );
    } finally {
      setLoading(false);
    }
  };

  // Create a purchase record and initiate Paddle checkout
  const purchaseCredits = async (
    packageId: string
  ): Promise<{ success: boolean; checkoutUrl?: string; error?: string }> => {
    console.log("🚀 Starting credit purchase process:", {
      packageId,
      user: user?.id,
      paddle: !!paddle,
    });

    if (!user) {
      console.error("❌ No user authenticated");
      return { success: false, error: "User not authenticated" };
    }

    if (paddleLoading) {
      console.warn("⏳ Paddle still loading, please wait...");
      return {
        success: false,
        error: "Paddle is still loading. Please try again in a moment.",
      };
    }

    try {
      setLoading(true);
      setError(null);

      console.log("📦 Available packages:", packages);

      const selectedPackage = packages.find((pkg) => pkg.id === packageId);
      if (!selectedPackage) {
        console.error("❌ Package not found:", {
          packageId,
          availablePackages: packages.map((p) => p.id),
        });
        throw new Error("Package not found");
      }

      console.log("✅ Selected package:", selectedPackage);

      // Create purchase record
      console.log("🔄 Creating purchase record...");
      const { data, error } = await supabase.functions.invoke(
        "handle-credit-purchase",
        {
          body: {
            action: "create_purchase",
            user_id: user.id,
            package_id: packageId,
          },
        }
      );

      if (error) {
        console.error("❌ Supabase function error:", error);
        throw error;
      }

      if (!data.success) {
        console.error("❌ Purchase creation failed:", data.error);
        throw new Error(data.error);
      }

      const purchase = data.purchase;
      console.log("✅ Purchase record created:", purchase);

      // Ensure Paddle is available
      if (!paddle) {
        console.error("❌ Paddle not initialized");
        throw new Error(
          "Paddle not initialized. Please refresh the page and try again."
        );
      }

      // Ensure DOM is ready and Paddle is fully loaded
      if (typeof document === "undefined" || !document.head) {
        throw new Error("DOM not ready for Paddle checkout");
      }

      // Check if Paddle methods are available
      if (!paddle.Checkout || typeof paddle.Checkout.open !== "function") {
        throw new Error("Paddle checkout not properly initialized");
      }

      // Prepare checkout data
      const checkoutData = {
        items: [
          {
            priceId: selectedPackage.price_id,
            quantity: 1,
          },
        ],
        customer: user.email
          ? {
              email: user.email,
            }
          : undefined,
        customData: {
          purchase_id: purchase.id,
          user_id: user.id,
          type: "credit_purchase",
        },
        settings: {
          displayMode: "overlay" as const,
          theme: "light" as const,
          locale: "en" as const,
          successUrl: `${window.location.origin}/app/subscription?credit_purchase_success=true`,
        },
      };

      console.log("🛒 Opening Paddle checkout with data:", checkoutData);

      // Add a small delay to ensure everything is ready
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Open Paddle checkout
      await paddle.Checkout.open(checkoutData);

      console.log("✅ Paddle checkout opened successfully");
      return { success: true };
    } catch (err) {
      console.error("❌ Error purchasing credits:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to purchase credits";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Note: Success handling is now done through webhook + success URL redirect
  // instead of eventCallback since we're using the proper Paddle context

  // Format price for display
  const formatPrice = (cents: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(cents / 100);
  };

  // Load packages on mount
  useEffect(() => {
    fetchPackages();
  }, []);

  // Load purchases when user changes
  useEffect(() => {
    if (user) {
      fetchPurchases();
    }
  }, [user]);

  return {
    packages,
    purchases,
    loading: loading || paddleLoading, // Include paddle loading state
    error,
    purchaseCredits,
    fetchPackages,
    fetchPurchases,
    formatPrice,
  };
};
