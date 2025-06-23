import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { ApiState } from '../types';

interface AuthState extends ApiState {
  session: Session | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  session: null,
  status: 'idle',
  error: null,
  isInitialized: false,
};

export const getSession = createAsyncThunk(
  'auth/getInitialSession',
  async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<Session | null>) => {
      state.session = action.payload;
      state.isInitialized = true;
    },
    clearSession: (state) => {
      state.session = null;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.status = 'error';
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Session
      .addCase(getSession.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getSession.fulfilled, (state, action) => {
        state.status = 'success';
        state.session = action.payload;
        state.isInitialized = true;
      })
      .addCase(getSession.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message || 'Failed to get initial session';
        state.isInitialized = true;
      })
  },
});

export const { setSession, clearSession, setError, clearError } = authSlice.actions;

export default authSlice.reducer; 