#!/bin/bash

# API Setup Script
# This script helps set up the backend API server

echo "🚀 Feliz Store API Setup"
echo "========================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "Creating .env from template..."
    if [ -f .env.template ]; then
        cp .env.template .env
        echo "✅ Created .env file"
        echo "⚠️  Please edit .env and add your Supabase credentials"
    else
        echo "❌ .env.template not found. Please create .env manually."
        exit 1
    fi
else
    echo "✅ .env file exists"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ Dependencies installed"
    else
        echo "❌ Failed to install dependencies"
        exit 1
    fi
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Edit .env file and add your Supabase credentials"
echo "2. Run database schema: Copy server/database/schema.sql to Supabase SQL Editor"
echo "3. (Optional) Seed data: Copy server/database/seed.example.sql to Supabase SQL Editor"
echo "4. Start server: npm run dev"
echo ""
echo "For detailed instructions, see API_SETUP_GUIDE.md"

