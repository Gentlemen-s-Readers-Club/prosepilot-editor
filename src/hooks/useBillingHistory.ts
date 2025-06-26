import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export interface Transaction {
  id: string;
  status: string;
  amount: string;
  currency_code: string;
  created_at: string;
  billed_at: string;
  collection_mode: string;
  invoice_number: string;
  details: {
    totals: {
      total: string;
      subtotal: string;
      tax: string;
      discount: string;
    };
  };
  items: Array<{
    price: {
      name: string;
      description: string;
      product_id: string;
      unit_price: {
        amount: string;
        currency_code: string;
      };
    };
  }>;
}

export function useBillingHistory() { 
  const { session } = useSelector((state: RootState) => ({
    session: state.auth.session,
  }));  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    if (!session?.user) {
      console.log("🔍 No user session found, skipping transaction fetch");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Fetching transactions for user:", session.user.id);
      console.log(
        "🌍 Current environment:",
        import.meta.env.VITE_PADDLE_ENV || "sandbox"
      );

      const { data, error } = await supabase.functions.invoke(
        "handle-paddle-transactions",
        {
          body: {
            action: "get_transactions",
            user_id: session.user.id,
            environment: import.meta.env.VITE_PADDLE_ENV || "sandbox",
          },
        }
      );

      console.log("📦 Raw response from edge function:", data);

      if (error) {
        console.error("❌ Edge function error:", error);
        throw error;
      }

      if (data.success) {
        console.log("✅ Raw transaction data:", data.data);
        console.log("📦 First transaction sample:", data.data.data?.[0]);
        setTransactions(data.data.data || []);
      } else {
        console.error("❌ Edge function returned error:", data.error);
        throw new Error(data.error);
      }
    } catch (err) {
      console.error("💥 Error fetching transactions:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch transactions"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoiceUrl = async (transactionId: string) => {
    if (!session?.user) {
      console.log("🔍 No user session found, cannot fetch invoice");
      return null;
    }

    try {
      const { data, error } = await supabase.functions.invoke(
        "handle-paddle-transactions",
        {
          body: {
            action: "get_invoice",
            user_id: session.user.id,
            environment: import.meta.env.VITE_PADDLE_ENV || "sandbox",
            transaction_id: transactionId,
          },
        }
      );

      if (error) {
        console.error("❌ Error fetching invoice:", error);
        throw error;
      }

      if (data.success && data.data?.data?.url) {
        return data.data.data.url;
      } else {
        console.error("❌ No invoice URL in response:", data);
        return null;
      }
    } catch (err) {
      console.error("💥 Error fetching invoice URL:", err);
      return null;
    }
  };

  // Format currency for display
  const formatAmount = (amount: string, currency: string = "USD") => {
    // Convert cents to dollars before formatting
    const amountInDollars = parseFloat(amount) / 100;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amountInDollars);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Load transactions when user changes
  useEffect(() => {
    console.log("👤 User session changed:", !!session?.user);
    if (session?.user) {
      fetchTransactions();
    }
  }, [session?.user]);

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    formatAmount,
    formatDate,
    fetchInvoiceUrl,
  };
}
