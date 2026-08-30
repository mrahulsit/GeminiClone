import { Router } from "express";
import bcrypt from "bcryptjs";
import sql from "../db.js";
import { authMiddleware, verifyRefreshToken, AuthRequest } from "../middleware.js";
import { issueTokens } from "../utils/tokens.js";

const router = Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const existing = await sql`SELECT id FROM users WHERE email = ${email.toLowerCase()}`;
    if (existing.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const id = crypto.randomUUID();
    const passwordHash = await bcrypt.hash(password, 10);

    await sql`
      INSERT INTO users (id, name, email, password_hash)
      VALUES (${id}, ${name.trim()}, ${email.toLowerCase()}, ${passwordHash})
    `;

    await sql`INSERT INTO preferences (user_id) VALUES (${id})`;

    const { accessToken, refreshToken } = await issueTokens(id);
    res.json({
      accessToken,
      refreshToken,
      user: { id, name: name.trim(), email: email.toLowerCase() },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const rows = await sql`SELECT id, name, email, password_hash FROM users WHERE email = ${email.toLowerCase()}`;
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const { accessToken, refreshToken } = await issueTokens(user.id);
    res.json({
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/auth/me
router.get("/me", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const rows = await sql`SELECT id, name, email FROM users WHERE id = ${req.userId!}`;
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user: rows[0] });
  } catch (err) {
    console.error("Me error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/auth/refresh
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token required" });
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return res.status(401).json({ error: "Invalid or expired refresh token" });
    }

    const stored = await sql`
      SELECT id FROM refresh_tokens WHERE token = ${refreshToken} AND user_id = ${payload.userId}
    `;
    if (stored.length === 0) {
      return res.status(401).json({ error: "Refresh token revoked" });
    }

    await sql`DELETE FROM refresh_tokens WHERE token = ${refreshToken}`;

    const tokens = await issueTokens(payload.userId);
    res.json(tokens);
  } catch (err) {
    console.error("Refresh error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/auth/logout
router.post("/logout", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await sql`DELETE FROM refresh_tokens WHERE token = ${refreshToken}`;
    }
    res.json({ ok: true });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
