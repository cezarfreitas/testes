#!/bin/bash

# Deployment script for AdminFlow application

set -e

echo "🚀 Starting AdminFlow deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    print_error "Docker Compose is not available. Please install Docker Compose."
    exit 1
fi

# Build the Docker image
print_status "Building Docker image..."
docker build -t adminflow:latest .

# Stop existing containers
print_warning "Stopping existing containers..."
docker-compose down || true

# Start the application
print_status "Starting AdminFlow application..."
docker-compose up -d

# Wait for application to be ready
print_status "Waiting for application to start..."
sleep 10

# Check if application is healthy
if curl -f http://localhost:3000/api/ping > /dev/null 2>&1; then
    print_status "AdminFlow is running successfully!"
    echo ""
    echo "🌐 Application URLs:"
    echo "   • Landing Page: http://localhost:3000"
    echo "   • Admin Panel:  http://localhost:3000/admin"
    echo "   • SEO Settings: http://localhost:3000/admin/seo"
    echo ""
    echo "📊 Health Check: http://localhost:3000/api/ping"
else
    print_error "Application failed to start properly. Check logs:"
    echo "   docker-compose logs"
    exit 1
fi

# Show logs
print_status "Showing application logs (Ctrl+C to exit)..."
docker-compose logs -f
