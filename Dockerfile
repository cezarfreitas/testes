# Multi-stage build for optimal production image
FROM node:20-alpine as base

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build stage
FROM base as build

# Build the application (client + server)
RUN pnpm run build

# Production stage
FROM node:20-alpine as production

# Install pnpm in production image
RUN npm install -g pnpm

# Create app directory
WORKDIR /app

# Copy package files for production dependencies
COPY package.json pnpm-lock.yaml* ./

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod --shamefully-hoist

# Copy built application from build stage
COPY --from=build /app/dist ./dist

# Copy other necessary files (create if they don't exist)
COPY --from=build /app/data ./data 2>/dev/null || mkdir -p ./data
COPY --from=build /app/public ./public 2>/dev/null || mkdir -p ./public

# Create uploads directory
RUN mkdir -p public/uploads data

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Set default port for Vite server (built server runs on different port)
ENV VITE_PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); http.get('http://localhost:3000/api/ping', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))" || exit 1

# Start the application
CMD ["node", "dist/server/node-build.mjs"]
