import { combineReducers } from '@reduxjs/toolkit';
import categoriesReducer from './slices/categoriesSlice';
import languagesReducer from './slices/languagesSlice';
import tonesReducer from './slices/tonesSlice';
import narratorsReducer from './slices/narratorsSlice';
import literatureStylesReducer from './slices/literatureStylesSlice';
import profileReducer from './slices/profileSlice';
import booksReducer from './slices/booksSlice';
import teamsReducer from './slices/teamsSlice';

const rootReducer = combineReducers({
  categories: categoriesReducer,
  languages: languagesReducer,
  tones: tonesReducer,
  narrators: narratorsReducer,
  literatureStyles: literatureStylesReducer,
  profile: profileReducer,
  books: booksReducer,
  teams: teamsReducer,
});

export default rootReducer;