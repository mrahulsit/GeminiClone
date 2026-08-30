import { Router } from "express";
import sql from "../db.js";
import { authMiddleware, AuthRequest } from "../middleware.js";
import { generateChatTitle } from "../utils/title.js";

const router = Router();

// GET /api/chats/search?q=... — search chats by title and message content
router.get("/search", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const q = ((req.query.q as string) || "").trim();
    if (!q) return res.json({ results: [] });

    const pattern = `%${q}%`;

    const results = await sql`
      SELECT DISTINCT ON (c.id)
        c.id,
        c.title,
        c.updated_at,
        COALESCE(
          (SELECT m.content FROM messages m
           WHERE m.chat_id = c.id AND m.content ILIKE ${pattern}
           ORDER BY m.created_at DESC LIMIT 1),
          ''
        ) AS snippet
      FROM chats c
      LEFT JOIN messages msg ON msg.chat_id = c.id
      WHERE c.user_id = ${req.userId!}
        AND (c.title ILIKE ${pattern} OR msg.content ILIKE ${pattern})
      ORDER BY c.id, c.updated_at DESC
      LIMIT 20
    `;

    res.json({ results });
  } catch (err) {
    console.error("Search chats error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/chats — list user's chats with pagination
router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
    const offset = (page - 1) * limit;

    const chats = await sql`
      SELECT id, title, model, pinned, created_at, updated_at
      FROM chats WHERE user_id = ${req.userId!}
      ORDER BY pinned DESC, updated_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countResult = await sql`SELECT COUNT(*)::int as total FROM chats WHERE user_id = ${req.userId!}`;
    const total = countResult[0].total;

    res.json({
      chats,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("List chats error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/chats — create new chat
router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const id = crypto.randomUUID();
    const title = req.body.title || "New Chat";
    await sql`
      INSERT INTO chats (id, user_id, title)
      VALUES (${id}, ${req.userId!}, ${title})
    `;
    res.json({ chat: { id, title, created_at: Date.now(), updated_at: Date.now() } });
  } catch (err) {
    console.error("Create chat error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/chats/:id — rename chat
router.put("/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { title } = req.body;
    await sql`
      UPDATE chats SET title = ${title}, updated_at = EXTRACT(EPOCH FROM NOW()) * 1000
      WHERE id = ${req.params.id} AND user_id = ${req.userId!}
    `;
    res.json({ ok: true });
  } catch (err) {
    console.error("Rename chat error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/chats/:id/pin — toggle pin
router.put("/:id/pin", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const result = await sql`
      UPDATE chats SET pinned = NOT pinned, updated_at = EXTRACT(EPOCH FROM NOW()) * 1000
      WHERE id = ${req.params.id} AND user_id = ${req.userId!}
      RETURNING pinned
    `;
    if (result.length === 0) {
      return res.status(404).json({ error: "Chat not found" });
    }
    res.json({ pinned: result[0].pinned });
  } catch (err) {
    console.error("Pin chat error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/chats/:id/model — set model for chat
router.put("/:id/model", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { model } = req.body;
    await sql`
      UPDATE chats SET model = ${model}, updated_at = EXTRACT(EPOCH FROM NOW()) * 1000
      WHERE id = ${req.params.id} AND user_id = ${req.userId!}
    `;
    res.json({ ok: true });
  } catch (err) {
    console.error("Set model error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/chats/:id — delete a chat
router.delete("/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    await sql`DELETE FROM chats WHERE id = ${req.params.id} AND user_id = ${req.userId!}`;
    res.json({ ok: true });
  } catch (err) {
    console.error("Delete chat error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/chats/clean/empty — remove chats with no messages
router.delete("/clean/empty", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const result = await sql`
      DELETE FROM chats
      WHERE user_id = ${req.userId!}
      AND id NOT IN (SELECT DISTINCT chat_id FROM messages)
    `;
    res.json({ ok: true, deleted: result.count });
  } catch (err) {
    console.error("Clean empty chats error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/chats/:id/generate-title — background title generation
router.post("/:id/generate-title", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: "content is required" });
    }

    const chat = await sql`SELECT id FROM chats WHERE id = ${req.params.id} AND user_id = ${req.userId!}`;
    if (chat.length === 0) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const title = await generateChatTitle(content);
    await sql`UPDATE chats SET title = ${title}, updated_at = EXTRACT(EPOCH FROM NOW()) * 1000 WHERE id = ${req.params.id}`;

    res.json({ title });
  } catch (err) {
    console.error("Generate title error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
