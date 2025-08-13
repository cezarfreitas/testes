# Use Node.js Alpine image
FROM node:20-alpine

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install all dependencies (including dev for build)
# Try frozen lockfile first, fallback to regular install if needed
RUN pnpm install --frozen-lockfile --shamefully-hoist || \
    (echo "Lockfile outdated, updating..." && pnpm install --shamefully-hoist)

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Remove dev dependencies after build
RUN pnpm prune --prod

# Create necessary directories
RUN mkdir -p data public/uploads

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S appuser -u 1001 -G nodejs

# Change ownership of app directory
RUN chown -R appuser:nodejs /app

# Switch to non-root user
USER appuser

# Expose common ports used by different platforms
EXPOSE 3000 8080 80

# Set environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Health check that adapts to the port
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); const port = process.env.PORT || 3000; http.get(\`http://localhost:\${port}/api/ping\`, (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start the application
CMD ["node", "dist/server/production.mjs"]
