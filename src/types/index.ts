/* ─── Shared Types ─── */

export type Theme = "dark" | "light";
export type FontSize = "sm" | "md" | "lg";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  feedback?: "like" | "dislike" | null;
  error?: boolean;
  images?: { mimeType: string; data: string }[];
  thinking?: string;
  imageUrl?: string;
  sources?: Source[];
  html?: string;
}

export interface Source {
  title: string;
  url: string;
  snippet: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  pinned?: boolean;
  model?: string | null;
}

export interface SearchResult {
  id: string;
  title: string;
  updated_at: number;
  snippet: string;
}

export interface ContextType {
  /* Auth */
  currentUser: User | null;
  login: (email: string, password: string) => Promise<string | null>;
  register: (name: string, email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;

  /* Chat */
  chats: Chat[];
  activeChat: Chat | null;
  activeChatId: string | null;
  createChat: () => Promise<string>;
  switchChat: (chatId: string) => void;
  deleteChat: (chatId: string) => Promise<void>;
  renameChat: (chatId: string, title: string) => Promise<void>;
  onSent: (prompt?: string) => Promise<void>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  streaming: boolean;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  filteredChats: Chat[];

  /* New chat features */
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  searchEnabled: boolean;
  setSearchEnabled: (v: boolean) => void;
  imageMode: boolean;
  setImageMode: (v: boolean) => void;
  thinkingLevel: string;
  setThinkingLevel: (v: string) => void;
  customInstructions: string;
  setCustomInstructions: (v: string) => void;
  sources: Source[];
  stopGeneration: () => void;
  regenerateResponse: () => Promise<void>;
  editMessage: (messageId: string, content: string) => Promise<void>;
  pinChat: (chatId: string) => Promise<void>;
  setFeedback: (messageId: string, feedback: "like" | "dislike" | null) => Promise<void>;
  exportChat: (chatId: string, format: "markdown" | "json") => void;

  /* Theme / Accent / Font */
  theme: Theme;
  toggleTheme: () => void;
  accent: string;
  setAccent: (color: string) => void;
  fontSize: FontSize;
  setFontSize: (s: FontSize) => void;

  /* UI */
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarExtended: boolean;
  setSidebarExtended: React.Dispatch<React.SetStateAction<boolean>>;
  settingsOpen: boolean;
  setSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchModalOpen: boolean;
  setSearchModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  clearAllChats: () => Promise<void>;
}
