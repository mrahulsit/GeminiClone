/* ─── API Layer ─── */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const getAccessToken = () => localStorage.getItem("lumina_access_token");
const getRefreshToken = () => localStorage.getItem("lumina_refresh_token");

export const setTokens = (access: string, refresh: string) => {
  localStorage.setItem("lumina_access_token", access);
  localStorage.setItem("lumina_refresh_token", refresh);
};

export const clearTokens = () => {
  localStorage.removeItem("lumina_access_token");
  localStorage.removeItem("lumina_refresh_token");
};

export { getAccessToken, getRefreshToken, API_URL };

async function tryRefreshToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    setTokens(data.accessToken, data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

export async function api<T = unknown>(
  path: string,
  opts: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res = await fetch(`${API_URL}${path}`, { ...opts, headers });

  // If 401, try refreshing the token and retry once
  if (res.status === 401 && path !== "/api/auth/refresh") {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      const newToken = getAccessToken();
      if (newToken) headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(`${API_URL}${path}`, { ...opts, headers });
    }
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "API error");
  return data as T;
}
