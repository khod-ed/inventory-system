#!/bin/bash

# Build script for Render deployment
echo "Building Inventory Management System..."

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend && npm install

# Install frontend dependencies and build
echo "Installing frontend dependencies and building..."
cd ../frontend && npm install && npm run build

echo "Build completed successfully!"
