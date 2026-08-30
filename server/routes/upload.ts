import { Router } from "express";
import { authMiddleware, AuthRequest } from "../middleware.js";

const router = Router();

// POST /api/upload — upload a file and return its content as text
router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    // Check content type — expect multipart or base64 JSON
    const contentType = req.headers["content-type"] || "";

    if (contentType.includes("application/json")) {
      // Base64 upload: { filename, mimeType, data (base64) }
      const { filename, mimeType, data } = req.body;

      if (!filename || !data) {
        return res.status(400).json({ error: "filename and data are required" });
      }

      // Limit file size (10MB base64)
      if (data.length > 13_000_000) {
        return res.status(400).json({ error: "File too large (max 10MB)" });
      }

      const buffer = Buffer.from(data, "base64");
      const text = buffer.toString("utf-8");

      // Basic check that it's text-based
      const isBinary = buffer.some((byte) => byte === 0);
      if (isBinary) {
        return res.status(400).json({ error: "Only text-based files are supported" });
      }

      res.json({
        file: {
          name: filename,
          mimeType: mimeType || "text/plain",
          content: text,
          size: buffer.length,
        },
      });
    } else {
      res.status(415).json({ error: "Use application/json with { filename, data } format" });
    }
  } catch (err: any) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message || "Upload failed" });
  }
});

export default router;
