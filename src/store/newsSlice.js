import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchNews = createAsyncThunk(
  'news/fetchNews',
  async (params, { getState }) => {
    const { preferences } = getState();
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        ...params,
        country: preferences.country,
        apiKey: 'ce63969e6dd344fe9c04703a5751e7f4', 
      },
    });
    return response.data.articles;
  }
);

const newsSlice = createSlice({
  name: 'news',
  initialState: {
    articles: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.articles = action.payload;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default newsSlice.reducer;

