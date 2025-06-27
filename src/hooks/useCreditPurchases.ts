import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePaddle } from "../contexts/PaddleContext";
import {
  fetchCreditPackages,
  fetchUserPurchases,
  createCreditPurchase,
  setPaddleLoading,
  selectCreditPackages,
  selectCreditPurchases,
  selectCreditPurchasesLoading,
  selectCreditPurchasesError,
  formatPrice,
} from "../store/slices/creditPurchasesSlice";
import { AppDispatch, RootState } from "../store";

export const useCreditPurchases = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { session } = useSelector((state: RootState) => ({
    session: state.auth.session,
  })); 
  const { paddle, loading: paddleLoading } = usePaddle();
  const user = session?.user;

  // Selectors
  const packages = useSelector(selectCreditPackages);
  const purchases = useSelector(selectCreditPurchases);
  const loading = useSelector(selectCreditPurchasesLoading);
  const error = useSelector(selectCreditPurchasesError);

  // Update paddle loading state in Redux
  useEffect(() => {
    dispatch(setPaddleLoading(paddleLoading));
  }, [paddleLoading, dispatch]);

  // Fetch available credit packages
  const fetchPackages = () => {
    dispatch(fetchCreditPackages());
  };

  // Fetch user's purchase history
  const fetchPurchases = () => {
    if (user) {
      dispatch(fetchUserPurchases());
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

      // Create purchase record using Redux thunk
      console.log("🔄 Creating purchase record...");
      const purchaseResult = await dispatch(createCreditPurchase(packageId));
      
      if (createCreditPurchase.rejected.match(purchaseResult)) {
        console.error("❌ Purchase creation failed:", purchaseResult.error);
        throw new Error(purchaseResult.error?.message || "Failed to create purchase");
      }

      const purchase = purchaseResult.payload;
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
          environment: import.meta.env.VITE_PADDLE_ENV || "sandbox",
        },
        settings: {
          displayMode: "overlay" as const,
          theme: "light" as const,
          locale: "en" as const,
          successUrl: `${window.location.origin}/workspace/subscription?credit_purchase_success=true`,
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
      return { success: false, error: errorMessage };
    }
  };

  // Load packages on mount - only if not already loaded
  useEffect(() => {
    fetchPackages();
  }, []); // Empty dependency array to run only once on mount

  // Load purchases when user changes
  useEffect(() => {
    if (user) {
      fetchPurchases();
    }
  }, [user]);

  return {
    packages,
    purchases,
    loading,
    error,
    purchaseCredits,
    fetchPackages,
    fetchPurchases,
    formatPrice,
  };
}; 