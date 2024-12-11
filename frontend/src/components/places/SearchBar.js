import React, { useState } from 'react';
import './SearchBar.css'; // We'll add custom styling here

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value); // You can use this to trigger the search
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for tours..."
        value={query}
        onChange={handleSearch}
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;
