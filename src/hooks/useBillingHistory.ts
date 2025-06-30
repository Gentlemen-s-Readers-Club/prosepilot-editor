import { useState, useEffect, useRef } from "react";
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

// Cache to prevent duplicate API calls across component instances and StrictMode
const transactionCache = new Map<string, { data: Transaction[], timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Global execution tracking to prevent concurrent calls across all instances
const activeRequests = new Set<string>();

export function useBillingHistory() { 
  const { session, profile } = useSelector((state: RootState) => ({
    session: state.auth.session,
    profile: state.profile.profile,
  }));  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchingRef = useRef(false);

  const fetchTransactions = async () => {
    if (!session?.user) {
      console.log("🔍 No user session found, skipping transaction fetch");
      return;
    }

    // Check cache first
    const cacheKey = `transactions_${session.user.id}`;
    const cached = transactionCache.get(cacheKey);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      console.log("📋 Using cached billing history data");
      setTransactions(cached.data);
      return;
    }

    // Skip if already fetching globally (handles React StrictMode double calls)
    if (loading || fetchingRef.current || activeRequests.has(cacheKey)) {
      console.log("🔍 Already fetching billing history globally, skipping duplicate fetch");
      return;
    }

    try {
      activeRequests.add(cacheKey);
      fetchingRef.current = true;
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
        const transactionData = data.data.data || [];
        setTransactions(transactionData);
        
        // Cache the data
        transactionCache.set(cacheKey, {
          data: transactionData,
          timestamp: now
        });
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
      fetchingRef.current = false;
      activeRequests.delete(cacheKey);
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
      // Check cache first before making API call
      const cacheKey = `transactions_${session.user.id}`;
      const cached = transactionCache.get(cacheKey);
      const now = Date.now();
      
      if (cached && (now - cached.timestamp) < CACHE_DURATION) {
        console.log("📋 Using cached billing history data on mount");
        setTransactions(cached.data);
      } else {
        fetchTransactions();
      }
    }
  }, [session?.user?.id]); // Only trigger when user ID changes, not the whole session object

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
