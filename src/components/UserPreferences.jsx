import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setPreferences } from "../store/preferencesSlice";
import { fetchNews } from "../store/newsSlice";

const UserPreferences = () => {
  const dispatch = useDispatch();
  const { sources, categories, authors } = useSelector((state) => state.news);
  const preferences = useSelector((state) => state.preferences);
  const [localPreferences, setLocalPreferences] = useState(preferences);

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
    setLocalPreferences(updatedPreferences);
    dispatch(setPreferences(updatedPreferences));
    dispatch(
      fetchNews({
        country: preferences.country,
        category: updatedPreferences.categories[0] || "",
        page: 1,
        pageSize: 10,
      })
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Your Preferences</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Sources</h3>
          <div className="flex flex-wrap gap-2">
            {sources.map((source) => (
              <label key={source} className="inline-flex items-center">
                <input
                  type="checkbox"
                  value={source}
                  checked={localPreferences.sources.includes(source)}
                  onChange={(e) => handleChange(e, "sources")}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2">{source}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <label key={category} className="inline-flex items-center">
                <input
                  type="checkbox"
                  value={category}
                  checked={localPreferences.categories.includes(category)}
                  onChange={(e) => handleChange(e, "categories")}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2">{category}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Authors</h3>
          <div className="flex flex-wrap gap-2">
            {authors.map((author) => (
              <label key={author} className="inline-flex items-center">
                <input
                  type="checkbox"
                  value={author}
                  checked={localPreferences.authors.includes(author)}
                  onChange={(e) => handleChange(e, "authors")}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2">{author}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPreferences;
