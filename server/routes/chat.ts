import { Router } from "express";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { authMiddleware, AuthRequest } from "../middleware.js";

const router = Router();

const SYSTEM_PROMPT = `You are Lumina, an intelligent, friendly, and helpful AI assistant. You are designed to be a knowledgeable companion who can help with a wide range of tasks including:

- Answering questions on any topic (science, history, technology, arts, etc.)
- Writing, editing, and proofreading content
- Coding and programming assistance
- Brainstorming ideas and creative thinking
- Explaining complex concepts in simple terms
- Math and calculations
- General advice and recommendations

Guidelines:
- Be concise but thorough in your responses
- Use markdown formatting when it helps readability (headers, lists, code blocks, bold, italic)
- Be conversational and warm, but professional
- If you're unsure about something, say so honestly
- Don't fabricate information — if you don't know, acknowledge it
- Use code blocks with language hints for code snippets
- Structure longer responses with clear headings and bullet points
- Keep responses focused and relevant to the user's question`;

// Allowed models with their configs (chat-capable models only)
const MODELS: Record<string, { maxTokens: number; temperature: number }> = {
  "gemini-3.7-flash": { maxTokens: 8192, temperature: 0.9 },
  "gemini-3.6-flash": { maxTokens: 8192, temperature: 0.9 },
  "gemini-3.5-flash": { maxTokens: 8192, temperature: 0.9 },
  "gemini-3.5-flash-lite": { maxTokens: 4096, temperature: 0.9 },
  "gemini-3.1-flash-lite": { maxTokens: 4096, temperature: 0.9 },
  "gemini-2.5-flash-lite": { maxTokens: 4096, temperature: 0.9 },
  "gemma-2-27b-it": { maxTokens: 8192, temperature: 0.7 },
};

// Extract a clean error message from Google API errors
function cleanErrorMessage(err: any): string {
  const raw = err?.message || "Failed to get AI response";

  // Try to parse if it looks like a JSON-encoded error
  try {
    const parsed = JSON.parse(raw);
    const googleErr = parsed?.error;
    if (googleErr?.message) {
      const msg = googleErr.message;
      // Extract human-readable part from nested JSON
      try {
        const inner = JSON.parse(msg);
        if (inner?.error?.message) return inner.error.message;
        if (inner?.error?.status) return `API error: ${inner.error.status}`;
      } catch {
        return msg;
      }
    }
    if (googleErr?.status) return `API error: ${googleErr.status} — ${raw}`;
  } catch {
    // Not JSON, return as-is
  }

  // Friendly messages for common errors
  if (raw.includes("503") || raw.includes("UNAVAILABLE")) {
    return "The model is currently experiencing high demand. Please try again in a moment.";
  }
  if (raw.includes("429") || raw.includes("RESOURCE_EXHAUSTED")) {
    return "You've hit the rate limit. Please wait a moment and try again.";
  }
  if (raw.includes("SAFETY") || raw.includes("blocked")) {
    return "The response was blocked by safety filters. Try rephrasing your message.";
  }

  return raw;
}

// Map thinkingLevel string to SDK ThinkingLevel enum
function toThinkingLevel(level?: string): ThinkingLevel | undefined {
  switch (level) {
    case "low": return ThinkingLevel.LOW;
    case "medium": return ThinkingLevel.MEDIUM;
    case "high": return ThinkingLevel.HIGH;
    default: return undefined;
  }
}

// Ensure alternating roles in history — Gemini API requires user/model alternation
function sanitizeHistory(
  history: { role: string; content: string }[]
): { role: string; parts: { text: string }[] }[] {
  const result: { role: string; parts: { text: string }[] }[] = [];

  for (const msg of history) {
    const role = msg.role === "user" ? "user" : "model";
    const last = result[result.length - 1];

    if (last && last.role === role) {
      // Merge consecutive same-role messages
      last.parts.push({ text: msg.content });
    } else {
      result.push({ role, parts: [{ text: msg.content }] });
    }
  }

  // Ensure it starts with 'user'
  if (result.length > 0 && result[0].role !== "user") {
    result.shift();
  }

  return result;
}

