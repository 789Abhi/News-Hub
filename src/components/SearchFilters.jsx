import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { clearSearchResults, fetchNews } from "../store/newsSlice";

const SearchFilters = ({ filters, setFilters, onSearch }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { sources, categories } = useSelector((state) => state.news);
  const preferences = useSelector((state) => state.preferences);

  // Sync with URL parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get("q") || filters.keyword;
    const source = queryParams.get("source") || filters.source;
    const category = queryParams.get("category") || filters.category;
    const startDate = queryParams.get("startDate") || filters.startDate;
    const endDate = queryParams.get("endDate") || filters.endDate;

    setFilters(prev => ({
      ...prev,
      keyword,
      source,
      category,
      startDate,
      endDate
    }));
  }, [location.search]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleResetFilters = () => {
    // Clear filters
    const resetFilters = {
      keyword: "",
      startDate: "",
      endDate: "",
      source: "",
      category: "",
    };

    // Clear URL parameters
    navigate(location.pathname, { replace: true });

    // Reset filters
    setFilters(resetFilters);

    // Fetch all news
    dispatch(fetchNews({
      country: preferences.country,
      page: 1,
      pageSize: 20,
    }));
  };

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    
    // Add all non-empty filters to URL
    if (filters.keyword) searchParams.set("q", filters.keyword);
    if (filters.source) searchParams.set("source", filters.source);
    if (filters.category) searchParams.set("category", filters.category);
    if (filters.startDate) searchParams.set("startDate", filters.startDate);
    if (filters.endDate) searchParams.set("endDate", filters.endDate);
    
    navigate(`/search?${searchParams.toString()}`, { replace: true });
    onSearch(filters);
  };

  return (
    <div className="mb-6 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <input
          type="text"
          name="keyword"
          placeholder="Search keyword"
          value={filters.keyword}
          onChange={handleChange}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        />
        <div className="flex space-x-2">
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            placeholder="Start Date"
          />
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            placeholder="End Date"
          />
        </div>
        <select
          name="source"
          value={filters.source}
          onChange={handleChange}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        >
          <option value="">All Sources</option>
          {sources.map((source) => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </select>
        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-4 flex justify-between">
        <button
          onClick={handleResetFilters}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Reset Filters
        </button>
        <button
          onClick={handleSearch}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default React.memo(SearchFilters);