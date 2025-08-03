import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
    const {
        id,
        title,
        authors = [],
        description = '',
        imageLinks = {},
        averageRating,
        ratingsCount
    } = book;

    const thumbnail = imageLinks.thumbnail || imageLinks.smallThumbnail || '/api/placeholder/200/300';

    const renderStars = (rating) => {
        if (!rating) return null;
        const stars = Math.round(rating);
        return '★'.repeat(stars) + '☆'.repeat(5 - stars);
    };

    return (
        <Link to={`/book/${id}`} className="book-card">
            <img
                src={thumbnail}
                alt={title}
                className="book-image"
                onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200x300/f0f0f0/666?text=No+Image';
                }}
            />
            <h3 className="book-title">{title}</h3>
            <p className="book-authors">
                {authors.length > 0 ? `by ${authors.join(', ')}` : 'Unknown Author'}
            </p>
            {averageRating && (
                <div className="book-rating">
                    <span className="stars">{renderStars(averageRating)}</span>
                    <span>({ratingsCount || 0})</span>
                </div>
            )}
            {description && (
                <p className="book-description">
                    {description.replace(/<[^>]*>/g, '').substring(0, 150)}...
                </p>
            )}
        </Link>
    );
};

export default BookCard;
