import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { bookService } from '../services/bookService';

const BookDetails = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBookDetails();
    }, [id]);

    const fetchBookDetails = async () => {
        try {
            setLoading(true);
            const bookData = await bookService.getBookById(id);
            setBook(bookData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating) => {
        if (!rating) return null;
        const stars = Math.round(rating);
        return '★'.repeat(stars) + '☆'.repeat(5 - stars);
    };

    if (loading) return <div className="loading">Loading book details...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!book) return <div className="error">Book not found</div>;

    const {
        title,
        authors = [],
        description = '',
        imageLinks = {},
        averageRating,
        ratingsCount,
        pageCount,
        publishedDate,
        publisher,
        categories = [],
        previewLink,
        infoLink
    } = book;

    const thumbnail = imageLinks.thumbnail || imageLinks.smallThumbnail;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: '2rem',
                marginBottom: '2rem'
            }}>
                <div>
                    {thumbnail && (
                        <img
                            src={thumbnail}
                            alt={title}
                            style={{
                                width: '300px',
                                height: 'auto',
                                borderRadius: '10px',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                            }}
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/300x400/f0f0f0/666?text=No+Image';
                            }}
                        />
                    )}
                </div>

                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#333' }}>
                        {title}
                    </h1>

                    {authors.length > 0 && (
                        <p style={{ fontSize: '1.3rem', color: '#666', marginBottom: '1rem' }}>
                            by {authors.join(', ')}
                        </p>
                    )}

                    {averageRating && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ fontSize: '1.5rem', color: '#ffa500' }}>
                                {renderStars(averageRating)}
                            </div>
                            <span style={{ fontSize: '1.1rem', color: '#666' }}>
                                {averageRating}/5 ({ratingsCount || 0} ratings)
                            </span>
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                        {pageCount && (
                            <div>
                                <strong>Pages:</strong> {pageCount}
                            </div>
                        )}
                        {publishedDate && (
                            <div>
                                <strong>Published:</strong> {publishedDate}
                            </div>
                        )}
                        {publisher && (
                            <div>
                                <strong>Publisher:</strong> {publisher}
                            </div>
                        )}
                        {categories.length > 0 && (
                            <div>
                                <strong>Categories:</strong> {categories.join(', ')}
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                        {previewLink && (
                            <a
                                href={previewLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="search-button"
                                style={{ textDecoration: 'none', display: 'inline-block' }}
                            >
                                Preview Book
                            </a>
                        )}
                        {infoLink && (
                            <a
                                href={infoLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="search-button"
                                style={{
                                    textDecoration: 'none',
                                    display: 'inline-block',
                                    background: '#28a745'
                                }}
                            >
                                More Info
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {description && (
                <div style={{
                    background: 'white',
                    padding: '2rem',
                    borderRadius: '10px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ marginBottom: '1rem' }}>Description</h2>
                    <div
                        style={{ lineHeight: '1.6', fontSize: '1.1rem' }}
                        dangerouslySetInnerHTML={{
                            __html: description.replace(/\n/g, '<br>')
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default BookDetails;
