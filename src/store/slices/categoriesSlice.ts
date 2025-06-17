import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Category, ApiState } from '../types';
import { supabase } from '../../lib/supabase';
import { RootState } from '..';

interface CategoriesState extends ApiState {
  items: Category[];
}

const initialState: CategoriesState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchCategories = createAsyncThunk<
  Category[],
  { isPro?: boolean } | undefined,
  { state: RootState }
>(
  'categories/fetchCategories',
  async ({ isPro = false } = {}) => {
    let query = supabase
      .from('categories')
      .select('*')
      .order('name');

    if (!isPro) {
      query = query.eq('is_pro', false);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description || undefined,
    }));
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'success';
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message || 'Failed to fetch categories';
      });
  },
});

export const { setCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer; 