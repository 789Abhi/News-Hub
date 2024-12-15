import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchNews } from "../store/newsSlice";
import ArticleList from "../components/ArticleList";
import SearchFilters from "../components/SearchFilters";
import { RefreshCw, AlertTriangle } from "lucide-react";

const Search = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { articles, status, error } = useSelector((state) => state.news);
  const preferences = useSelector((state) => state.preferences);

  const [filters, setFilters] = useState({
    keyword: "",
    startDate: "",
    endDate: "",
    source: "",
    category: "",
  });

  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  useEffect(() => {
    const keyword = queryParams.get("q") || "";
    setFilters((prevFilters) => ({ ...prevFilters, keyword }));
  }, [queryParams]);

  const handleSearch = () => {
    dispatch(
      fetchNews({
        q: filters.keyword,
        country: preferences.country,
        category: filters.category,
        source: filters.source,
        page: 1,
        pageSize: 20,
      })
    );
  };

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const dateMatch =
        (!filters.startDate ||
          new Date(article.publishedAt) >= new Date(filters.startDate)) &&
        (!filters.endDate ||
          new Date(article.publishedAt) <= new Date(filters.endDate));
      const sourceMatch = !filters.source || article.source === filters.source;
      const categoryMatch =
        !filters.category || article.category === filters.category;
      return dateMatch && sourceMatch && categoryMatch;
    });
  }, [articles, filters]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <RefreshCw
            className="mx-auto mb-4 animate-spin text-blue-500"
            size={48}
          />
          <p className="text-xl text-gray-700">Searching for news...</p>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-xl text-center">
          <div className="bg-red-100 p-4 rounded-full inline-block">
            <AlertTriangle className="text-red-500 mx-auto" size={48} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Oops! Something Went Wrong
            </h2>
            <p className="text-gray-600 mb-6">
              We're having trouble fetching the news. Error: {error}
            </p>
            <button
              onClick={handleSearch}
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
            >
              <RefreshCw className="mr-2" size={20} />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
        Search Articles
      </h1>
      <SearchFilters
        filters={filters}
        setFilters={setFilters}
        onSearch={handleSearch}
      />
      <ArticleList articles={filteredArticles} />
    </div>
  );
};

export default Search;
