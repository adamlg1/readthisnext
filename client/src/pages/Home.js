import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import BookCard from '../components/BookCard';
import { bookService } from '../services/bookService';

const Home = () => {
    const [popularBooks, setPopularBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const categories = [
        { name: 'Fiction', icon: '📖', query: 'fiction' },
        { name: 'Science Fiction', icon: '🚀', query: 'science fiction' },
        { name: 'Mystery', icon: '🔍', query: 'mystery' },
        { name: 'Romance', icon: '💕', query: 'romance' },
        { name: 'Biography', icon: '👤', query: 'biography' },
        { name: 'History', icon: '🏛️', query: 'history' },
        { name: 'Self Help', icon: '💪', query: 'self help' },
        { name: 'Business', icon: '💼', query: 'business' }
    ];

    useEffect(() => {
        fetchPopularBooks();
    }, []);

    const fetchPopularBooks = async () => {
        try {
            setLoading(true);
            const data = await bookService.getPopularBooks(8);
            setPopularBooks(data.books || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Hero Section */}
            <section className="hero">
                <h1>Discover Your Next Great Read</h1>
                <p>
                    Find book recommendations tailored to your taste. Search through millions of books
                    and discover hidden gems across all genres.
                </p>
                <SearchBar placeholder="What kind of book are you looking for?" />
            </section>

            {/* Categories */}
            <section className="categories">
                <h2>Browse by Category</h2>
                <div className="category-grid">
                    {categories.map((category) => (
                        <Link
                            key={category.name}
                            to={`/search?q=${encodeURIComponent(category.query)}`}
                            className="category-card"
                        >
                            <div className="category-icon">{category.icon}</div>
                            <h3>{category.name}</h3>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Popular Books */}
            <section>
                <h2>Popular Books</h2>
                {loading && <div className="loading">Loading popular books...</div>}
                {error && <div className="error">{error}</div>}
                {!loading && !error && popularBooks.length === 0 && (
                    <div className="error">
                        Popular books temporarily unavailable. Try searching for specific books instead!
                    </div>
                )}
                {!loading && !error && popularBooks.length > 0 && (
                    <div className="book-grid">
                        {popularBooks.slice(0, 8).map((book) => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
