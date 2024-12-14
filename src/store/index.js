import { configureStore } from '@reduxjs/toolkit';
import newsReducer from './newsSlice';
import preferencesReducer from './preferencesSlice';

export const store = configureStore({
  reducer: {
    news: newsReducer,
    preferences: preferencesReducer,
  },
});

