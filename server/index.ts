import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { getSEOConfig, updateSEOConfig } from "./routes/seo";
import { uploadImage, deleteImage } from "./routes/upload";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "10mb" })); // Increase limit for image uploads
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Serve static files (uploads)
  app.use("/uploads", express.static("public/uploads"));

  // Serve static files from SPA build
  app.use(express.static("dist/spa"));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // SEO configuration routes
  app.get("/api/seo", getSEOConfig);
  app.post("/api/seo", updateSEOConfig);

  // Upload routes
  app.post("/api/upload", uploadImage);
  app.delete("/api/upload/:filename", deleteImage);

  return app;
}
