import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

export const bookService = {
    // Search books
    searchBooks: async (query, maxResults = 20, startIndex = 0) => {
        try {
            const response = await api.get('/books/search', {
                params: { q: query, maxResults, startIndex }
            });
            return response.data;
        } catch (error) {
            console.error('Error searching books:', error);
            throw new Error('Failed to search books. Please try again.');
        }
    },

    // Get book by ID
    getBookById: async (id) => {
        try {
            const response = await api.get(`/books/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching book:', error);
            throw new Error('Failed to fetch book details. Please try again.');
        }
    },

    // Get recommendations
    getRecommendations: async (category = 'fiction', maxResults = 10) => {
        try {
            const response = await api.get('/books/recommendations', {
                params: { category, maxResults }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            throw new Error('Failed to fetch recommendations. Please try again.');
        }
    },

    // Get popular books
    getPopularBooks: async (maxResults = 20) => {
        try {
            const response = await api.get('/books/popular', {
                params: { maxResults }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching popular books:', error);
            throw new Error('Failed to fetch popular books. Please try again.');
        }
    }
};

export default bookService;
