import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';
import { ApiState, Book } from '../types';
import { RootState } from '..';

interface BooksState extends ApiState {
  items: Book[];
}

const initialState: BooksState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchBooks = createAsyncThunk<
Book[],
  { force?: boolean } | undefined,
  { state: RootState }
>(
  'books/fetchBooks',
  async () => {
    const { data: booksData, error: booksError } = await supabase
      .from('books')
      .select(`
        id,
        title,
        cover_url,
        status,
        languages (name),
        book_categories (
          categories (name)
        )
      `)
      .order('updated_at', { ascending: false });

    if (booksError) {
      throw new Error(booksError.message);
    }

    // First cast to unknown, then to RawBook[] to safely handle the type conversion
    return booksData as unknown as Book[];
  }
);

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setBooks: (state, action: PayloadAction<Book[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = 'success';
        state.items = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message || 'Failed to fetch books';
      });
  },
});

export const { setBooks } = booksSlice.actions;
export default booksSlice.reducer; 