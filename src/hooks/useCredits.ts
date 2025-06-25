import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { supabase } from "../lib/supabase";

interface CreditBalance {
  current_balance: number;
  total_earned: number;
  total_consumed: number;
  last_refill_date: string | null;
}

interface CreditTransaction {
  id: string;
  transaction_type: "earn" | "consume" | "refund" | "expire" | "admin_adjust";
  amount: number;
  balance_before: number;
  balance_after: number;
  description: string;
  created_at: string;
  reference_type: string | null;
  metadata: Record<string, unknown> | null;
}


export const useCredits = () => {
  const { session } = useSelector((state: RootState) => (state.auth));
  const [balance, setBalance] = useState<CreditBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    const { data, error } = await supabase
    .from("user_credits")
    .select(
      "current_balance, total_earned, total_consumed, last_refill_date"
    )
    .eq("user_id", session?.user.id)
    .eq("environment", import.meta.env.VITE_PADDLE_ENV || "sandbox")
    .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      // No record found, user has 0 credits
      setBalance({
        current_balance: 0,
        total_earned: 0,
        total_consumed: 0,
        last_refill_date: null,
      });
    } else {
      setBalance(data);
    }
  }, [session?.user.id]);

  // Quick balance check (returns just the number)
  const checkBalance = useCallback(async () => {
    try {
      const { data } = await supabase.rpc("get_user_credits", {
        p_user_id: session?.user.id,
        p_environment: import.meta.env.VITE_PADDLE_ENV,
      });

      return data || 0;
    } catch (err) {
      console.error("Error checking balance:", err);
      return null;
    }
  }, [session?.user.id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchBalance();
      } catch (err) {
        console.error("Error fetching credits:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchBalance]);

  return {
    balance,
    loading,
    error,
    checkBalance,
  };
}