// POST /api/chat — SSE streaming
router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { message, history, model: requestedModel, search, customInstructions, thinkingLevel } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Gemini API key not configured" });
    }

    // Validate model or use default
    const modelName = (requestedModel && MODELS[requestedModel])
      ? requestedModel
      : (process.env.GEMINI_MODEL || "gemini-3.7-flash");
    const modelConfig = MODELS[modelName] || { maxTokens: 8192, temperature: 0.9 };

    const ai = new GoogleGenAI({ apiKey });

    // Build system prompt with optional custom instructions
    let systemInstruction = SYSTEM_PROMPT;
    if (customInstructions?.trim()) {
      systemInstruction += `\n\nUser-specific instructions:\n${customInstructions.trim()}`;
    }

    // Build contents from history + current message
    const chatHistory = sanitizeHistory(history || []);
    const contents = [
      ...chatHistory,
      { role: "user", parts: [{ text: message }] },
    ];

    // Build thinking config
    const thinkingLevelEnum = toThinkingLevel(thinkingLevel);
    const thinkingConfig = thinkingLevelEnum
      ? { includeThoughts: true, thinkingLevel: thinkingLevelEnum }
      : undefined;

    const generationConfig = {
      temperature: modelConfig.temperature,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: modelConfig.maxTokens,
      ...(thinkingConfig ? { thinkingConfig } : {}),
    };

    // If web search is enabled, inject search results
    let finalContents = contents;
    let sources: { title: string; url: string; snippet: string }[] = [];

    if (search && process.env.TAVILY_API_KEY) {
      try {
        const searchRes = await fetch("https://api.tavily.com/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: process.env.TAVILY_API_KEY,
            query: message,
            max_results: 5,
          }),
        });
        if (searchRes.ok) {
          const searchData = await searchRes.json();
          sources = (searchData.results || []).map((r: any) => ({
            title: r.title,
            url: r.url,
            snippet: r.content,
          }));
          if (sources.length > 0) {
            const context = sources
              .map((s, i) => `[${i + 1}] ${s.title}\n${s.snippet}\nSource: ${s.url}`)
              .join("\n\n");
            const searchMessage = `${message}\n\n---\nWeb search results for reference:\n${context}\n\n---\nPlease use the above search results to inform your response. Cite sources using [1], [2], etc. when referencing them.`;
            // Replace the last user message with the search-augmented version
            finalContents = [
              ...chatHistory,
              { role: "user", parts: [{ text: searchMessage }] },
            ];
          }
        }
      } catch (searchErr) {
        console.error("Web search error:", searchErr);
        // Continue without search results
      }
    }

    const streamResult = await ai.models.generateContentStream({
      model: modelName,
      contents: finalContents,
      config: {
        ...generationConfig,
        systemInstruction,
      },
    });

    // Set SSE headers after validation passes
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    for await (const chunk of streamResult) {
      const candidate = chunk.candidates?.[0];
      if (!candidate?.content?.parts) continue;

      for (const part of candidate.content.parts) {
        if (part.thought && part.text) {
          // Thinking/reasoning token
          res.write(`data: ${JSON.stringify({ thinking: part.text })}\n\n`);
        } else if (part.text) {
          // Regular response token
          res.write(`data: ${JSON.stringify({ chunk: part.text })}\n\n`);
        }
      }
    }

    // Send sources as metadata before done
    if (sources.length > 0) {
      res.write(`data: ${JSON.stringify({ metadata: { sources } })}\n\n`);
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err: any) {
    console.error("Gemini chat error:", err);
    const errorMsg = cleanErrorMessage(err);
    // If headers already sent, send error as SSE event
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: errorMsg })}\n\n`);
      res.end();
    } else {
      res.status(500).json({ error: errorMsg });
    }
  }
});

export default router;
