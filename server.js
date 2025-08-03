const express = require('express');
const cors = require('cors');
const axios = require('axios');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Google Books API base URL
const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

// Routes

// Search books
app.get('/api/books/search', async (req, res) => {
    try {
        const { q, maxResults = 20, startIndex = 0 } = req.query;

        if (!q) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const response = await axios.get(GOOGLE_BOOKS_API, {
            params: {
                q,
                maxResults,
                startIndex,
                key: process.env.GOOGLE_BOOKS_API_KEY
            }
        });

        const books = response.data.items?.map(item => ({
            id: item.id,
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors || [],
            description: item.volumeInfo.description || '',
            categories: item.volumeInfo.categories || [],
            publishedDate: item.volumeInfo.publishedDate,
            pageCount: item.volumeInfo.pageCount,
            averageRating: item.volumeInfo.averageRating,
            ratingsCount: item.volumeInfo.ratingsCount,
            imageLinks: item.volumeInfo.imageLinks || {},
            previewLink: item.volumeInfo.previewLink,
            infoLink: item.volumeInfo.infoLink
        })) || [];

        res.json({
            books,
            totalItems: response.data.totalItems || 0
        });
    } catch (error) {
        console.error('Error searching books:', error.response?.data || error.message);
        console.error('Status:', error.response?.status);
        console.error('API Key being used:', process.env.GOOGLE_BOOKS_API_KEY ? 'Present' : 'Missing');
        res.status(500).json({
            error: 'Failed to search books',
            details: error.response?.data || error.message,
            status: error.response?.status
        });
    }
});

// Get recommendations based on category (MUST come before /:id route)
app.get('/api/books/recommendations', async (req, res) => {
    try {
        const { category = 'fiction', maxResults = 10 } = req.query;

        console.log('Recommendations request:', { category, maxResults });
        console.log('API Key present:', process.env.GOOGLE_BOOKS_API_KEY ? 'Yes' : 'No');

        // Start with the simplest query that works
        const query = category;
        console.log(`Making recommendations request with query: "${query}"`);

        const response = await axios.get(GOOGLE_BOOKS_API, {
            params: {
                q: query,
                maxResults,
                key: process.env.GOOGLE_BOOKS_API_KEY
            },
            timeout: 10000
        });

        console.log('Recommendations API response status:', response.status);
        console.log('Recommendations API response items count:', response.data.items?.length || 0);

        const books = response.data.items?.map(item => ({
            id: item.id,
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors || [],
            description: item.volumeInfo.description || '',
            categories: item.volumeInfo.categories || [],
            publishedDate: item.volumeInfo.publishedDate,
            averageRating: item.volumeInfo.averageRating,
            ratingsCount: item.volumeInfo.ratingsCount,
            imageLinks: item.volumeInfo.imageLinks || {},
            previewLink: item.volumeInfo.previewLink
        })) || [];

        console.log('Processed books count:', books.length);
        res.json({ books });
    } catch (error) {
        console.error('Error fetching recommendations:', error.response?.data || error.message);
        console.error('Status:', error.response?.status);
        console.error('Full error:', error);

        res.status(500).json({
            error: 'Failed to fetch recommendations',
            details: error.response?.data || error.message,
            status: error.response?.status,
            category: req.query.category
        });
    }
});

// Get popular books (MUST come before /:id route)
app.get('/api/books/popular', async (req, res) => {
    try {
        const { maxResults = 8 } = req.query; // Reduced from 20 to 8

        // Try multiple queries if one fails
        const queries = [
            'subject:fiction',
            'harry potter',
            'javascript programming',
            'popular books'
        ];

        let response = null;
        let lastError = null;

        for (const query of queries) {
            try {
                console.log(`Trying query: ${query}`);
                response = await axios.get(GOOGLE_BOOKS_API, {
                    params: {
                        q: query,
                        maxResults: maxResults,
                        key: process.env.GOOGLE_BOOKS_API_KEY
                    },
                    timeout: 10000 // 10 second timeout
                });
                console.log(`Success with query: ${query}`);
                break; // Success, exit loop
            } catch (error) {
                console.log(`Failed with query: ${query}, Status: ${error.response?.status}`);
                lastError = error;
                // Wait 1 second before trying next query
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        if (!response) {
            throw lastError || new Error('All queries failed');
        }

        const books = response.data.items?.map(item => ({
            id: item.id,
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors || [],
            description: item.volumeInfo.description || '',
            categories: item.volumeInfo.categories || [],
            publishedDate: item.volumeInfo.publishedDate,
            averageRating: item.volumeInfo.averageRating,
            ratingsCount: item.volumeInfo.ratingsCount,
            imageLinks: item.volumeInfo.imageLinks || {},
            previewLink: item.volumeInfo.previewLink
        })) || [];

        res.json({ books });
    } catch (error) {
        console.error('Error fetching popular books:', error.response?.data || error.message);
        console.error('Status:', error.response?.status);

        // Return empty array instead of error to prevent frontend crash
        res.json({
            books: [],
            error: 'Popular books temporarily unavailable',
            details: error.response?.status === 503 ? 'Google Books API rate limit reached' : error.message
        });
    }
});

// Get book by ID (MUST come after specific routes)
app.get('/api/books/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const response = await axios.get(`${GOOGLE_BOOKS_API}/${id}`, {
            params: {
                key: process.env.GOOGLE_BOOKS_API_KEY
            },
            timeout: 10000
        });

        const item = response.data;
        const book = {
            id: item.id,
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors || [],
            description: item.volumeInfo.description || '',
            categories: item.volumeInfo.categories || [],
            publishedDate: item.volumeInfo.publishedDate,
            pageCount: item.volumeInfo.pageCount,
            averageRating: item.volumeInfo.averageRating,
            ratingsCount: item.volumeInfo.ratingsCount,
            imageLinks: item.volumeInfo.imageLinks || {},
            previewLink: item.volumeInfo.previewLink,
            infoLink: item.volumeInfo.infoLink,
            language: item.volumeInfo.language,
            publisher: item.volumeInfo.publisher
        };

        res.json(book);
    } catch (error) {
        console.error('Error fetching book:', error.response?.data || error.message);
        console.error('Status:', error.response?.status);
        console.error('Book ID requested:', req.params.id);
        console.error('API Key present:', process.env.GOOGLE_BOOKS_API_KEY ? 'Yes' : 'No');

        res.status(500).json({
            error: 'Failed to fetch book details',
            details: error.response?.data || error.message,
            status: error.response?.status,
            bookId: req.params.id
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Read This Next API is running' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
