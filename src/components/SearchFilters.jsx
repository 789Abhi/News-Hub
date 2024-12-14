import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPreferences, clearPreferences } from '../store/preferencesSlice';

const SearchFilters = ({ filters, setFilters }) => {
  const dispatch = useDispatch();
  const preferences = useSelector(state => state.preferences);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handlePreferenceChange = (e) => {
    const { name, value, checked } = e.target;
    let updatedPreferences;
    if (checked) {
      updatedPreferences = { ...preferences, [name]: [...preferences[name], value] };
    } else {
      updatedPreferences = { ...preferences, [name]: preferences[name].filter(item => item !== value) };
    }
    dispatch(setPreferences(updatedPreferences));
  };

  const handleResetFilters = () => {
    setFilters({
      keyword: '',
      startDate: '',
      endDate: '',
      source: '',
      category: '',
    });
  };

  const handleClearPreferences = () => {
    dispatch(clearPreferences());
  };

  const sources = ["TechCrunch", "Wired", "CNN"];
  const categories = ["Space", "Technology", "Environment", "Health", "Science"];

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
          />
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
        </div>
        <select
          name="source"
          value={filters.source}
          onChange={handleChange}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        >
          <option value="">All Sources</option>
          {sources.map(source => (
            <option key={source} value={source}>{source}</option>
          ))}
        </select>
        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div className="mt-4">
        <h3 className="text-white font-semibold mb-2">Preferences</h3>
        <div className="flex flex-wrap gap-2">
          {sources.map(source => (
            <label key={source} className="inline-flex items-center">
              <input
                type="checkbox"
                name="sources"
                value={source}
                checked={preferences.sources.includes(source)}
                onChange={handlePreferenceChange}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-white">{source}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        <button
          onClick={handleResetFilters}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Reset Filters
        </button>
        <button
          onClick={handleClearPreferences}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
        >
          Clear Preferences
        </button>
      </div>
    </div>
  );
};

export default React.memo(SearchFilters);

