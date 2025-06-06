import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Language, ApiState } from '../types';
import { supabase } from '../../lib/supabase';
import { RootState } from '..';

interface LanguagesState extends ApiState {
  items: Language[];
}

const initialState: LanguagesState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchLanguages = createAsyncThunk<
  Language[],
  { force?: boolean } | undefined,
  { state: RootState }
>(
  'languages/fetchLanguages',
  async () => {
    const { data, error } = await supabase
      .from('languages')
      .select('*')
      .order('name');

    if (error) {
      throw new Error(error.message);
    }

    return data.map(language => ({
      id: language.id,
      name: language.name,
      code: language.code || language.name.toLowerCase().slice(0, 2),
    }));
  }
);

const languagesSlice = createSlice({
  name: 'languages',
  initialState,
  reducers: {
    setLanguages: (state, action: PayloadAction<Language[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLanguages.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchLanguages.fulfilled, (state, action) => {
        state.status = 'success';
        state.items = action.payload;
      })
      .addCase(fetchLanguages.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message || 'Failed to fetch languages';
      });
  },
});

export const { setLanguages } = languagesSlice.actions;
export default languagesSlice.reducer; 