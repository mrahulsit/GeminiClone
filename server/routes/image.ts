import { Router } from "express";
import { authMiddleware, AuthRequest } from "../middleware.js";

const router = Router();

// The dedicated image generation model
const IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL || "imagen-3.0.0-generate-002";

// POST /api/image/generate — generate an image from a text prompt
// Uses the :predict endpoint which is the correct one for Imagen models on AI Studio free tier
router.post("/generate", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt?.trim()) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Gemini API key not configured" });
    }

    // Imagen models use the :predict endpoint, not :generateContent
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_MODEL}:predict?key=${apiKey}`;

    const body = {
      instances: [{ prompt: prompt.trim() }],
      parameters: {
        sampleCount: 1,
      },
    };

    const apiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!apiRes.ok) {
      const errData = await apiRes.json().catch(() => ({}));
      const errMsg = errData?.error?.message || `Image generation failed (${apiRes.status})`;
      console.error("Imagen API error:", errMsg);
      return res.status(500).json({ error: errMsg });
    }

    const data = await apiRes.json();

    // :predict returns predictions with base64-encoded images
    const predictions = data.predictions;
    if (!predictions || predictions.length === 0) {
      return res.status(500).json({
        error: "The model did not generate an image. Try rephrasing your prompt.",
      });
    }

    const images = predictions.map((pred: any) => ({
      mimeType: pred.mimeType || "image/png",
      data: pred.bytesBase64Encoded,
    }));

    res.json({ images });
  } catch (err: any) {
    console.error("Image generation error:", err);
    res.status(500).json({ error: err.message || "Image generation failed" });
  }
});

export default router;
