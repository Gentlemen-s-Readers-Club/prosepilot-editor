import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';
import { RootState } from '../index';

interface CreditBalance {
  current_balance: number;
  total_earned: number;
  total_consumed: number;
  last_refill_date: string | null;
}

interface UserCreditsState {
  balance: CreditBalance;
  loading: boolean;
  error: string | null;
}

const initialState: UserCreditsState = {
  balance: {
    current_balance: 0,
    total_earned: 0,
    total_consumed: 0,
    last_refill_date: null,
  },
  loading: false,
  error: null,
};

// Async thunk to fetch user credit balance
export const fetchUserCredits = createAsyncThunk(
  'userCredits/fetchBalance',
  async (userId: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("user_credits")
        .select(
          "current_balance, total_earned, total_consumed, last_refill_date"
        )
        .eq("user_id", userId)
        .eq("environment", import.meta.env.VITE_PADDLE_ENV || "sandbox")
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        // No record found, user has 0 credits
        return {
          current_balance: 0,
          total_earned: 0,
          total_consumed: 0,
          last_refill_date: null,
        };
      }

      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "An unknown error occurred");
    }
  }
);

const userCreditsSlice = createSlice({
  name: 'userCredits',
  initialState,
  reducers: {
    clearCredits: (state) => {
      state.balance = {
        current_balance: 0,
        total_earned: 0,
        total_consumed: 0,
        last_refill_date: null,
      };
      state.error = null;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUserCredits
      .addCase(fetchUserCredits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCredits.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload;
        state.error = null;
      })
      .addCase(fetchUserCredits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export const { clearCredits, setError } = userCreditsSlice.actions;

// Selectors
export const selectUserCredits = (state: RootState) => state.userCredits.balance;
export const selectUserCreditsLoading = (state: RootState) => state.userCredits.loading;
export const selectUserCreditsError = (state: RootState) => state.userCredits.error;
export const selectCurrentBalance = (state: RootState) => state.userCredits.balance?.current_balance ?? 0;

export default userCreditsSlice.reducer;
