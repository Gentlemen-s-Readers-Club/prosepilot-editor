import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';
import { ApiState } from '../types';

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  email?: string;
  created_at?: string;
  updated_at?: string;
  newsletter_product?: boolean;
  newsletter_marketing?: boolean;
  newsletter_writing?: boolean;
}

interface ProfileState extends ApiState {
  profile: Profile | null;
}

const initialState: ProfileState = {
  profile: null,
  status: 'idle',
  error: null,
};

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error('No authenticated user');
    }

    console.log('Fetching profile for user:', session.user.id);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    // If no profile exists, create a fallback profile from auth user
    if (error && error.code === 'PGRST116') {
      console.log('No profile found, creating fallback from auth user');
      const fallbackProfile = {
        id: session.user.id,
        email: session.user.email,
        full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
        avatar_url: session.user.user_metadata?.avatar_url || null,
        newsletter_product: true,
        newsletter_marketing: true,
        newsletter_writing: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Try to create the profile in the database
      try {
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([fallbackProfile])
          .select()
          .single();
          
        if (!insertError) {
          console.log('Successfully created new profile');
          return newProfile;
        } else {
          console.warn('Failed to create profile, using fallback:', insertError);
        }
      } catch (insertErr) {
        console.warn('Error creating profile, using fallback:', insertErr);
      }
      
      return fallbackProfile;
    }
    
    if (error) {
      console.error('Profile fetch error:', error);
      throw new Error(error.message);
    }

    console.log('Successfully fetched profile:', data);
    return {
      ...data,
      email: session.user.email,
    };
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (updates: Partial<Profile>) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error('No authenticated user');
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', session.user.id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      ...data,
      email: session.user.email,
    };
  }
);

export const updateNewsletterPreferences = createAsyncThunk(
  'profile/updateNewsletterPreferences',
  async (preferences: {
    newsletter_product?: boolean;
    newsletter_marketing?: boolean;
    newsletter_writing?: boolean;
  }) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error('No authenticated user');
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(preferences)
      .eq('id', session.user.id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      ...data,
      email: session.user.email,
    };
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Profile | null>) => {
      state.profile = action.payload;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = 'success';
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message || 'Failed to fetch profile';
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = 'success';
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message || 'Failed to update profile';
      })
      // Update Newsletter Preferences
      .addCase(updateNewsletterPreferences.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateNewsletterPreferences.fulfilled, (state, action) => {
        state.status = 'success';
        state.profile = action.payload;
      })
      .addCase(updateNewsletterPreferences.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message || 'Failed to update newsletter preferences';
      });
  },
});

export const { setProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;