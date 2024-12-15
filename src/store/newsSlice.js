import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const NEWS_API_KEY = import.meta.env.VITE_API_KEY;
const NYT_API_KEY = import.meta.env.VITE_NYT_API_KEY;
const GUARDIAN_API_KEY = import.meta.env.VITE_GUARDIAN_API_KEY;

const NEWS_API_ROOT = 'https://newsapi.org/v2';
const NYT_API_ROOT = 'https://api.nytimes.com/svc/topstories/v2';
const GUARDIAN_API_ROOT = 'https://content.guardianapis.com';

export const fetchNews = createAsyncThunk(
  'news/fetchNews',
  async (params, { getState }) => {
    const { preferences } = getState();
    const { country, category, page, pageSize, q, source } = params;

    try {
      const newsApiUrl = `${NEWS_API_ROOT}/top-headlines?country=${country}&category=${category}&page=${page}&pageSize=${pageSize}&q=${q}&apiKey=${NEWS_API_KEY}`;
      const nytUrl = `${NYT_API_ROOT}/home.json?api-key=${NYT_API_KEY}`;
      const guardianUrl = `${GUARDIAN_API_ROOT}/search?api-key=${GUARDIAN_API_KEY}&page=${page}&page-size=${pageSize}&q=${q}`;

      const [newsApiResponse, nytResponse, guardianResponse] = await Promise.allSettled([
        axios.get(newsApiUrl),
        axios.get(nytUrl),
        axios.get(guardianUrl),
      ]);

      const newsApiArticles = newsApiResponse.status === 'fulfilled' 
        ? newsApiResponse.value.data.articles.map((article) => ({
            ...article,
            source: article.source.name,
            category: category || 'General',
          }))
        : [];

      const nytArticles = nytResponse.status === 'fulfilled'
        ? nytResponse.value.data.results.map((article) => ({
            title: article.title,
            description: article.abstract,
            url: article.url,
            urlToImage: article.multimedia?.[0]?.url,
            publishedAt: article.published_date,
            author: article.byline,
            source: 'New York Times',
            category: article.section,
          }))
        : [];

      const guardianArticles = guardianResponse.status === 'fulfilled'
        ? guardianResponse.value.data.response.results.map((article) => ({
            title: article.webTitle,
            description: article.fields?.trailText,
            url: article.webUrl,
            urlToImage: article.fields?.thumbnail,
            publishedAt: article.webPublicationDate,
            author: article.fields?.byline,
            source: 'The Guardian',
            category: article.sectionName,
          }))
        : [];

      let allArticles = [...newsApiArticles, ...nytArticles, ...guardianArticles];

      // Enhanced keyword filtering (case-insensitive, search in title and description)
      if (q) {
        const lowercaseKeyword = q.toLowerCase();
        allArticles = allArticles.filter(article => 
          (article.title && article.title.toLowerCase().includes(lowercaseKeyword)) ||
          (article.description && article.description.toLowerCase().includes(lowercaseKeyword))
        );
      }

      // Existing preference and source filtering
      if (preferences.sources.length > 0) {
        allArticles = allArticles.filter(article => preferences.sources.includes(article.source));
      }
      if (source) {
        allArticles = allArticles.filter(article => article.source === source);
      }
      if (preferences.categories.length > 0) {
        allArticles = allArticles.filter(article => preferences.categories.includes(article.category));
      }
      if (preferences.authors.length > 0) {
        allArticles = allArticles.filter(article => preferences.authors.includes(article.author));
      }

      // Sort articles by publishedAt date
      allArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

      // Extract unique sources, categories, and authors
      const sources = [...new Set(allArticles.map(article => article.source))];
      const categories = [...new Set(allArticles.map(article => article.category))];
      const authors = [...new Set(allArticles.map(article => article.author).filter(Boolean))];

      return {
        articles: allArticles.slice(0, pageSize),
        totalResults: allArticles.length,
        sources,
        categories,
        authors,
      };
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  }
);

const newsSlice = createSlice({
  name: 'news',
  initialState: {
    articles: [],
    status: 'idle',
    error: null,
    totalResults: 0,
    sources: [],
    categories: [],
    authors: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.articles = action.payload.articles;
        state.totalResults = action.payload.totalResults;
        state.sources = action.payload.sources;
        state.categories = action.payload.categories;
        state.authors = action.payload.authors;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default newsSlice.reducer;
