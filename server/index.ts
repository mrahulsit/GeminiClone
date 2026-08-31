import express from "express";
import path from "node:path";
import fs from "node:fs";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "./db.js";
import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chats.js";
import messageRoutes from "./routes/messages.js";
import preferenceRoutes from "./routes/preferences.js";
import aiChatRoutes from "./routes/chat.js";
import modelRoutes from "./routes/models.js";
import uploadRoutes from "./routes/upload.js";
import imageRoutes from "./routes/image.js";

dotenv.config({ path: ".env" });

const app = express();
const PORT = process.env.PORT || 3001;

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",").map((s) => s.trim())
      : true,
  })
);
app.use(express.json({ limit: "25mb" }));

/* ═══ Routes ═══ */
app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/chats/:id/messages", messageRoutes);
app.use("/api/preferences", preferenceRoutes);
app.use("/api/chat", aiChatRoutes);
app.use("/api/models", modelRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/image", imageRoutes);

/* ═══ Health check ═══ */
app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

/* ═══ 404 for unknown API routes ═══ */
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});

/* ═══ Serve the built frontend (SPA) when dist/ exists ═══ */
const distPath = path.resolve(process.cwd(), "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get(/^(?!\/api(?:\/|$)).*/, (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

/* ═══ Global error handler ═══ */
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({ error: "Internal server error" });
});

/* ═══ Start ═══ */
initDB()
  .then(() => {
    const handle = app.listen(PORT, () => {
      console.log(`🚀 Lumina server running on http://localhost:${PORT}`);
    });
    for (const sig of ["SIGTERM", "SIGINT"]) {
      process.on(sig, () => {
        console.log(`\n${sig} received, shutting down...`);
        handle.close(() => process.exit(0));
        setTimeout(() => process.exit(1), 10_000).unref();
      });
    }
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });
