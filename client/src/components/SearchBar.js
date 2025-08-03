import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ onSearch, placeholder = "Search for books..." }) => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            if (onSearch) {
                onSearch(query);
            } else {
                navigate(`/search?q=${encodeURIComponent(query)}`);
            }
        }
    };

    return (
        <div className="search-container">
            <form onSubmit={handleSubmit} className="search-bar">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="search-input"
                />
                <button type="submit" className="search-button">
                    Search
                </button>
            </form>
        </div>
    );
};

export default SearchBar;
