import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import BookCard from '../components/BookCard';
import { bookService } from '../services/bookService';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalItems, setTotalItems] = useState(0);
    const [currentQuery, setCurrentQuery] = useState('');

    const query = searchParams.get('q');

    useEffect(() => {
        if (query && query !== currentQuery) {
            setCurrentQuery(query);
            searchBooks(query);
        }
    }, [query, currentQuery]);

    const searchBooks = async (searchQuery, startIndex = 0) => {
        try {
            setLoading(true);
            setError(null);
            const data = await bookService.searchBooks(searchQuery, 20, startIndex);

            if (startIndex === 0) {
                setBooks(data.books || []);
            } else {
                setBooks(prevBooks => [...prevBooks, ...(data.books || [])]);
            }

            setTotalItems(data.totalItems || 0);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (newQuery) => {
        setCurrentQuery(newQuery);
        searchBooks(newQuery);
    };

    const loadMore = () => {
        if (!loading && books.length < totalItems) {
            searchBooks(currentQuery, books.length);
        }
    };

    return (
        <div>
            <SearchBar
                onSearch={handleSearch}
                placeholder="Search for books..."
            />

            {currentQuery && (
                <div style={{ marginBottom: '2rem' }}>
                    <h2>Search Results for "{currentQuery}"</h2>
                    {totalItems > 0 && (
                        <p>Found {totalItems.toLocaleString()} results</p>
                    )}
                </div>
            )}

            {loading && books.length === 0 && (
                <div className="loading">Searching for books...</div>
            )}

            {error && <div className="error">{error}</div>}

            {!loading && !error && currentQuery && books.length === 0 && (
                <div className="error">
                    No books found for "{currentQuery}". Try different keywords.
                </div>
            )}

            {books.length > 0 && (
                <>
                    <div className="book-grid">
                        {books.map((book) => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>

                    {books.length < totalItems && (
                        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                            <button
                                onClick={loadMore}
                                disabled={loading}
                                className="search-button"
                                style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}
                            >
                                {loading ? 'Loading...' : 'Load More Books'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default SearchResults;
