#!/bin/bash

# Deployment script for AdminFlow application

set -e

echo "🚀 Starting AdminFlow deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️ $1${NC}"
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
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

print_info "Docker version: $(docker --version)"

# Stop and remove existing containers
print_warning "Stopping existing containers..."
docker stop adminflow-app 2>/dev/null || true
docker rm adminflow-app 2>/dev/null || true

# Check and update lockfile if needed
print_info "Checking pnpm lockfile..."
if command -v pnpm &> /dev/null; then
    if ! pnpm install --frozen-lockfile --dry-run &>/dev/null; then
        print_warning "Updating outdated lockfile..."
        pnpm install --no-frozen-lockfile
        print_status "Lockfile updated"
    else
        print_status "Lockfile is up to date"
    fi
else
    print_warning "pnpm not found locally, Docker will handle dependencies"
fi

# Build the Docker image
print_status "Building Docker image..."
docker build -t adminflow:latest .

if [ $? -ne 0 ]; then
    print_error "Docker build failed!"
    exit 1
fi

# Run the container
print_status "Starting AdminFlow container..."
docker run -d \
  --name adminflow-app \
  -p 3000:3000 \
  -v "$(pwd)/data:/app/data" \
  -v "$(pwd)/public/uploads:/app/public/uploads" \
  --restart unless-stopped \
  adminflow:latest

if [ $? -ne 0 ]; then
    print_error "Failed to start container!"
    exit 1
fi

# Wait for application to be ready
print_info "Waiting for application to start..."
sleep 15

# Detect which port the app is running on
PORTS=(3000 8080 80 8888)
WORKING_PORT=""

print_info "Detecting application port..."
for port in "${PORTS[@]}"; do
    if curl -f -s http://localhost:$port/api/ping > /dev/null 2>&1; then
        WORKING_PORT=$port
        break
    fi
done

if [ -n "$WORKING_PORT" ]; then
    print_status "AdminFlow is running successfully on port $WORKING_PORT!"
    echo ""
    echo "🌐 Application URLs:"
    echo "   • Landing Page: http://localhost:$WORKING_PORT"
    echo "   • Admin Panel:  http://localhost:$WORKING_PORT/admin"
    echo "   • SEO Settings: http://localhost:$WORKING_PORT/admin/seo"
    echo ""
    echo "📊 Health Check: http://localhost:$WORKING_PORT/api/ping"
    echo ""
    echo "📋 Container Management:"
    echo "   • View logs:    docker logs adminflow-app"
    echo "   • Stop app:     docker stop adminflow-app"
    echo "   • Start app:    docker start adminflow-app"
    echo "   • Remove app:   docker rm adminflow-app"
    echo ""
else
    print_error "Application failed to start properly on any expected port."
    print_warning "Checking container logs for errors:"
    docker logs adminflow-app --tail=50
    echo ""
    print_info "Manual port check commands:"
    for port in "${PORTS[@]}"; do
        echo "   curl http://localhost:$port/api/ping"
    done
    exit 1
fi

# Offer to show logs
read -p "Would you like to view the application logs? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Showing application logs (Ctrl+C to exit)..."
    docker logs -f adminflow-app
fi
