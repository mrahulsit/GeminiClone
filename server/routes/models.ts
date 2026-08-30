import { Router } from "express";
import { authMiddleware } from "../middleware.js";

const router = Router();

const MODELS = [
  // --- Active Gemini 3 Free Tier Models ---
  {
    id: "gemini-3.6-flash",
    name: "Gemini 3.6 Flash",
    description: "Token-efficient Flash model for high-volume agentic planning and rapid task execution.",
    maxTokens: 1048576,
    badge: "Flash",
    supportsWebSearch: true,
    supportsImageGen: false,
  },
  {
    id: "gemini-3.5-flash",
    name: "Gemini 3.5 Flash",
    description: "Frontier-class intelligence for complex coding and agentic loops at Flash speeds.",
    maxTokens: 1048576,
    badge: "Flash",
    supportsWebSearch: true,
    supportsImageGen: false,
  },
  {
    id: "gemini-3.5-flash-lite",
    name: "Gemini 3.5 Flash-Lite",
    description: "Cost-effective subagent option designed for high-volume automation.",
    maxTokens: 1048576,
    badge: "Lite",
    supportsWebSearch: true,
    supportsImageGen: false,
  },
  {
    id: "gemini-3.1-flash-lite",
    name: "Gemini 3.1 Flash-Lite",
    description: "Fastest entry-level Gemini 3 model for lightweight tasks and basic processing.",
    maxTokens: 1048576,
    badge: "Lite",
    supportsWebSearch: true,
    supportsImageGen: false,
  },

  // --- Legacy Gemini 2 Series (Free Tier) ---
  {
    id: "gemini-2.5-flash-lite",
    name: "Gemini 2.5 Flash-Lite",
    description: "Budget-friendly model for high-volume, less complex tasks.",
    maxTokens: 1048576,
    badge: "Lite",
    supportsWebSearch: true,
    supportsImageGen: false,
  },

  // --- Free Open Weights Models ---
  {
    id: "gemma-2-27b-it",
    name: "Gemma 2 27B",
    description: "Google's open-weights 27B parameter instruction-tuned model.",
    maxTokens: 8192,
    badge: "Gemma",
    supportsWebSearch: false,
    supportsImageGen: false,
  },

  // --- Dedicated Image Generation Endpoint ---
  {
    id: "imagen-3.0-generate-002",
    name: "Imagen 3",
    description: "Google's dedicated text-to-image generation engine.",
    maxTokens: null,
    badge: "Image Gen",
    supportsWebSearch: false,
    supportsImageGen: true,
  },
];

// GET /api/models — list available models
router.get("/", authMiddleware, (_req, res) => {
  res.json({ models: MODELS });
});

export default router;
