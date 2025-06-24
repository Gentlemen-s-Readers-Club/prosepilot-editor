import { combineReducers } from '@reduxjs/toolkit';
import categoriesReducer from './slices/categoriesSlice';
import languagesReducer from './slices/languagesSlice';
import tonesReducer from './slices/tonesSlice';
import narratorsReducer from './slices/narratorsSlice';
import literatureStylesReducer from './slices/literatureStylesSlice';
import profileReducer from './slices/profileSlice';
import booksReducer from './slices/booksSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import authReducer from './slices/authSlice';
import creditPurchasesReducer from './slices/creditPurchasesSlice';

const rootReducer = combineReducers({
  categories: categoriesReducer,
  languages: languagesReducer,
  tones: tonesReducer,
  narrators: narratorsReducer,
  literatureStyles: literatureStylesReducer,
  profile: profileReducer,
  books: booksReducer,
  subscription: subscriptionReducer,
  auth: authReducer,
  creditPurchases: creditPurchasesReducer,
});

export default rootReducer;