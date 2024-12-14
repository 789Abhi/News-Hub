import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCountry } from '../store/preferencesSlice';
import { debounce } from 'lodash';

const countries = [
  { code: 'us', name: 'United States' },
  { code: 'gb', name: 'United Kingdom' },
  { code: 'ca', name: 'Canada' },
  { code: 'au', name: 'Australia' },
  // Add more countries as needed
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedCountry = useSelector(state => state.preferences.country);

  const handleSearch = debounce(() => {
    navigate(`/search?q=${searchTerm}`);
  }, 300);

  const handleCountryChange = (e) => {
    dispatch(setCountry(e.target.value));
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center">
        <Link to="/" className="text-2xl font-bold">NewsHub</Link>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search news..."
            className="p-2 rounded text-black"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleSearch();
            }}
          />
          <select
            value={selectedCountry}
            onChange={handleCountryChange}
            className="p-2 rounded text-black"
          >
            {countries.map(country => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
          <img
            src={`https://flagcdn.com/w20/${selectedCountry}.png`}
            alt={`${selectedCountry} flag`}
            className="w-6 h-4"
          />
        </div>
        <button 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>
      {isMenuOpen && (
        <div className="md:hidden">
          <Link to="/" className="block py-2 px-4 text-sm hover:bg-blue-700" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/search" className="block py-2 px-4 text-sm hover:bg-blue-700" onClick={() => setIsMenuOpen(false)}>Search</Link>
        </div>
      )}
    </header>
  );
};

export default Header;

