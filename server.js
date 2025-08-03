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

// Get book by ID
app.get('/api/books/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const response = await axios.get(`${GOOGLE_BOOKS_API}/${id}`, {
            params: {
                key: process.env.GOOGLE_BOOKS_API_KEY
            }
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
        console.error('Error fetching book:', error.message);
        res.status(500).json({ error: 'Failed to fetch book details' });
    }
});

// Get recommendations based on category
app.get('/api/books/recommendations', async (req, res) => {
    try {
        const { category = 'fiction', maxResults = 10 } = req.query;

        const response = await axios.get(GOOGLE_BOOKS_API, {
            params: {
                q: `subject:${category}`,
                orderBy: 'relevance',
                maxResults,
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
            averageRating: item.volumeInfo.averageRating,
            ratingsCount: item.volumeInfo.ratingsCount,
            imageLinks: item.volumeInfo.imageLinks || {},
            previewLink: item.volumeInfo.previewLink
        })) || [];

        res.json({ books });
    } catch (error) {
        console.error('Error fetching recommendations:', error.message);
        res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
});

// Get popular books (bestsellers)
app.get('/api/books/popular', async (req, res) => {
    try {
        const { maxResults = 20 } = req.query;

        const response = await axios.get(GOOGLE_BOOKS_API, {
            params: {
                q: 'bestseller',
                orderBy: 'relevance',
                maxResults,
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
            averageRating: item.volumeInfo.averageRating,
            ratingsCount: item.volumeInfo.ratingsCount,
            imageLinks: item.volumeInfo.imageLinks || {},
            previewLink: item.volumeInfo.previewLink
        })) || [];

        res.json({ books });
    } catch (error) {
        console.error('Error fetching popular books:', error.message);
        res.status(500).json({ error: 'Failed to fetch popular books' });
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
