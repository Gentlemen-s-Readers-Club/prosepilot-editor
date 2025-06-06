import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Narrator, ApiState } from '../types';
import { supabase } from '../../lib/supabase';

interface NarratorsState extends ApiState {
  items: Narrator[];
}

const initialState: NarratorsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchNarrators = createAsyncThunk(
  'narrators/fetchNarrators',
  async () => {
    const { data, error } = await supabase
      .from('narrators')
      .select('*')
      .order('name');

    if (error) {
      throw new Error(error.message);
    }

    return data.map(narrator => ({
      id: narrator.id,
      name: narrator.name,
      description: narrator.description || undefined,
      voiceType: narrator.voice_type || undefined,
    }));
  }
);

const narratorsSlice = createSlice({
  name: 'narrators',
  initialState,
  reducers: {
    setNarrators: (state, action: PayloadAction<Narrator[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNarrators.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchNarrators.fulfilled, (state, action) => {
        state.status = 'success';
        state.items = action.payload;
      })
      .addCase(fetchNarrators.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message || 'Failed to fetch narrators';
      });
  },
});

export const { setNarrators } = narratorsSlice.actions;
export default narratorsSlice.reducer; 