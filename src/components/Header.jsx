import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { debounce } from "lodash";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = debounce(() => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm}`);
    }
  }, 300);

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex flex-col justify-center items-center gap-4">
        {/* Logo */}
        <div>
          <Link to="/" className="text-3xl font-bold">
            NewsHub
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex items-center w-full max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search news..."
            className="flex-grow p-3 rounded-l-md text-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
