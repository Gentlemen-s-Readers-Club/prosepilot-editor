import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { LiteratureStyle, ApiState } from '../types';
import { supabase } from '../../lib/supabase';

interface LiteratureStylesState extends ApiState {
  items: LiteratureStyle[];
}

const initialState: LiteratureStylesState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchLiteratureStyles = createAsyncThunk(
  'literatureStyles/fetchLiteratureStyles',
  async () => {
    const { data, error } = await supabase
      .from('literature_styles')
      .select('*')
      .order('name');

    if (error) {
      throw new Error(error.message);
    }

    return data.map(style => ({
      id: style.id,
      name: style.name,
      description: style.description || undefined,
    }));
  }
);

const literatureStylesSlice = createSlice({
  name: 'literatureStyles',
  initialState,
  reducers: {
    setLiteratureStyles: (state, action: PayloadAction<LiteratureStyle[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLiteratureStyles.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchLiteratureStyles.fulfilled, (state, action) => {
        state.status = 'success';
        state.items = action.payload;
      })
      .addCase(fetchLiteratureStyles.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message || 'Failed to fetch literature styles';
      });
  },
});

export const { 
  setLiteratureStyles,
} = literatureStylesSlice.actions;
export default literatureStylesSlice.reducer; 