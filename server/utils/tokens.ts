import sql from "../db.js";
import { signAccessToken, signRefreshToken } from "../middleware.js";

export async function issueTokens(userId: string) {
  const accessToken = signAccessToken(userId);
  const refreshToken = signRefreshToken(userId);

  const tokenId = crypto.randomUUID();
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days

  await sql`
    INSERT INTO refresh_tokens (id, user_id, token, expires_at)
    VALUES (${tokenId}, ${userId}, ${refreshToken}, ${expiresAt})
  `;

  return { accessToken, refreshToken };
}
