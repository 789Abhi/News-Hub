import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { debounce } from "lodash";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Sync search term with URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get("q") || "";
    setSearchTerm(keyword);
  }, [location.search]);

  const handleSearch = debounce(() => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/search');
    }
  }, 300);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className="bg-blue-600 text-white shadow-md sticky top-0">
      <nav className="container mx-auto px-4 py-4 flex flex-col justify-center items-center gap-4">
        <div>
          <Link to="/" className="text-3xl font-bold">
            NewsHub
          </Link>
        </div>

        <div className="flex items-center w-full max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search news..."
            className="flex-grow p-3 rounded-l-md text-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-3 rounded-r-md"
            onClick={() => handleSearch()}
          >
            Search
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;