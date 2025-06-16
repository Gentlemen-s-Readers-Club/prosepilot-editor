import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

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

interface BookGeneration {
  id: string;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  credits_reserved: number;
  credits_consumed: number;
  book_title: string | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
}

interface UseCreditsReturn {
  balance: CreditBalance | null;
  transactions: CreditTransaction[];
  bookGenerations: BookGeneration[];
  loading: boolean;
  error: string | null;
  refreshBalance: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  refreshBookGenerations: () => Promise<void>;
  checkBalance: () => Promise<number | null>;
}

export function useCredits(): UseCreditsReturn {
  const [balance, setBalance] = useState<CreditBalance | null>(null);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [bookGenerations, setBookGenerations] = useState<BookGeneration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's credit balance
  const refreshBalance = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("User not authenticated");
        return;
      }

      const { data, error: balanceError } = await supabase
        .from("user_credits")
        .select(
          "current_balance, total_earned, total_consumed, last_refill_date"
        )
        .eq("user_id", user.id)
        .single();

      if (balanceError) {
        if (balanceError.code === "PGRST116") {
          // No record found, user has 0 credits
          setBalance({
            current_balance: 0,
            total_earned: 0,
            total_consumed: 0,
            last_refill_date: null,
          });
        } else {
          throw balanceError;
        }
      } else {
        setBalance(data);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching credit balance:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch balance");
    }
  }, []);

  // Fetch user's credit transactions
  const refreshTransactions = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error: transactionsError } = await supabase
        .from("credit_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (transactionsError) throw transactionsError;

      setTransactions(data || []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch transactions"
      );
    }
  }, []);

  // Fetch user's book generations
  const refreshBookGenerations = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error: generationsError } = await supabase
        .from("book_generations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (generationsError) throw generationsError;

      setBookGenerations(data || []);
    } catch (err) {
      console.error("Error fetching book generations:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch book generations"
      );
    }
  }, []);

  // Quick balance check (returns just the number)
  const checkBalance = useCallback(async (): Promise<number | null> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase.rpc("get_user_credits", {
        p_user_id: user.id,
      });

      return data || 0;
    } catch (err) {
      console.error("Error checking balance:", err);
      return null;
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      await Promise.all([
        refreshBalance(),
        refreshTransactions(),
        refreshBookGenerations(),
      ]);
      setLoading(false);
    };

    fetchInitialData();
  }, [refreshBalance, refreshTransactions, refreshBookGenerations]);

  // Set up real-time subscriptions for balance updates
  useEffect(() => {
    let balanceSubscription: RealtimeChannel | null = null;
    let transactionsSubscription: RealtimeChannel | null = null;
    let generationsSubscription: RealtimeChannel | null = null;

    const setupRealtimeSubscriptions = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      console.log("Setting up realtime subscriptions for user:", user.id);

      // Subscribe to credit balance changes
      balanceSubscription = supabase
        .channel(`user_credits_${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "user_credits",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log("Credit balance changed:", payload);
            refreshBalance();
          }
        )
        .subscribe((status) => {
          console.log("Credit balance subscription status:", status);
        });

      // Subscribe to new transactions
      transactionsSubscription = supabase
        .channel(`credit_transactions_${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "credit_transactions",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log("New credit transaction:", payload);
            refreshTransactions();
            // Also refresh balance when new transaction is logged
            refreshBalance();
          }
        )
        .subscribe((status) => {
          console.log("Credit transactions subscription status:", status);
        });

      // Subscribe to book generation updates
      generationsSubscription = supabase
        .channel(`book_generations_${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "book_generations",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log("Book generation updated:", payload);
            refreshBookGenerations();
            // Refresh balance when book generation status changes (credit consumption)
            refreshBalance();
          }
        )
        .subscribe((status) => {
          console.log("Book generations subscription status:", status);
        });
    };

    setupRealtimeSubscriptions();

    return () => {
      if (balanceSubscription) {
        console.log("Unsubscribing from realtime subscriptions");
        balanceSubscription.unsubscribe();
      }
      if (transactionsSubscription) {
        transactionsSubscription.unsubscribe();
      }
      if (generationsSubscription) {
        generationsSubscription.unsubscribe();
      }
    };
  }, [refreshBalance, refreshTransactions, refreshBookGenerations]);

  return {
    balance,
    transactions,
    bookGenerations,
    loading,
    error,
    refreshBalance,
    refreshTransactions,
    refreshBookGenerations,
    checkBalance,
  };
}
