import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Session } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  status: 'loading' | 'ready';
}

const initialState: AuthState = {
  session: null,
  status: 'loading',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<Session | null>) => {
      state.session = action.payload;
      state.status = 'ready';
    },
    clearSession: (state) => {
      state.session = null;
      state.status = 'loading';
    },
    setStatus: (state, action: PayloadAction<'loading' | 'ready'>) => {
      state.status = action.payload;
    },
  }
});

export const { setSession, clearSession, setStatus } = authSlice.actions;

export default authSlice.reducer; 