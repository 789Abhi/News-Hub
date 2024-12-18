import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setPreferences } from "../store/preferencesSlice";
import { fetchNews } from "../store/newsSlice";
import { ChevronDown, ChevronUp, Filter, Trash2 } from "lucide-react";
import debounce from 'lodash/debounce';

const PreferenceSection = ({ 
  title, 
  items, 
  selectedItems, 
  onItemToggle, 
  maxInitialDisplay = 10 
}) => {
  const [showAll, setShowAll] = useState(false);
  const displayedItems = showAll ? items : items.slice(0, maxInitialDisplay);

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">{title}</h2>
      <div className="grid grid-cols-2 gap-2">
        {displayedItems.map((item) => (
          <label 
            key={item} 
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              value={item}
              checked={selectedItems.includes(item)}
              onChange={(e) => onItemToggle(e, title.toLowerCase())}
              className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700 truncate">{item}</span>
          </label>
        ))}
      </div>
      {items.length > maxInitialDisplay && (
        <div className="flex justify-center mt-3">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            {showAll ? (
              <>
                <ChevronUp className="mr-1" size={16} />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="mr-1" size={16} />
                Show More
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

const UserPreferences = () => {
  const dispatch = useDispatch();
  const { sources, categories, authors } = useSelector((state) => state.news);
  const preferences = useSelector((state) => state.preferences);
  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);

  // Debounced fetch news function
  const debouncedFetchNews = useCallback(
    debounce((updatedPreferences) => {
      dispatch(
        fetchNews({
          country: preferences.country,
          category: updatedPreferences.categories[0] || "",
          page: 1,
          pageSize: 10,
        })
      );
    }, 300),
    [dispatch, preferences.country]
  );

  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  const handleChange = (e, type) => {
    const value = e.target.value;
    const updatedPreferences = {
      ...localPreferences,
      [type]: localPreferences[type].includes(value)
        ? localPreferences[type].filter((item) => item !== value)
        : [...localPreferences[type], value],
    };

    // Update local state
    setLocalPreferences(updatedPreferences);

    // Dispatch updated preferences
    dispatch(setPreferences(updatedPreferences));

    // Debounced news fetch
    debouncedFetchNews(updatedPreferences);
  };

  const handleClearPreferences = () => {
    // Create a default preferences object with empty arrays
    const defaultPreferences = {
      sources: [],
      categories: [],
      authors: [],
      country: preferences.country // Keep the country unchanged
    };

    // Update local state
    setLocalPreferences(defaultPreferences);

    // Dispatch to Redux store
    dispatch(setPreferences(defaultPreferences));

    // Fetch news with default preferences
    dispatch(
      fetchNews({
        country: preferences.country,
        category: "", // No category selected
        page: 1,
        pageSize: 10,
      })
    );

    // Close mobile dropdown if open
    setIsMobileDropdownOpen(false);
  };

  return (
    <div className="container mx-auto px-4 lg:py-6 py-0 ">
      {/* Mobile Dropdown Toggle Button - Hidden on Desktop */}
      <button 
        onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
        className="lg:hidden fixed bottom-4 right-4 bg-blue-600 text-white rounded-full p-3 shadow-lg z-50 flex items-center"
      >
        <Filter size={24} className="mr-2" />
        {isMobileDropdownOpen ? "Close Filters" : "Open Filters"}
      </button>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl lg:block font-bold text-gray-900 mb-6 hidden">
          Your News Preferences
        </h1>
        
        {/* Clear Preferences Button */}
        <button 
          onClick={handleClearPreferences}
          className="hidden lg:flex items-center text-red-600 hover:text-red-800 transition-colors mb-4"
        >
          <Trash2 size={20} className="mr-2" />
          Clear All Preferences
        </button>
      </div>

      {/* Preferences Container - Responsive Display */}
      <div className={`
        ${isMobileDropdownOpen ? 'block' : 'hidden lg:block'}
        fixed lg:static inset-0 lg:inset-auto 
        bg-white lg:bg-transparent 
        z-40 lg:z-auto 
        overflow-y-auto lg:overflow-visible 
        pt-16 lg:pt-0 px-4 lg:px-0
      `}>
        <div className="lg:static bg-white lg:bg-transparent p-4 lg:p-0 rounded-lg lg:rounded-none shadow-lg lg:shadow-none">
          <PreferenceSection
            title="Sources"
            items={sources}
            selectedItems={localPreferences.sources}
            onItemToggle={handleChange}
          />

          <PreferenceSection
            title="Categories"
            items={categories}
            selectedItems={localPreferences.categories}
            onItemToggle={handleChange}
          />

          <PreferenceSection
            title="Authors"
            items={authors}
            selectedItems={localPreferences.authors}
            onItemToggle={handleChange}
          />

          {/* Clear Preferences Button for Mobile */}
          <div className="lg:hidden text-center mt-4">
            <button 
              onClick={handleClearPreferences}
              className="flex items-center justify-center w-full bg-red-600 text-white px-4 py-2 rounded-lg mb-4"
            >
              <Trash2 size={20} className="mr-2" />
              Clear All Preferences
            </button>
          </div>

          {/* Close button for mobile */}
          <div className="lg:hidden text-center mt-4">
            <button 
              onClick={() => setIsMobileDropdownOpen(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Close Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPreferences;