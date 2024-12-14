import { createSlice } from '@reduxjs/toolkit';

const initialState = JSON.parse(localStorage.getItem('preferences')) || {
  country: 'us',
  sources: [],
  categories: [],
  authors: [],
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setCountry: (state, action) => {
      state.country = action.payload;
      localStorage.setItem('preferences', JSON.stringify(state));
    },
    setPreferences: (state, action) => {
      Object.assign(state, action.payload);
      localStorage.setItem('preferences', JSON.stringify(state));
    },
    clearPreferences: (state) => {
      Object.assign(state, initialState);
      localStorage.removeItem('preferences');
    },
  },
});

export const { setCountry, setPreferences, clearPreferences } = preferencesSlice.actions;

export default preferencesSlice.reducer;

