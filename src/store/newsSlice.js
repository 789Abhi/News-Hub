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
    const { 
      country = 'us', 
      category = '', 
      page = 1, 
      pageSize = 10, 
      q = '', 
      source = '',
      startDate = '',
      endDate = ''
    } = params;

    try {
      const newsApiUrl = `${NEWS_API_ROOT}/top-headlines?country=${country}&category=${category}&page=${page}&pageSize=100&q=${q}&apiKey=${NEWS_API_KEY}`;
      const nytUrl = `${NYT_API_ROOT}/home.json?api-key=${NYT_API_KEY}`;
      const guardianUrl = `${GUARDIAN_API_ROOT}/search?api-key=${GUARDIAN_API_KEY}&page-size=100&q=${q}`;

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

      // Date filtering
      if (startDate || endDate) {
        allArticles = allArticles.filter(article => {
          const articleDate = new Date(article.publishedAt);
          return (!startDate || articleDate >= new Date(startDate)) &&
                 (!endDate || articleDate <= new Date(endDate));
        });
      }

      // Keyword filtering
      if (q) {
        const lowercaseKeyword = q.toLowerCase();
        allArticles = allArticles.filter(article => 
          (article.title && article.title.toLowerCase().includes(lowercaseKeyword)) ||
          (article.description && article.description.toLowerCase().includes(lowercaseKeyword))
        );
      }

      // Limit to 100 articles
      allArticles = allArticles.slice(0, 100);

      // Source and category filtering
      if (preferences.sources.length > 0) {
        allArticles = allArticles.filter(article => preferences.sources.includes(article.source));
      }
      if (source) {
        allArticles = allArticles.filter(article => article.source === source);
      }
      if (preferences.categories.length > 0) {
        allArticles = allArticles.filter(article => preferences.categories.includes(article.category));
      }

      // Sort and paginate
      allArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

      // Paginate results
      const paginatedArticles = allArticles.slice((page - 1) * pageSize, page * pageSize);

      return {
        articles: paginatedArticles,
        totalResults: allArticles.length,
        sources: [...new Set(allArticles.map(article => article.source))],
        categories: [...new Set(allArticles.map(article => article.category))],
        authors: [...new Set(allArticles.map(article => article.author).filter(Boolean))],
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
  reducers: {
    clearSearchResults: (state) => {
      state.articles = [];
      state.totalResults = 0;
    }
  },
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

export const { clearSearchResults } = newsSlice.actions;
export default newsSlice.reducer;