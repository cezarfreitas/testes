import { createServer } from "./index.js";

// Platform detection and configuration
const platforms = {
  fly: () => process.env.FLY_APP_NAME || process.env.FLY_REGION,
  heroku: () => process.env.DYNO || process.env.HEROKU_APP_NAME,
  vercel: () => process.env.VERCEL || process.env.VERCEL_ENV,
  netlify: () => process.env.NETLIFY || process.env.NETLIFY_BUILD_BASE,
  railway: () => process.env.RAILWAY_ENVIRONMENT,
  render: () => process.env.RENDER || process.env.RENDER_SERVICE_ID,
};

// Detect platform
let detectedPlatform = "local";
for (const [name, detector] of Object.entries(platforms)) {
  if (detector()) {
    detectedPlatform = name;
    break;
  }
}

// Platform-specific configurations
const configs = {
  fly: { port: process.env.PORT || 8080, host: "0.0.0.0" },
  heroku: { port: process.env.PORT || 80, host: "0.0.0.0" },
  vercel: { port: process.env.PORT || 3000, host: "0.0.0.0" },
  netlify: { port: process.env.PORT || 8888, host: "0.0.0.0" },
  railway: { port: process.env.PORT || 3000, host: "0.0.0.0" },
  render: { port: process.env.PORT || 10000, host: "0.0.0.0" },
  local: { port: process.env.PORT || 3000, host: process.env.HOST || "0.0.0.0" },
};

const config = configs[detectedPlatform] || configs.local;
const { port, host } = config;

const app = createServer();

app.listen(port, host, () => {
  console.log(`🚀 AdminFlow Server Started`);
  console.log(`📡 Host: ${host}`);
  console.log(`🔌 Port: ${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📊 Health check: http://${host === "0.0.0.0" ? "localhost" : host}:${port}/api/ping`);
  console.log(`🌐 Application: http://${host === "0.0.0.0" ? "localhost" : host}:${port}`);

  // Log additional info for debugging
  console.log(`📁 Static files: dist/spa`);
  console.log(`📤 Uploads: public/uploads`);
});
