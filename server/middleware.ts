import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "lumina-dev-secret-change-in-prod";

if (
  process.env.NODE_ENV === "production" &&
  (!process.env.JWT_SECRET ||
    process.env.JWT_SECRET === "lumina-dev-secret-change-in-prod" ||
    process.env.JWT_SECRET === "lumina-prod-k3y-change-me-in-real-deployment")
) {
  console.error("FATAL: JWT_SECRET must be set to a strong secret in production");
  process.exit(1);
}

export interface AuthRequest extends Request {
  userId?: string;
}

// Access token: short-lived (15 minutes)
export function signAccessToken(userId: string): string {
  return jwt.sign({ userId, type: "access" }, JWT_SECRET, { expiresIn: "15m" });
}

// Refresh token: long-lived (30 days)
export function signRefreshToken(userId: string): string {
  return jwt.sign({ userId, type: "refresh" }, JWT_SECRET, { expiresIn: "30d" });
}

// Verify access token
export function verifyAccessToken(token: string): { userId: string } | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; type: string };
    if (payload.type !== "access") return null;
    return { userId: payload.userId };
  } catch {
    return null;
  }
}

// Verify refresh token
export function verifyRefreshToken(token: string): { userId: string } | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; type: string };
    if (payload.type !== "refresh") return null;
    return { userId: payload.userId };
  } catch {
    return null;
  }
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }

  const token = header.slice(7);
  const payload = verifyAccessToken(token);
  if (!payload) {
    return res.status(401).json({ error: "Invalid or expired token", code: "TOKEN_EXPIRED" });
  }

  req.userId = payload.userId;
  next();
}

// Legacy alias for backward compat
export function signToken(userId: string): string {
  return signAccessToken(userId);
}
