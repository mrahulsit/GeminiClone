import { Router } from "express";
import sql from "../db.js";
import { authMiddleware, AuthRequest } from "../middleware.js";

const router = Router();

// GET /api/preferences
router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const rows = await sql`SELECT theme, accent, font_size, custom_instructions, thinking_level FROM preferences WHERE user_id = ${req.userId!}`;
    if (rows.length === 0) {
      await sql`INSERT INTO preferences (user_id) VALUES (${req.userId!}) ON CONFLICT DO NOTHING`;
      return res.json({ preferences: { theme: "dark", accent: "blue", font_size: "md", custom_instructions: "", thinking_level: "medium" } });
    }
    res.json({ preferences: rows[0] });
  } catch (err) {
    console.error("Get preferences error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/preferences
router.put("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { theme, accent, font_size, custom_instructions, thinking_level } = req.body;
    await sql`
      INSERT INTO preferences (user_id, theme, accent, font_size, custom_instructions, thinking_level)
      VALUES (${req.userId!}, ${theme || "dark"}, ${accent || "blue"}, ${font_size || "md"}, ${custom_instructions ?? ""}, ${thinking_level || "medium"})
      ON CONFLICT (user_id) DO UPDATE SET
        theme = COALESCE(${theme}, preferences.theme),
        accent = COALESCE(${accent}, preferences.accent),
        font_size = COALESCE(${font_size}, preferences.font_size),
        custom_instructions = COALESCE(${custom_instructions}, preferences.custom_instructions),
        thinking_level = COALESCE(${thinking_level}, preferences.thinking_level)
    `;
    res.json({ ok: true });
  } catch (err) {
    console.error("Update preferences error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
