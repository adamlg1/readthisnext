#!/bin/bash

echo "🚀 Setting up ReadThisNext Development Environment"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd client
npm install
cd ..

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Creating .env file from example..."
    cp .env.example .env
    echo "📝 Please edit .env file and add your Google Books API key"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Get a Google Books API key from: https://console.cloud.google.com/"
echo "2. Add your API key to the .env file"
echo "3. Run 'npm run dev:full' to start both frontend and backend"
echo ""
echo "Available commands:"
echo "  npm run dev:full  - Start both frontend and backend"
echo "  npm run server    - Start backend only"
echo "  npm run client    - Start frontend only"
echo "  npm run build     - Build for production"
