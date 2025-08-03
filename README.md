# ReadThisNext

A modern book recommendation website that helps you discover your next great read using the Google Books API.

## Features

- 🔍 **Smart Search**: Search through millions of books
- 📚 **Category Browse**: Explore books by genre
- ⭐ **Personalized Recommendations**: Get book suggestions based on categories
- 📖 **Detailed Book Info**: View comprehensive book details including ratings, descriptions, and previews
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices

## Tech Stack

### Backend
- Node.js with Express
- Google Books API integration
- CORS and security middleware
- Rate limiting
- Environment-based configuration

### Frontend
- React 18+ with functional components and hooks
- React Router for navigation
- Axios for API calls
- Modern CSS with responsive design
- Component-based architecture

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Google Books API Key (free from Google Cloud Console)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/adamlg1/readthisnext.git
   cd readthisnext
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Set up environment variables**
   
   Copy `.env.example` to `.env` and add your Google Books API key:
   ```
   GOOGLE_BOOKS_API_KEY=your_actual_api_key_here
   PORT=5000
   NODE_ENV=development
   ```

5. **Get a Google Books API Key**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the Books API
   - Create credentials (API Key)
   - Copy the API key to your `.env` file

### Running the Application

#### Development Mode (both frontend and backend)
```bash
npm run dev:full
```

#### Run Backend Only
```bash
npm run dev
# or
npm run server
```

#### Run Frontend Only
```bash
npm run client
```

#### Production Build
```bash
npm run build
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Books
- `GET /api/books/search?q={query}` - Search books
- `GET /api/books/:id` - Get book details
- `GET /api/books/recommendations?category={category}` - Get recommendations
- `GET /api/books/popular` - Get popular books

### Health
- `GET /api/health` - API health check

## Project Structure

```
readthisnext/
├── server.js              # Backend server
├── package.json           # Backend dependencies
├── .env                   # Environment variables
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service functions
│   │   └── App.js         # Main app component
│   └── package.json       # Frontend dependencies
└── README.md
```

## Usage

1. **Search Books**: Use the search bar to find books by title, author, or keywords
2. **Browse Categories**: Click on category cards to explore specific genres
3. **View Details**: Click on any book card to see detailed information
4. **Get Recommendations**: Visit the recommendations page to discover books by category

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Google Books API for providing book data
- React team for the amazing framework
- All contributors and users of this project