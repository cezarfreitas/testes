#!/usr/bin/env node

// Platform detection script for automatic port configuration

const platforms = {
  fly: {
    detect: () => process.env.FLY_APP_NAME || process.env.FLY_REGION,
    port: process.env.PORT || 8080,
    host: "0.0.0.0",
  },
  heroku: {
    detect: () => process.env.DYNO || process.env.HEROKU_APP_NAME,
    port: process.env.PORT || 80,
    host: "0.0.0.0",
  },
  vercel: {
    detect: () => process.env.VERCEL || process.env.VERCEL_ENV,
    port: process.env.PORT || 3000,
    host: "0.0.0.0",
  },
  netlify: {
    detect: () => process.env.NETLIFY || process.env.NETLIFY_BUILD_BASE,
    port: process.env.PORT || 8888,
    host: "0.0.0.0",
  },
  railway: {
    detect: () =>
      process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID,
    port: process.env.PORT || 3000,
    host: "0.0.0.0",
  },
  render: {
    detect: () => process.env.RENDER || process.env.RENDER_SERVICE_ID,
    port: process.env.PORT || 10000,
    host: "0.0.0.0",
  },
  docker: {
    detect: () => process.env.DOCKER_CONTAINER || process.env.container,
    port: process.env.PORT || 3000,
    host: "0.0.0.0",
  },
  local: {
    detect: () => true, // fallback
    port: process.env.PORT || 3000,
    host: process.env.HOST || "localhost",
  },
};

function detectPlatform() {
  for (const [name, config] of Object.entries(platforms)) {
    if (config.detect()) {
      return { name, ...config };
    }
  }
  return { name: "unknown", ...platforms.local };
}

const platform = detectPlatform();

console.log(`🔍 Detected platform: ${platform.name}`);
console.log(`🔌 Using port: ${platform.port}`);
console.log(`📡 Using host: ${platform.host}`);

// Set environment variables
process.env.PORT = platform.port;
process.env.HOST = platform.host;

// Export for use in other scripts
module.exports = platform;

// If run directly, just show the detection
if (require.main === module) {
  console.log(
    `\n🚀 Ready to start server on ${platform.host}:${platform.port}`,
  );
}
