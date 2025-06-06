import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Tone, ApiState } from '../types';
import { supabase } from '../../lib/supabase';

interface TonesState extends ApiState {
  items: Tone[];
}

const initialState: TonesState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchTones = createAsyncThunk(
  'tones/fetchTones',
  async () => {
    const { data, error } = await supabase
      .from('tones')
      .select('*')
      .order('name');

    if (error) {
      throw new Error(error.message);
    }

    return data.map(tone => ({
      id: tone.id,
      name: tone.name,
      description: tone.description || undefined,
    }));
  }
);

const tonesSlice = createSlice({
  name: 'tones',
  initialState,
  reducers: {
    setTones: (state, action: PayloadAction<Tone[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTones.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTones.fulfilled, (state, action) => {
        state.status = 'success';
        state.items = action.payload;
      })
      .addCase(fetchTones.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message || 'Failed to fetch tones';
      });
  },
});

export const { setTones } = tonesSlice.actions;
export default tonesSlice.reducer; 