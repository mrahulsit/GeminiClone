import { GoogleGenAI } from "@google/genai";

/**
 * Generate a short, descriptive chat title using Gemini AI.
 * Falls back to a cleaned version of the message if AI fails.
 */
export async function generateChatTitle(firstMessage: string): Promise<string> {
  const fallback = cleanFallbackTitle(firstMessage);

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return fallback;

    const ai = new GoogleGenAI({ apiKey });

    const result = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: firstMessage,
      config: {
        systemInstruction:
          "You generate short chat titles. Rules: 3-8 words, no quotes, no punctuation at end, title case, describe the topic concisely. Reply with ONLY the title text, nothing else.",
        maxOutputTokens: 50,
      },
    });

    const title = result.text?.trim();

    // Validate: must be reasonable length and not contain weird chars
    if (title && title.length >= 3 && title.length <= 60 && !/[{}\[\]<>]/.test(title)) {
      return title;
    }

    return fallback;
  } catch {
    return fallback;
  }
}

/** Clean fallback: strip markdown, truncate nicely */
function cleanFallbackTitle(content: string): string {
  let title = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "")
    .replace(/[#*_~\[\]()]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (title.length > 0) {
    title = title.charAt(0).toUpperCase() + title.slice(1);
  }

  if (title.length > 60) {
    title = title.slice(0, 57).trimEnd() + "...";
  }

  return title || "New Chat";
}
