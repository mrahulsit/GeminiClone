import { createContext, useState, useEffect, useRef, ReactNode } from "react";
import type { Theme, FontSize, User, Message, Source, Chat, ContextType, ModelInfo } from "../types";
import { api, getAccessToken, getRefreshToken, setTokens, clearTokens, API_URL } from "../utils/api";
import { ACCENTS } from "../utils/constants";

/* ─── Context ─── */
const _Context = createContext<ContextType>({} as ContextType);

const ContextProvider = ({ children }: { children: ReactNode }) => {
  /* ═══ Auth ═══ */
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  /* ═══ Chat ═══ */
  const [chats, setChatsState] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [selectedModel, setSelectedModel] = useState("gemini-3.6-flash");
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [imageMode, setImageMode] = useState(false);
  const [thinkingLevel, setThinkingLevelState] = useState("medium");
  const [customInstructions, setCustomInstructionsState] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  /* ═══ UI ═══ */
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExtended, setSidebarExtended] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  /* ═══ Preferences ═══ */
  const [theme, setTheme] = useState<Theme>("light");
  const [accent, _setAccent] = useState("blue");
  const [fontSize, setFontSizeState] = useState<FontSize>("md");

  /* ── Load user session on mount ── */
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setAuthLoaded(true);
      return;
    }
    api<{ user: User }>("/api/auth/me")
      .then(async ({ user }) => {
        setCurrentUser(user);
        await loadChats();
        await loadPreferences();
        await loadModels();
        // Clean up any empty chats from previous sessions
        await cleanEmptyChats();
      })
      .catch(() => {
        clearTokens();
      })
      .finally(() => setAuthLoaded(true));
  }, []);

  /* ── Load chats ── */
  const loadChats = async () => {
    try {
      const { chats: serverChats } = await api<{ chats: any[] }>("/api/chats");
      const mapped: Chat[] = serverChats.map((c) => ({
        id: c.id,
        title: c.title,
        messages: [],
        createdAt: Number(c.created_at),
        updatedAt: Number(c.updated_at),
        pinned: c.pinned,
        model: c.model,
      }));
      setChatsState(mapped);
    } catch (err) {
      console.error("Failed to load chats:", err);
    }
  };

  /* ── Clean up empty chats ── */
  const cleanEmptyChats = async () => {
    try {
      await api("/api/chats/clean/empty", { method: "DELETE" });
      // Reload chats after cleanup
      await loadChats();
    } catch (err) {
      console.error("Failed to clean empty chats:", err);
    }
  };

  /* ── Load messages for a specific chat ── */
  const loadMessages = async (chatId: string) => {
    try {
      const { messages } = await api<{ messages: any[] }>(
        `/api/chats/${chatId}/messages`
      );
      const mapped: Message[] = messages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: Number(m.created_at),
        feedback: m.feedback,
        images: m.images || undefined,
        thinking: m.thinking || undefined,
      }));
      setChatsState((prev) =>
        prev.map((c) => (c.id === chatId ? { ...c, messages: mapped } : c))
      );
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  /* ── Load preferences ── */
  const loadPreferences = async () => {
    try {
      const { preferences } = await api<{
        preferences: { theme: string; accent: string; font_size: string; custom_instructions: string; thinking_level: string };
      }>("/api/preferences");
      if (preferences.theme) setTheme(preferences.theme as Theme);
      if (preferences.accent) _setAccent(preferences.accent);
      if (preferences.font_size) setFontSizeState(preferences.font_size as FontSize);
      if (preferences.custom_instructions != null) setCustomInstructionsState(preferences.custom_instructions);
      if (preferences.thinking_level) setThinkingLevelState(preferences.thinking_level);
    } catch (err) {
      console.error("Failed to load preferences:", err);
    }
  };

  /* ── Apply theme ── */
  useEffect(() => {
    const r = document.documentElement;
    r.classList.remove("dark", "light");
    r.classList.add(theme);
    // Save to server if logged in
    if (currentUser) {
      api("/api/preferences", {
        method: "PUT",
        body: JSON.stringify({ theme }),
      }).catch(() => {});
    }
  }, [theme]);

  /* ── Apply accent ── */
  useEffect(() => {
    const c = ACCENTS[accent] || ACCENTS.blue;
    document.documentElement.style.setProperty("--color-accent", c.base);
    document.documentElement.style.setProperty("--color-accent-light", c.light);
    if (currentUser) {
      api("/api/preferences", {
        method: "PUT",
        body: JSON.stringify({ accent }),
      }).catch(() => {});
    }
  }, [accent]);

  /* ── Font size ── */
  useEffect(() => {
    document.documentElement.setAttribute("data-font", fontSize);
    if (currentUser) {
      api("/api/preferences", {
        method: "PUT",
        body: JSON.stringify({ font_size: fontSize }),
      }).catch(() => {});
    }
  }, [fontSize]);

  /* ── Load models ── */
  const loadModels = async () => {
    try {
      const { models: modelList } = await api<{ models: ModelInfo[] }>("/api/models");
      if (modelList && modelList.length > 0) {
        setModels(modelList);
        // Make sure default selection is one of the available chat models
        const chatModels = modelList.filter((m) => !m.supportsImageGen);
        if (chatModels.length > 0 && !chatModels.some((m) => m.id === selectedModel)) {
          setSelectedModel(chatModels[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load models:", err);
    }
  };

  /* ── Sync activeChat from chats array ── */
  useEffect(() => {
    if (activeChatId) {
      const found = chats.find((c) => c.id === activeChatId) || null;
      setActiveChat(found);
    } else {
      setActiveChat(null);
    }
  }, [activeChatId, chats]);

  /* ═══ Auth actions ═══ */
  const login = async (email: string, password: string): Promise<string | null> => {
    try {
      const { accessToken, refreshToken, user } = await api<{
        accessToken: string;
        refreshToken: string;
        user: User;
      }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setTokens(accessToken, refreshToken);
      setCurrentUser(user);
      await loadChats();
      await loadPreferences();
      await loadModels();
      return null;
    } catch (err: any) {
      return err.message || "Login failed";
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<string | null> => {
    try {
      const { accessToken, refreshToken, user } = await api<{
        accessToken: string;
        refreshToken: string;
        user: User;
      }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      setTokens(accessToken, refreshToken);
      setCurrentUser(user);
      await loadChats();
      await loadPreferences();
      await loadModels();
      return null;
    } catch (err: any) {
      return err.message || "Registration failed";
    }
  };

  const logout = async () => {
    // Revoke refresh token on server
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      api("/api/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      }).catch(() => {});
    }
    setCurrentUser(null);
    clearTokens();
    setChatsState([]);
    setActiveChatId(null);
  };

  /* ═══ Chat actions ═══ */
  const createChat = async (): Promise<string> => {
    try {
      const { chat } = await api<{ chat: { id: string; title: string; created_at: number; updated_at: number } }>(
        "/api/chats",
        { method: "POST", body: JSON.stringify({ title: "New Chat" }) }
      );
      const nc: Chat = {
        id: chat.id,
        title: chat.title,
        messages: [],
        createdAt: Number(chat.created_at),
        updatedAt: Number(chat.updated_at),
      };
      setChatsState((prev) => [nc, ...prev]);
      setActiveChatId(nc.id);
      return nc.id;
    } catch (err) {
      console.error("Create chat error:", err);
      return "";
    }
  };

  const switchChat = (id: string) => {
    setActiveChatId(id);
    setSidebarOpen(false);
    // Load messages if not already loaded
    const chat = chats.find((c) => c.id === id);
    if (chat && chat.messages.length === 0) {
      loadMessages(id);
    }
  };

  const deleteChat = async (id: string) => {
    try {
      await api(`/api/chats/${id}`, { method: "DELETE" });
      setChatsState((prev) => {
        const next = prev.filter((c) => c.id !== id);
        if (activeChatId === id) {
          setActiveChatId(next.length ? next[0].id : null);
        }
        return next;
      });
    } catch (err) {
      console.error("Delete chat error:", err);
    }
  };

  const renameChat = async (id: string, title: string) => {
    try {
      await api(`/api/chats/${id}`, {
        method: "PUT",
        body: JSON.stringify({ title }),
      });
      setChatsState((prev) =>
        prev.map((c) => (c.id === id ? { ...c, title } : c))
      );
    } catch (err) {
      console.error("Rename chat error:", err);
    }
  };

  const clearAllChats = async () => {
    try {
      // Delete all chats one by one (could be optimized with a bulk endpoint)
      for (const chat of chats) {
        await api(`/api/chats/${chat.id}`, { method: "DELETE" });
      }
      setChatsState([]);
      setActiveChatId(null);
    } catch (err) {
      console.error("Clear chats error:", err);
    }
  };

  const filteredChats = searchQuery
    ? chats.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : chats;

  /* ═══ New feature actions ═══ */

  const stopGeneration = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
  };

  const regenerateResponse = async () => {
    if (!activeChatId || !activeChat) return;
    const lastUserMsg = [...activeChat.messages].reverse().find((m) => m.role === "user");
    if (!lastUserMsg) return;
    // Remove last assistant message if it exists
    const lastMsg = activeChat.messages[activeChat.messages.length - 1];
    if (lastMsg?.role === "assistant") {
      await api(`/api/chats/${activeChatId}/messages/after/${lastMsg.timestamp - 1}`, {
        method: "DELETE",
      });
      setChatsState((prev) =>
        prev.map((c) =>
          c.id === activeChatId
            ? { ...c, messages: c.messages.slice(0, -1) }
            : c
        )
      );
    }
    setInput(lastUserMsg.content);
    setTimeout(() => onSent(lastUserMsg.content, { skipUserMessage: true }), 50);
  };

  const editMessage = async (messageId: string, content: string) => {
    if (!activeChatId) return;
    await api(`/api/chats/${activeChatId}/messages/${messageId}`, {
      method: "PUT",
      body: JSON.stringify({ content }),
    });
    // Delete all messages after this one
    const msg = activeChat?.messages.find((m) => m.id === messageId);
    if (msg) {
      await api(`/api/chats/${activeChatId}/messages/after/${msg.timestamp}`, {
        method: "DELETE",
      });
      setChatsState((prev) =>
        prev.map((c) => {
          if (c.id !== activeChatId) return c;
          const idx = c.messages.findIndex((m) => m.id === messageId);
          return {
            ...c,
            messages: [
              ...c.messages.slice(0, idx),
              { ...c.messages[idx], content },
              ...c.messages.slice(idx + 1),
            ],
          };
        })
      );
    }
    // Resend with edited content — the user message already exists
    setInput(content);
    setTimeout(() => onSent(content, { skipUserMessage: true }), 50);
  };

  const pinChat = async (chatId: string) => {
    try {
      const { pinned } = await api<{ pinned: boolean }>(`/api/chats/${chatId}/pin`, {
        method: "PUT",
      });
      setChatsState((prev) =>
        prev.map((c) => (c.id === chatId ? { ...c, pinned } : c))
      );
    } catch (err) {
      console.error("Pin chat error:", err);
    }
  };

  const setFeedback = async (messageId: string, feedback: "like" | "dislike" | null) => {
    if (!activeChatId) return;
    try {
      await api(`/api/chats/${activeChatId}/messages/${messageId}/feedback`, {
        method: "PUT",
        body: JSON.stringify({ feedback }),
      });
      setChatsState((prev) =>
        prev.map((c) =>
          c.id === activeChatId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === messageId ? { ...m, feedback } : m
                ),
              }
            : c
        )
      );
    } catch (err) {
      console.error("Set feedback error:", err);
    }
  };

  const setCustomInstructions = (v: string) => {
    setCustomInstructionsState(v);
    if (currentUser) {
      api("/api/preferences", {
        method: "PUT",
        body: JSON.stringify({ custom_instructions: v }),
      }).catch(() => {});
    }
  };

  const setThinkingLevel = (v: string) => {
    setThinkingLevelState(v);
    if (currentUser) {
      api("/api/preferences", {
        method: "PUT",
        body: JSON.stringify({ thinking_level: v }),
      }).catch(() => {});
    }
  };

  const exportChat = (chatId: string, format: "markdown" | "json") => {
    const chat = chats.find((c) => c.id === chatId);
    if (!chat) return;

    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === "markdown") {
      const lines = chat.messages.map((m) => {
        const role = m.role === "user" ? "**You**" : "**Assistant**";
        return `### ${role}\n\n${m.content}`;
      });
      content = `# ${chat.title}\n\n${lines.join("\n\n---\n\n")}`;
      filename = `${chat.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.md`;
      mimeType = "text/markdown";
    } else {
      content = JSON.stringify({ title: chat.title, messages: chat.messages }, null, 2);
      filename = `${chat.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.json`;
      mimeType = "application/json";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ═══ Send message ═══ */
  const onSent = async (prompt?: string, opts: { skipUserMessage?: boolean } = {}) => {
    const text = (prompt ?? input).trim();
    if (!text) return;

    let chatId = activeChatId;

    // Create chat only if we don't have one yet
    if (!chatId) {
      chatId = await createChat();
      if (!chatId) return;
    }

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    // Optimistically add user message (skipped for edit/regenerate flows where it already exists)
    if (!opts.skipUserMessage) {
      setChatsState((prev) =>
        prev.map((c) => {
          if (c.id !== chatId) return c;
          return {
            ...c,
            messages: [...c.messages, userMsg],
            updatedAt: Date.now(),
          };
        })
      );

      // Save user message to server
      api(`/api/chats/${chatId}/messages`, {
        method: "POST",
        body: JSON.stringify({ role: "user", content: text }),
      }).catch(() => {});
    }

    setLoading(true);
    setStreaming(true);
    setSources([]);

    // ── Image generation path (non-streaming) ──
    if (imageMode) {
      try {
        const token = getAccessToken();
        const imgRes = await fetch(`${API_URL}/api/image/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ prompt: text }),
        });

        if (!imgRes.ok) {
          const data = await imgRes.json();
          throw new Error(data.error || "Image generation failed");
        }

        const result = await imgRes.json() as {
          images: { mimeType: string; data: string }[];
          text?: string;
        };

        const imgMsg: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: result.text || "",
          timestamp: Date.now(),
          images: result.images,
        };

        setChatsState((prev) =>
          prev.map((c) =>
            c.id === chatId
              ? { ...c, messages: [...c.messages, imgMsg], updatedAt: Date.now() }
              : c
          )
        );

        // Save to server
        api(`/api/chats/${chatId}/messages`, {
          method: "POST",
          body: JSON.stringify({
            role: "assistant",
            content: result.text || "",
            images: result.images,
          }),
        }).catch(() => {});

        // Background title generation for first message
        const chatMsgCount = chats.find((c) => c.id === chatId)?.messages.length || 0;
        if (chatMsgCount <= 1) {
          api(`/api/chats/${chatId}/generate-title`, {
            method: "POST",
            body: JSON.stringify({ content: text }),
          }).then(({ title }: any) => {
            setChatsState((prev) =>
              prev.map((c) => (c.id === chatId ? { ...c, title } : c))
            );
          }).catch(() => {});
        }
      } catch (err: any) {
        const errMsg: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: err.message === "Failed to fetch"
            ? "Can't reach the server. Please check your connection."
            : err.message || "Failed to generate image. Please try again.",
          timestamp: Date.now(),
          error: true,
        };
        setChatsState((prev) =>
          prev.map((c) =>
            c.id === chatId
              ? { ...c, messages: [...c.messages, errMsg], updatedAt: Date.now() }
              : c
          )
        );
      }

      abortControllerRef.current = null;
      setLoading(false);
      setStreaming(false);
      setInput("");
      return;
    }

    // Create an empty assistant message that we'll update as chunks arrive
    const aiMsgId = crypto.randomUUID();
    const aiMsg: Message = {
      id: aiMsgId,
      role: "assistant",
      content: "",
      timestamp: Date.now(),
    };

    // Add empty assistant message optimistically
    setChatsState((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? { ...c, messages: [...c.messages, aiMsg], updatedAt: Date.now() }
          : c
      )
    );

    try {
      // Build history for context
      const currentChat = chats.find((c) => c.id === chatId);
      const history = currentChat?.messages.map((m) => ({
        role: m.role,
        content: m.content,
      })) || [];

      // Create abort controller for stop generation
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const token = getAccessToken();
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          message: text,
          history,
          model: selectedModel,
          search: searchEnabled,
          customInstructions,
          thinkingLevel,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "API error");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let fullResponse = "";
      let fullThinking = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;

            try {
              const parsed = JSON.parse(data);
              if (parsed.error) throw new Error(parsed.error);
              if (parsed.metadata?.sources) {
                setSources(parsed.metadata.sources);
              }
              if (parsed.thinking) {
                fullThinking += parsed.thinking;
                // Update the assistant message with thinking in-place
                setChatsState((prev) =>
                  prev.map((c) =>
                    c.id === chatId
                      ? {
                          ...c,
                          messages: c.messages.map((m) =>
                            m.id === aiMsgId ? { ...m, thinking: fullThinking } : m
                          ),
                          updatedAt: Date.now(),
                        }
                      : c
                  )
                );
              }
              if (parsed.chunk) {
                fullResponse += parsed.chunk;
                // Update the assistant message in-place
                setChatsState((prev) =>
                  prev.map((c) =>
                    c.id === chatId
                      ? {
                          ...c,
                          messages: c.messages.map((m) =>
                            m.id === aiMsgId ? { ...m, content: fullResponse, thinking: fullThinking || undefined } : m
                          ),
                          updatedAt: Date.now(),
                        }
                      : c
                  )
                );
              }
            } catch {
              // Skip unparseable lines
            }
          }
        }
      }

      // Save completed AI message to server
      if (fullResponse) {
        api(`/api/chats/${chatId}/messages`, {
          method: "POST",
          body: JSON.stringify({
            role: "assistant",
            content: fullResponse,
            thinking: fullThinking || undefined,
          }),
        }).catch(() => {});

        // Background title generation (fire-and-forget)
        const chatMsgCount = chats.find((c) => c.id === chatId)?.messages.length || 0;
        if (chatMsgCount <= 1) {
          api(`/api/chats/${chatId}/generate-title`, {
            method: "POST",
            body: JSON.stringify({ content: text }),
          }).then(({ title }: any) => {
            setChatsState((prev) =>
              prev.map((c) => (c.id === chatId ? { ...c, title } : c))
            );
          }).catch(() => {});
        }
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        // User stopped generation — keep partial response
        return;
      }
      // Remove the empty assistant message and show error
      const errMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: err.message === "Failed to fetch"
          ? "Can't reach the server. Please check your connection."
          : "Sorry, something went wrong. Please try again.",
        timestamp: Date.now(),
        error: true,
      };
      setChatsState((prev) =>
        prev.map((c) =>
          c.id === chatId
            ? {
                ...c,
                messages: [
                  ...c.messages.filter((m) => m.id !== aiMsgId),
                  errMsg,
                ],
                updatedAt: Date.now(),
              }
            : c
        )
      );
    }

    abortControllerRef.current = null;
    setLoading(false);
    setStreaming(false);
    setInput("");
  };

  /* ═══ Preferences actions ═══ */
  const toggleTheme = () =>
    setTheme((p) => (p === "dark" ? "light" : "dark"));
  const setAccent = (c: string) => {
    if (ACCENTS[c]) _setAccent(c);
  };
  const setFontSize = (s: FontSize) => setFontSizeState(s);

  if (!authLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-0">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-accent loader-dot" />
          <div className="w-2.5 h-2.5 rounded-full bg-purple-500 loader-dot" />
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 loader-dot" />
        </div>
      </div>
    );
  }

  return (
    <_Context.Provider
      value={{
        currentUser,
        login,
        register,
        logout,
        chats,
        activeChat,
        activeChatId,
        createChat,
        switchChat,
        deleteChat,
        renameChat,
        onSent,
        input,
        setInput,
        loading,
        streaming,
        searchQuery,
        setSearchQuery,
        filteredChats,
        theme,
        toggleTheme,
        setTheme,
        accent,
        setAccent,
        fontSize,
        setFontSize,
        sidebarOpen,
        setSidebarOpen,
        sidebarExtended,
        setSidebarExtended,
        settingsOpen,
        setSettingsOpen,
        searchModalOpen,
        setSearchModalOpen,
        clearAllChats,
        models,
        selectedModel,
        setSelectedModel,
        searchEnabled,
        setSearchEnabled,
        imageMode,
        setImageMode,
        thinkingLevel,
        setThinkingLevel,
        customInstructions,
        setCustomInstructions,
        sources,
        stopGeneration,
        regenerateResponse,
        editMessage,
        pinChat,
        setFeedback,
        exportChat,
      }}
    >
      {children}
    </_Context.Provider>
  );
};

export { _Context as Context };
export default ContextProvider;
