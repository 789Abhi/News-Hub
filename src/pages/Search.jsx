import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { fetchNews } from '../store/newsSlice';
import ArticleList from '../components/ArticleList';
import SearchFilters from '../components/SearchFilters';

const Search = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { articles, status, error } = useSelector(state => state.news);
  const preferences = useSelector(state => state.preferences);

  const [filters, setFilters] = useState({
    keyword: '',
    startDate: '',
    endDate: '',
    source: '',
    category: '',
  });

  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  useEffect(() => {
    const keyword = queryParams.get('q') || '';
    setFilters(prevFilters => ({ ...prevFilters, keyword }));
  }, [queryParams]);

  useEffect(() => {
    dispatch(fetchNews({ q: filters.keyword }));
  }, [dispatch, filters.keyword, preferences.country]);

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const dateMatch = (!filters.startDate || new Date(article.publishedAt) >= new Date(filters.startDate)) &&
                        (!filters.endDate || new Date(article.publishedAt) <= new Date(filters.endDate));
      const sourceMatch = !filters.source || article.source.name === filters.source;
      const categoryMatch = !filters.category || article.category === filters.category;
      return dateMatch && sourceMatch && categoryMatch;
    });
  }, [articles, filters]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Search Articles</h1>
      <SearchFilters filters={filters} setFilters={setFilters} />
      <ArticleList articles={filteredArticles} />
    </div>
  );
};

export default Search;

