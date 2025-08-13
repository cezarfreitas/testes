import { createServer } from "./index.js";

const port = process.env.PORT || 3000;

const app = createServer();

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/api/ping`);
  console.log(`🌐 Application: http://localhost:${port}`);
});
