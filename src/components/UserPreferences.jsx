import React, { useState, useEffect } from 'react';

const UserPreferences = ({ onPreferencesChange }) => {
  const [preferences, setPreferences] = useState(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    return savedPreferences ? JSON.parse(savedPreferences) : {
      sources: [],
      categories: [],
      authors: []
    };
  });

  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    onPreferencesChange(preferences);
  }, [preferences, onPreferencesChange]);

  const handleChange = (e, type) => {
    const value = e.target.value;
    setPreferences(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value]
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Your Preferences</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Sources</h3>
          <div className="flex flex-wrap gap-2">
            {['TechCrunch', 'Wired', 'CNN'].map(source => (
              <label key={source} className="inline-flex items-center">
                <input
                  type="checkbox"
                  value={source}
                  checked={preferences.sources.includes(source)}
                  onChange={(e) => handleChange(e, 'sources')}
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
            {['Technology', 'Science', 'Politics'].map(category => (
              <label key={category} className="inline-flex items-center">
                <input
                  type="checkbox"
                  value={category}
                  checked={preferences.categories.includes(category)}
                  onChange={(e) => handleChange(e, 'categories')}
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
            {['John Doe', 'Jane Smith', 'Alice Johnson'].map(author => (
              <label key={author} className="inline-flex items-center">
                <input
                  type="checkbox"
                  value={author}
                  checked={preferences.authors.includes(author)}
                  onChange={(e) => handleChange(e, 'authors')}
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

