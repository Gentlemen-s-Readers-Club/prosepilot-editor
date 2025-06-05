import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  profile: null,
  loading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setProfile: (state, action: PayloadAction<Profile | null>) => {
      state.profile = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.profile = null;
    },
  },
});

export const { setUser, setProfile, setLoading, clearAuth } = authSlice.actions;
export default authSlice.reducer;