import express from "express";
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

dotenv.config({ path: ".env.local" });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

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

/* ═══ Start ═══ */
initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Lumina API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });
