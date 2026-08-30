import { useContext, useState, useEffect, useRef, useCallback } from "react";
import { Context } from "../../context/context";
import { api } from "../../utils/api";
import { useDebounce } from "../../hooks/useDebounce";
import { SearchResult } from "../../types";
import {
  PiChatCircleTextLight,
  PiChatCircleTextBold,
  PiClockLight,
  PiArrowRightLight,
  PiMagnifyingGlassLight,
  PiXLight,
  PiCommandLight,
} from "react-icons/pi";

const SearchModal = () => {
  const { searchModalOpen, setSearchModalOpen, switchChat, chats } = useContext(Context);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (searchModalOpen) {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [searchModalOpen]);

  useEffect(() => {
    if (!debouncedQuery.trim()) { setResults([]); setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    api<{ results: SearchResult[] }>(`/api/chats/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then(({ results }) => { if (!cancelled) { setResults(results); setSelectedIndex(0); } })
      .catch(() => { if (!cancelled) setResults([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [debouncedQuery]);

  useEffect(() => {
    if (!listRef.current) return;
    const items = listRef.current.querySelectorAll("[data-result]");
    items[selectedIndex]?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const list = query.trim() ? results : recentChats;
    if (e.key === "Escape") setSearchModalOpen(false);
    else if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, Math.max(0, list.length - 1))); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter") { if (list[selectedIndex]) { switchChat(list[selectedIndex].id); setSearchModalOpen(false); } }
  }, [results, query, selectedIndex, switchChat, setSearchModalOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchModalOpen((p) => !p); } };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setSearchModalOpen]);

  useEffect(() => {
    if (!searchModalOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setSearchModalOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [searchModalOpen, setSearchModalOpen]);

  if (!searchModalOpen) return null;

  const recentChats = chats.slice(0, 8);
  const showResults = query.trim() && results.length > 0;
  const showLoading = loading && query.trim();
  const showEmpty = !loading && query.trim() && results.length === 0;
  const showRecent = !query.trim() && recentChats.length > 0;
  const showNoRecents = !query.trim() && recentChats.length === 0;

  const formatDate = (ts: number) => {
    const d = new Date(ts); const now = new Date(); const diff = now.getTime() - d.getTime(); const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today"; if (days === 1) return "Yesterday"; if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const highlightMatch = (text: string, q: string) => {
    if (!q.trim()) return text;
    const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    return text.split(regex).map((part, i) => regex.test(part) ? <mark key={i} className="bg-accent/20 text-accent">{part}</mark> : part);
  };

  const truncateSnippet = (text: string, q: string) => {
    if (!text) return "";
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text.slice(0, 100) + (text.length > 100 ? "..." : "");
    const start = Math.max(0, idx - 40); const end = Math.min(text.length, idx + q.length + 80);
    return (start > 0 ? "…" : "") + text.slice(start, end) + (end < text.length ? "…" : "");
  };

  const listLength = query.trim() ? results.length : recentChats.length;

  return (
    <>
      <div className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setSearchModalOpen(false)} />
      <div className="fixed inset-0 z-[90] flex items-start justify-center pt-[12vh] px-4 animate-fade-in">
        <div className="w-full max-w-2xl bg-surface-1 border border-border rounded-2xl shadow-2xl shadow-black/40 overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-3 px-4 py-3.5">
            <PiMagnifyingGlassLight className="w-5 h-5 text-txt-muted flex-shrink-0" />
            <input ref={inputRef} value={query} onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }} onKeyDown={handleKeyDown} placeholder="Search conversations..." className="flex-1 bg-transparent border-none outline-none text-base text-txt placeholder:text-txt-muted font-sans" />
            {query && <button onClick={() => setQuery("")} className="p-1 rounded-md hover:bg-surface-2 text-txt-muted hover:text-txt transition-colors"><PiXLight className="w-4 h-4" /></button>}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-2 text-[10px] text-txt-muted font-mono border border-border"><PiCommandLight className="w-3 h-3" />K</div>
          </div>
          <div className="h-px bg-border" />
          <div ref={listRef} className="max-h-[280px] overflow-y-auto">
            {showLoading && <div className="flex items-center justify-center py-12"><div className="flex gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /><div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse [animation-delay:150ms]" /><div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse [animation-delay:300ms]" /></div></div>}
            {showEmpty && <div className="py-10 text-center"><div className="w-12 h-12 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto mb-3"><PiMagnifyingGlassLight className="w-5 h-5 text-txt-muted" /></div><p className="text-sm text-txt-muted">No results for "{query}"</p></div>}
            {showResults && (
              <div className="py-1">
                {results.map((chat, idx) => (
                  <button key={chat.id} data-result onClick={() => { switchChat(chat.id); setSearchModalOpen(false); }} onMouseEnter={() => setSelectedIndex(idx)} className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors duration-150 ${idx === selectedIndex ? "bg-surface-2" : "hover:bg-surface-2/50"}`}>
                    <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center transition-colors ${idx === selectedIndex ? "bg-accent/20 text-accent" : "bg-surface-3/50 text-txt-muted"}`}><PiChatCircleTextLight className="w-4 h-4" /></div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${idx === selectedIndex ? "text-txt" : "text-txt-secondary"}`}>{highlightMatch(chat.title, query)}</p>
                      <p className="text-xs text-txt-muted mt-0.5 line-clamp-1">{truncateSnippet(chat.snippet || "", query)}</p>
                    </div>
                    <span className={`text-[10px] text-txt-muted flex-shrink-0 mt-0.5 ${idx === selectedIndex ? "text-txt" : ""}`}>{formatDate(chat.updated_at)}</span>
                  </button>
                ))}
              </div>
            )}
            {showRecent && (
              <div className="py-1">
                <div className="px-4 py-2 border-b border-border"><p className="text-[11px] font-medium text-txt-muted uppercase tracking-wider">Recent</p></div>
                {recentChats.map((chat, idx) => (
                  <button key={chat.id} data-result onClick={() => { switchChat(chat.id); setSearchModalOpen(false); }} onMouseEnter={() => setSelectedIndex(idx)} className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-150 ${idx === selectedIndex ? "bg-surface-2" : "hover:bg-surface-2/50"}`}>
                    <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${idx === selectedIndex ? "bg-accent/20 text-accent" : "bg-surface-3/50 text-txt-muted"}`}><PiChatCircleTextBold className="w-4 h-4" /></div>
                    <div className="flex-1 min-w-0"><p className={`text-sm truncate ${idx === selectedIndex ? "text-txt" : "text-txt-secondary"}`}>{chat.title}</p></div>
                    <span className={`text-[10px] text-txt-muted flex-shrink-0 ${idx === selectedIndex ? "text-txt" : ""}`}>{formatDate(chat.updatedAt)}</span>
                  </button>
                ))}
              </div>
            )}
            {showNoRecents && <div className="py-10 text-center"><div className="w-12 h-12 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto mb-3"><PiChatCircleTextLight className="w-5 h-5 text-txt-muted" /></div><p className="text-sm text-txt-muted">No conversations yet</p></div>}
          </div>
          {listLength > 0 && (
            <>
              <div className="h-px bg-border" />
              <div className="px-4 py-2.5 flex items-center justify-between text-[11px] text-txt-muted">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5"><kbd className="inline-flex items-center justify-center w-5 h-5 rounded bg-surface-2 text-[10px] font-mono border border-border">↑</kbd><kbd className="inline-flex items-center justify-center w-5 h-5 rounded bg-surface-2 text-[10px] font-mono border border-border">↓</kbd><span>Navigate</span></span>
                  <span className="flex items-center gap-1.5"><kbd className="inline-flex items-center justify-center w-5 h-5 rounded bg-surface-2 text-[10px] font-mono border border-border">↵</kbd><span>Select</span></span>
                </div>
                <span className="flex items-center gap-1.5"><kbd className="inline-flex items-center justify-center w-5 h-5 rounded bg-surface-2 text-[10px] font-mono border border-border">esc</kbd><span>Close</span></span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchModal;
