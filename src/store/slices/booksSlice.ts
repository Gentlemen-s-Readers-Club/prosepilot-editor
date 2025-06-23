import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';
import { ApiState, Book } from '../types';

interface BooksState extends ApiState {
  items: Book[];
}

const initialState: BooksState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchBooks = createAsyncThunk(
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

export const updateBook = createAsyncThunk(
  'books/updateBook',
  async ({ bookId, updates }: { bookId: string; updates: Partial<Book> }) => {
    const { error } = await supabase
      .from('books')
      .update(updates)
      .eq('id', bookId);

    if (error) {
      throw new Error(error.message);
    }

    return { bookId, updates };
  }
);

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setBooks: (state, action: PayloadAction<Book[]>) => {
      state.items = action.payload;
    },
    updateBookInList: (state, action: PayloadAction<{ bookId: string; updates: Partial<Book> }>) => {
      const { bookId, updates } = action.payload;
      const bookIndex = state.items.findIndex(book => book.id === bookId);
      if (bookIndex !== -1) {
        state.items[bookIndex] = {
          ...state.items[bookIndex],
          ...updates,
          updated_at: new Date().toISOString() // Update the timestamp
        };
      }
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
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        const { bookId, updates } = action.payload;
        const bookIndex = state.items.findIndex(book => book.id === bookId);
        if (bookIndex !== -1) {
          state.items[bookIndex] = {
            ...state.items[bookIndex],
            ...updates,
            updated_at: new Date().toISOString()
          };
        }
      });
  },
});

export const { setBooks, updateBookInList } = booksSlice.actions;
export default booksSlice.reducer;