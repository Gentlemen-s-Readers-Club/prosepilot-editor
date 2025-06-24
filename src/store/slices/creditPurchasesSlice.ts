import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabase";
import { ApiState } from "../types";
import { RootState } from "../index";

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

interface CreditPurchasesState extends ApiState {
  packages: CreditPackage[];
  purchases: CreditPurchase[];
  paddleLoading: boolean;
}

const initialState: CreditPurchasesState = {
  packages: [],
  purchases: [],
  paddleLoading: false,
  status: "idle",
  error: null,
};

// Async thunks
export const fetchCreditPackages = createAsyncThunk<
  CreditPackage[],
  void,
  { state: RootState }
>(
  "creditPurchases/fetchPackages",
  async (_, { getState }) => {
    const state = getState();
    const session = state.auth.session;

    const { data, error } = await supabase.functions.invoke(
      "handle-credit-purchase",
      {
        body: {
          action: "get_packages",
          user_id: session?.user?.id,
          environment: import.meta.env.VITE_PADDLE_ENV || "sandbox",
        },
      }
    );

    if (error) throw error;

    if (!data.success) {
      throw new Error(data.error);
    }

    // If no packages from database, add a test package for debugging
    if (data.packages.length === 0) {
      console.log("⚠️ No packages from database, adding test package");
      const testPackage = {
        id: "test-package",
        name: "Test Package",
        product_id: "pro_01jxxajygrq55gpvpcr40fsnhj",
        price_id: "pri_01jxben1kf0pfntb8162sfxhba",
        credits_amount: 10,
        price_cents: 2000,
        currency: "USD",
        discount_percentage: 0,
        is_active: true,
      };
      return [testPackage];
    }

    return data.packages;
  }
);

export const fetchUserPurchases = createAsyncThunk<
  CreditPurchase[],
  void,
  { state: RootState }
>(
  "creditPurchases/fetchPurchases",
  async (_, { getState }) => {
    const state = getState();
    const session = state.auth.session;

    if (!session?.user) {
      throw new Error("No authenticated user");
    }

    const { data, error } = await supabase.functions.invoke(
      "handle-credit-purchase",
      {
        body: {
          action: "get_user_purchases",
          user_id: session.user.id,
          environment: import.meta.env.VITE_PADDLE_ENV || "sandbox",
        },
      }
    );

    if (error) throw error;

    if (!data.success) {
      throw new Error(data.error);
    }

    return data.purchases;
  }
);

export const createCreditPurchase = createAsyncThunk<
  CreditPurchase,
  string,
  { state: RootState }
>(
  "creditPurchases/createPurchase",
  async (packageId, { getState }) => {
    const state = getState();
    const session = state.auth.session;

    if (!session?.user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase.functions.invoke(
      "handle-credit-purchase",
      {
        body: {
          action: "create_purchase",
          user_id: session.user.id,
          package_id: packageId,
          environment: import.meta.env.VITE_PADDLE_ENV || "sandbox",
        },
      }
    );

    if (error) throw error;

    if (!data.success) {
      throw new Error(data.error);
    }

    return data.purchase;
  }
);

// Slice
const creditPurchasesSlice = createSlice({
  name: "creditPurchases",
  initialState,
  reducers: {
    setPaddleLoading: (state, action: PayloadAction<boolean>) => {
      state.paddleLoading = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetState: (state) => {
      state.packages = [];
      state.purchases = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch packages
    builder
      .addCase(fetchCreditPackages.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCreditPackages.fulfilled, (state, action) => {
        state.status = "success";
        state.packages = action.payload;
      })
      .addCase(fetchCreditPackages.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message || "Failed to fetch credit packages";
      });

    // Fetch purchases
    builder
      .addCase(fetchUserPurchases.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserPurchases.fulfilled, (state, action) => {
        state.status = "success";
        state.purchases = action.payload;
      })
      .addCase(fetchUserPurchases.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message || "Failed to fetch purchases";
      });

    // Create purchase
    builder
      .addCase(createCreditPurchase.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createCreditPurchase.fulfilled, (state, action) => {
        state.status = "success";
        // Add the new purchase to the list
        state.purchases.unshift(action.payload);
      })
      .addCase(createCreditPurchase.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message || "Failed to create purchase";
      });
  },
});

// Actions
export const { setPaddleLoading, clearError, resetState } = creditPurchasesSlice.actions;

// Selectors
export const selectCreditPackages = (state: RootState) => state.creditPurchases.packages;
export const selectCreditPurchases = (state: RootState) => state.creditPurchases.purchases;
export const selectCreditPurchasesLoading = (state: RootState) => 
  state.creditPurchases.status === "loading" || state.creditPurchases.paddleLoading;
export const selectCreditPurchasesError = (state: RootState) => state.creditPurchases.error;
export const selectCreditPurchasesStatus = (state: RootState) => state.creditPurchases.status;

// Helper function for price formatting
export const formatPrice = (cents: number, currency: string = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(cents / 100);
};

export default creditPurchasesSlice.reducer; 