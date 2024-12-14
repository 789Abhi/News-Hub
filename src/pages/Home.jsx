import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import ArticleList from '../components/ArticleList';
import UserPreferences from '../components/UserPreferences';
import { fetchNews } from '../store/newsSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { articles: fetchedArticles, status, error } = useSelector((state) => state.news);
  
  const [preferences, setPreferences] = useState({
    sources: [],
    categories: [],
    authors: []
  });

  // Fetch news when component mounts
  useEffect(() => {
    dispatch(fetchNews({
      pageSize: 10
    }));
  }, [dispatch]);

  // Filter articles based on user preferences
  const filteredArticles = fetchedArticles.filter(article => {
    const sourceMatch = preferences.sources.length === 0 || 
      preferences.sources.includes(article.source);
    const categoryMatch = preferences.categories.length === 0 || 
      preferences.categories.includes(article.category);
    const authorMatch = preferences.authors.length === 0 || 
      preferences.authors.includes(article.author);
    return sourceMatch && categoryMatch && authorMatch;
  });

  const handlePreferencesChange = (newPreferences) => {
    setPreferences(newPreferences);
  };

  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <RefreshCw 
            className="mx-auto mb-4 animate-spin text-blue-500" 
            size={48} 
          />
          <p className="text-xl text-gray-700">Loading your personalized news...</p>
        </div>
      </div>
    );
  }

  // Error state with a more designed approach
  if (status === 'failed') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-xl text-center">
          <div className="bg-red-100 p-4 rounded-full inline-block">
            <AlertTriangle 
              className="text-red-500 mx-auto" 
              size={48} 
            />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Oops! Something Went Wrong
            </h2>
            
            <p className="text-gray-600 mb-6">
              We're having trouble fetching the latest news right now. 
              This could be due to a temporary connection issue.
            </p>
            
            <button 
              onClick={() => dispatch(fetchNews({ pageSize: 10 }))}
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
      <h1 className="text-3xl font-bold mb-6">Your Personalized News Feed</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <ArticleList articles={filteredArticles} />
        </div>
        <div>
          <UserPreferences onPreferencesChange={handlePreferencesChange} />
        </div>
      </div>
    </div>
  );
};

export default Home;