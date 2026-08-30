import { Router } from "express";
import sql from "../db.js";
import { authMiddleware, AuthRequest } from "../middleware.js";

const router = Router({ mergeParams: true });

// GET /api/chats/:id/messages — get messages with pagination
router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const chatId = req.params.id;

    const chat = await sql`SELECT id FROM chats WHERE id = ${chatId} AND user_id = ${req.userId!}`;
    if (chat.length === 0) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50));
    const offset = (page - 1) * limit;

    const messages = await sql`
      SELECT id, role, content, images, thinking, feedback, created_at
      FROM messages WHERE chat_id = ${chatId}
      ORDER BY created_at ASC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countResult = await sql`SELECT COUNT(*)::int as total FROM messages WHERE chat_id = ${chatId}`;
    const total = countResult[0].total;

    res.json({
      messages,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/chats/:id/messages — add a message
router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const chatId = req.params.id;
    const { role, content, images, thinking } = req.body;

    if (!role || !content) {
      return res.status(400).json({ error: "role and content are required" });
    }

    const chat = await sql`SELECT id FROM chats WHERE id = ${chatId} AND user_id = ${req.userId!}`;
    if (chat.length === 0) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const id = crypto.randomUUID();
    const imagesJson = images ? JSON.stringify(images) : null;
    await sql`
      INSERT INTO messages (id, chat_id, role, content, images, thinking)
      VALUES (${id}, ${chatId}, ${role}, ${content}, ${imagesJson}::jsonb, ${thinking || null})
    `;

    // Just update timestamp — title generation is handled separately
    await sql`UPDATE chats SET updated_at = EXTRACT(EPOCH FROM NOW()) * 1000 WHERE id = ${chatId}`;

    res.json({ message: { id, role, content, images: images || null, thinking: thinking || null, created_at: Date.now() } });
  } catch (err) {
    console.error("Add message error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/chats/:chatId/messages/:messageId — edit message content
router.put("/:messageId", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const chatId = req.params.id;
    const { messageId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "content is required" });
    }

    const chat = await sql`SELECT id FROM chats WHERE id = ${chatId} AND user_id = ${req.userId!}`;
    if (chat.length === 0) {
      return res.status(404).json({ error: "Chat not found" });
    }

    await sql`UPDATE messages SET content = ${content} WHERE id = ${messageId} AND chat_id = ${chatId}`;
    res.json({ ok: true });
  } catch (err) {
    console.error("Edit message error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/chats/:chatId/messages/after/:timestamp — delete all messages after a timestamp
router.delete("/after/:timestamp", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const chatId = req.params.id;
    const timestamp = parseInt(req.params.timestamp);

    const chat = await sql`SELECT id FROM chats WHERE id = ${chatId} AND user_id = ${req.userId!}`;
    if (chat.length === 0) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const result = await sql`
      DELETE FROM messages WHERE chat_id = ${chatId} AND created_at > ${timestamp}
    `;
    res.json({ ok: true, deleted: result.count });
  } catch (err) {
    console.error("Delete messages after error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/chats/:chatId/messages/:messageId/feedback — set feedback
router.put("/:messageId/feedback", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const chatId = req.params.id;
    const { messageId } = req.params;
    const { feedback } = req.body; // 'like', 'dislike', or null

    const chat = await sql`SELECT id FROM chats WHERE id = ${chatId} AND user_id = ${req.userId!}`;
    if (chat.length === 0) {
      return res.status(404).json({ error: "Chat not found" });
    }

    await sql`UPDATE messages SET feedback = ${feedback} WHERE id = ${messageId} AND chat_id = ${chatId}`;
    res.json({ ok: true });
  } catch (err) {
    console.error("Set feedback error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
