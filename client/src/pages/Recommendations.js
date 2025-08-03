import React, { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';
import { bookService } from '../services/bookService';

const Recommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('fiction');

    const categories = [
        { value: 'fiction', label: 'Fiction', icon: '📖' },
        { value: 'science fiction', label: 'Science Fiction', icon: '🚀' },
        { value: 'mystery', label: 'Mystery', icon: '🔍' },
        { value: 'romance', label: 'Romance', icon: '💕' },
        { value: 'biography', label: 'Biography', icon: '👤' },
        { value: 'history', label: 'History', icon: '🏛️' },
        { value: 'self help', label: 'Self Help', icon: '💪' },
        { value: 'business', label: 'Business', icon: '💼' },
        { value: 'fantasy', label: 'Fantasy', icon: '🧙‍♂️' },
        { value: 'thriller', label: 'Thriller', icon: '😱' },
        { value: 'health', label: 'Health', icon: '🏥' },
        { value: 'cooking', label: 'Cooking', icon: '👨‍🍳' }
    ];

    useEffect(() => {
        fetchRecommendations(selectedCategory);
    }, [selectedCategory]);

    const fetchRecommendations = async (category) => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching recommendations for category:', category);
            const data = await bookService.getRecommendations(category, 20);
            console.log('Received recommendations data:', data);
            setRecommendations(data.books || []);

            // If we got an error message from the backend, show it
            if (data.error && data.books?.length === 0) {
                setError(data.error);
            }
        } catch (err) {
            console.error('Error in fetchRecommendations:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ marginBottom: '1rem' }}>Book Recommendations</h1>
                <p style={{ color: '#666', fontSize: '1.1rem' }}>
                    Discover great books curated by category. Select a genre below to see our recommendations.
                </p>
            </div>

            {/* Category Selector */}
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>Choose a Category</h2>
                <div className="category-grid">
                    {categories.map((category) => (
                        <button
                            key={category.value}
                            onClick={() => handleCategoryChange(category.value)}
                            className={`category-card ${selectedCategory === category.value ? 'active' : ''}`}
                            style={{
                                border: 'none',
                                backgroundColor: selectedCategory === category.value ? '#667eea' : 'white',
                                color: selectedCategory === category.value ? 'white' : '#333',
                                transform: selectedCategory === category.value ? 'translateY(-3px)' : 'none'
                            }}
                        >
                            <div className="category-icon">{category.icon}</div>
                            <h3>{category.label}</h3>
                        </button>
                    ))}
                </div>
            </div>

            {/* Recommendations */}
            <div>
                <h2 style={{ marginBottom: '1rem' }}>
                    {categories.find(cat => cat.value === selectedCategory)?.label} Recommendations
                </h2>

                {loading && <div className="loading">Loading recommendations...</div>}
                {error && (
                    <div className="error">
                        {error}
                        <br />
                        <small>Try selecting a different category or search for specific books instead.</small>
                    </div>
                )}

                {!loading && !error && recommendations.length === 0 && (
                    <div className="error">
                        No recommendations found for "{categories.find(cat => cat.value === selectedCategory)?.label}".
                        <br />
                        Try selecting a different category or use the search function instead.
                    </div>
                )}

                {!loading && recommendations.length > 0 && (
                    <div className="book-grid">
                        {recommendations.map((book) => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Recommendations;
