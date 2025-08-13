import { createServer } from "./index.js";

// Support multiple port configurations for different deployment platforms
const port = process.env.PORT || process.env.VITE_PORT || 3000;
const host = process.env.HOST || "0.0.0.0";

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
