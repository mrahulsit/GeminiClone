import { Router } from "express";
import { authMiddleware, AuthRequest } from "../middleware.js";

const router = Router();

// Strategy 1: dedicated Imagen models via the :predict endpoint.
// Some IDs are deprecated/unavailable per API key, so try in order.
const IMAGEN_MODELS = [
  process.env.GEMINI_IMAGE_MODEL,
  "imagen-4.0-generate-001",
  "imagen-3.1-generate-001",
].filter((m): m is string => Boolean(m));

// Strategy 2: Gemini models that natively generate images via :generateContent
// (responseModalities: ["IMAGE","TEXT"]). Fall back here if no Imagen model works.
const GEMINI_IMAGE_MODELS = ["gemini-3.6-flash", "gemini-2.5-flash-image"];

type GeneratedImage = { mimeType: string; data: string };

const isModelUnavailable = (status: number, message: string) =>
  status === 404 || /not found|not supported/i.test(message);

async function tryImagenPredict(
  model: string,
  prompt: string,
  apiKey: string
): Promise<{ images: GeneratedImage[]; error?: string; status: number }> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict?key=${apiKey}`;
  const apiRes = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      instances: [{ prompt }],
      parameters: { sampleCount: 1 },
    }),
  });

  if (apiRes.ok) {
    const data = await apiRes.json();
    const predictions = data.predictions || [];
    if (predictions.length > 0) {
      return {
        images: predictions.map((pred: any) => ({
          mimeType: pred.mimeType || "image/png",
          data: pred.bytesBase64Encoded,
        })),
        status: apiRes.status,
      };
    }
    return {
      error: "The model did not generate an image. Try rephrasing your prompt.",
      status: apiRes.status,
    };
  }

  const errData = await apiRes.json().catch(() => ({}));
  return {
    error:
      errData?.error?.message || `Image generation failed (${apiRes.status})`,
    status: apiRes.status,
  };
}

async function tryGeminiGenerateContent(
  model: string,
  prompt: string,
  apiKey: string
): Promise<{ images: GeneratedImage[]; error?: string; status: number }> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const apiRes = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
    }),
  });

  if (apiRes.ok) {
    const data = await apiRes.json();
    const images: GeneratedImage[] = [];
    for (const candidate of data?.candidates || []) {
      for (const part of candidate?.content?.parts || []) {
        if (part?.inlineData?.data && part?.inlineData?.mimeType) {
          images.push({
            mimeType: part.inlineData.mimeType,
            data: part.inlineData.data,
          });
        }
      }
    }
    if (images.length > 0) {
      return { images, status: apiRes.status };
    }
    return {
      error:
        "The model did not generate an image. Try rephrasing your prompt.",
      status: apiRes.status,
    };
  }

  const errData = await apiRes.json().catch(() => ({}));
  return {
    error:
      errData?.error?.message || `Image generation failed (${apiRes.status})`,
    status: apiRes.status,
  };
}

// POST /api/image/generate — generate an image from a text prompt.
// Tries Imagen :predict first, then falls back to Gemini native image generation.
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

    const cleanPrompt = prompt.trim();
    let lastError = "Image generation failed";

    // Imagen via :predict
    for (const model of IMAGEN_MODELS) {
      const { images, error, status } = await tryImagenPredict(
        model,
        cleanPrompt,
        apiKey
      );
      if (images) return res.json({ images });
      lastError = error!;
      console.error(`Imagen error with ${model}:`, lastError);
      if (!isModelUnavailable(status, lastError)) break;
    }

    // Gemini native image generation via :generateContent
    for (const model of GEMINI_IMAGE_MODELS) {
      const { images, error, status } = await tryGeminiGenerateContent(
        model,
        cleanPrompt,
        apiKey
      );
      if (images) return res.json({ images });
      lastError = error!;
      console.error(`Gemini image error with ${model}:`, lastError);
      if (!isModelUnavailable(status, lastError)) break;
    }

    res.status(500).json({ error: lastError });
  } catch (err: any) {
    console.error("Image generation error:", err);
    res.status(500).json({ error: err.message || "Image generation failed" });
  }
});

export default router;