import { useSelector } from "react-redux";
import { usePaddle } from "../contexts/PaddleContext";
import {
  CreditPackage,
} from "../store/slices/creditPurchasesSlice";
import { RootState } from "../store";

export const useCreditPurchases = () => {
  const user = useSelector((state: RootState) => state.auth.session?.user);
  const { paddle } = usePaddle();

  // Create a purchase record and initiate Paddle checkout
  const processCreditPurchase = (selectedPackage: CreditPackage) => {
    if (!user?.id) {
      throw new Error("User ID is required for credit purchase");
    }

    // Ensure Paddle is available
    if (!paddle) {
      throw new Error(
        "Paddle not initialized. Please refresh the page and try again."
      );
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
      customer: user?.email ? { email: user.email } : undefined,
      customData: {
        purchase_id: selectedPackage.id,
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

    paddle.Checkout.open(checkoutData);
  };

  return { processCreditPurchase };
}; 