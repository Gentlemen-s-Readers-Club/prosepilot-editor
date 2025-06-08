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
        author_name,
        synopsis,
        created_at,
        updated_at,
        team_id,
        languages (
          id,
          name,
          code
        ),
        book_categories (
          categories (
            id,
            name
          )
        )
      `)
      .order('updated_at', { ascending: false });

    if (booksError) {
      throw new Error(booksError.message);
    }

    // Transform the data to match the expected Book interface
    const transformedBooks = booksData?.map((book: any) => ({
      id: book.id,
      title: book.title,
      cover_url: book.cover_url,
      status: book.status,
      author_name: book.author_name,
      synopsis: book.synopsis,
      created_at: book.created_at,
      updated_at: book.updated_at,
      team_id: book.team_id,
      languages: book.languages,
      categories: book.book_categories?.map((bc: any) => bc.categories) || []
    })) || [];

    return transformedBooks as Book[];
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