import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Category {
  id: string;
  name: string;
}

interface Language {
  id: string;
  name: string;
  code: string;
}

interface Narrator {
  id: string;
  name: string;
}

interface LiteratureStyle {
  id: string;
  name: string;
}

interface Tone {
  id: string;
  name: string;
}

interface DataState {
  categories: Category[];
  languages: Language[];
  narrators: Narrator[];
  literatureStyles: LiteratureStyle[];
  tones: Tone[];
}

const initialState: DataState = {
  categories: [],
  languages: [],
  narrators: [],
  literatureStyles: [],
  tones: [],
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    setLanguages: (state, action: PayloadAction<Language[]>) => {
      state.languages = action.payload;
    },
    setNarrators: (state, action: PayloadAction<Narrator[]>) => {
      state.narrators = action.payload;
    },
    setLiteratureStyles: (state, action: PayloadAction<LiteratureStyle[]>) => {
      state.literatureStyles = action.payload;
    },
    setTones: (state, action: PayloadAction<Tone[]>) => {
      state.tones = action.payload;
    },
  },
});

export const {
  setCategories,
  setLanguages,
  setNarrators,
  setLiteratureStyles,
  setTones,
} = dataSlice.actions;

export default dataSlice.reducer;