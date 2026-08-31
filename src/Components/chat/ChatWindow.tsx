import { useContext, useRef, useEffect, useState } from "react";
import { Context } from "../../context/context";
import {
  PiPaperPlaneRightBold,
  PiListBold,
  PiStopBold,
  PiGlobeBold,
  PiImageBold,
  PiCaretDownBold,
  PiLightningBold,
  PiPencilSimpleBold,
  PiPlusBold,
  PiCheckBold,
  PiSunBold,
  PiMoonBold,
  PiBrainBold,
} from "react-icons/pi";
import MarkdownRenderer from "../ui/MarkdownRenderer";
import FeedbackButtons from "../ui/FeedbackButtons";
import ThinkingBlock from "./ThinkingBlock";
import SuggestionCards from "./SuggestionCards";
import ImageMessage from "./ImageMessage";
import SourceLinks from "./SourceLinks";

const THINKING_LEVELS = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
  { value: "none", label: "Off" },
];

const ChatWindow = () => {
  const {
    activeChat,
    models,
    selectedModel,
    setSelectedModel,
    input,
    setInput,
    onSent,
    streaming,
    loading,
    stopGeneration,
    regenerateResponse,
    searchEnabled,
    setSearchEnabled,
    imageMode,
    setImageMode,
    thinkingLevel,
    setThinkingLevel,
    setSidebarOpen,
    editMessage,
    createChat,
    theme,
    toggleTheme,
  } = useContext(Context);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [modelOpen, setModelOpen] = useState(false);
  const [thinkOpen, setThinkOpen] = useState(false);

  // Chat-capable models (excludes the dedicated image generation model)
  const chatModels =
    models.length > 0
      ? models.filter((m) => !m.supportsImageGen)
      : [
          { id: "gemini-3.6-flash", name: "Gemini 3.6 Flash", badge: "Flash", description: "Fast & efficient", supportsWebSearch: true, supportsImageGen: false, maxTokens: 1048576 },
          { id: "gemini-3.5-flash", name: "Gemini 3.5 Flash", badge: "Flash", description: "Frontier-class intelligence", supportsWebSearch: true, supportsImageGen: false, maxTokens: 1048576 },
          { id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash-Lite", badge: "Lite", description: "Fastest entry-level model", supportsWebSearch: true, supportsImageGen: false, maxTokens: 1048576 },
        ];
  const activeModel = chatModels.find((m) => m.id === selectedModel);
  const thinkingLabel = THINKING_LEVELS.find((t) => t.value === thinkingLevel)?.label || "Medium";

  const getGreeting = (): string => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 220) + "px";
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (streaming) stopGeneration();
      else if (input.trim()) onSent();
    }
  };

  const handleSend = () => {
    if (streaming) stopGeneration();
    else if (input.trim()) onSent();
  };

  const handleSuggestion = (prompt: string) => {
    setInput(prompt);
    setTimeout(() => onSent(), 100);
  };

  const messages = activeChat?.messages || [];
  const hasMessages = messages.length > 0;

  const composer = (
    <div className="max-w-3xl mx-auto w-full">
      <div
        className={`border rounded-3xl bg-surface-1 p-2.5 pb-2 shadow-lg shadow-black/5 transition-colors ${
          imageMode
            ? "border-accent/40 bg-accent/[0.03]"
            : "border-border focus-within:border-accent/50"
        }`}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            imageMode
              ? "Describe the image you want to create..."
              : "Ask me anything..."
          }
          rows={1}
          className="w-full bg-transparent border-none outline-none resize-none max-h-[220px] min-h-[44px] px-2.5 py-2 text-[15px] leading-relaxed text-txt placeholder:text-txt-muted"
        />

        {/* Controls row */}
        <div className="flex items-center justify-between gap-2 pl-1.5 pr-1">
          <div className="flex items-center gap-1 flex-wrap">
            {/* Model picker (opens upward) */}
            <div className="relative">
              <button
                onClick={() => { setThinkOpen(false); setModelOpen(!modelOpen); }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-surface-2/70 hover:bg-surface-2 text-txt-secondary hover:text-txt transition-colors text-xs font-medium"
                title="Select model"
              >
                <PiLightningBold className="w-3.5 h-3.5 text-accent" />
                <span className="max-w-[120px] sm:max-w-[170px] truncate">
                  {activeModel?.name || selectedModel}
                </span>
                <PiCaretDownBold className={`w-3 h-3 text-txt-muted transition-transform ${modelOpen ? "rotate-180" : ""}`} />
              </button>
              {modelOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setModelOpen(false)} />
                  <div className="absolute bottom-full left-0 mb-2 w-72 bg-surface-1 border border-border rounded-2xl shadow-2xl shadow-black/30 z-50 animate-scale-in p-1.5">
                    <p className="px-3 pt-2 pb-1.5 text-[11px] text-txt-muted font-semibold uppercase tracking-wider">
                      Select model
                    </p>
                    {chatModels.map((m) => {
                      const active = selectedModel === m.id;
                      return (
                        <button
                          key={m.id}
                          onClick={() => { setSelectedModel(m.id); setModelOpen(false); }}
                          className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-left transition-colors ${
                            active
                              ? "bg-accent/12 text-txt ring-1 ring-accent/25"
                              : "text-txt-secondary hover:bg-surface-2"
                          }`}
                        >
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${active ? "bg-accent/20" : "bg-surface-2"}`}>
                            <PiLightningBold className={`w-4 h-4 ${active ? "text-accent" : "text-txt-muted"}`} />
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="flex items-center gap-1.5 text-sm font-medium">
                              <span className="truncate">{m.name}</span>
                              {m.badge && (
                                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-accent/15 text-accent shrink-0">
                                  {m.badge}
                                </span>
                              )}
                            </span>
                            <span className="block text-[11px] text-txt-muted truncate">
                              {m.description}
                            </span>
                          </span>
                          {active && <PiCheckBold className="w-4 h-4 text-accent shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Thinking picker (opens upward) */}
            <div className="relative">
              <button
                onClick={() => { setModelOpen(false); setThinkOpen(!thinkOpen); }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-colors text-xs font-medium ${
                  thinkOpen || thinkingLevel !== "none"
                    ? "bg-accent/12 text-accent"
                    : "bg-surface-2/70 text-txt-secondary hover:bg-surface-2 hover:text-txt"
                }`}
                title="Thinking level"
              >
                <PiBrainBold className="w-3.5 h-3.5" />
                <span>Thinking · {thinkingLabel}</span>
                <PiCaretDownBold className={`w-3 h-3 transition-transform ${thinkOpen ? "rotate-180" : ""}`} />
              </button>
              {thinkOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setThinkOpen(false)} />
                  <div className="absolute bottom-full left-0 mb-2 w-48 bg-surface-1 border border-border rounded-2xl shadow-2xl shadow-black/30 z-50 animate-scale-in p-1.5">
                    <p className="px-3 pt-2 pb-1.5 text-[11px] text-txt-muted font-semibold uppercase tracking-wider">
                      Thinking level
                    </p>
                    {THINKING_LEVELS.map((t) => {
                      const active = thinkingLevel === t.value;
                      return (
                        <button
                          key={t.value}
                          onClick={() => { setThinkingLevel(t.value); setThinkOpen(false); }}
                          className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-sm text-left transition-colors ${
                            active ? "bg-accent/12 text-txt" : "text-txt-secondary hover:bg-surface-2"
                          }`}
                        >
                          {t.label}
                          {active && <PiCheckBold className="w-4 h-4 text-accent shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <div className="w-px h-5 bg-border mx-1" />

            <button
              onClick={() => setSearchEnabled(!searchEnabled)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-colors text-xs font-medium ${
                searchEnabled
                  ? "text-accent bg-accent/12"
                  : "text-txt-muted hover:bg-surface-2 hover:text-txt-secondary"
              }`}
              title="Toggle web search"
            >
              <PiGlobeBold className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search</span>
            </button>
            <button
              onClick={() => setImageMode(!imageMode)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-colors text-xs font-medium ${
                imageMode
                  ? "text-accent bg-accent/12"
                  : "text-txt-muted hover:bg-surface-2 hover:text-txt-secondary"
              }`}
              title="Toggle image generation"
            >
              <PiImageBold className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Images</span>
            </button>
          </div>

          {/* Send / Stop */}
          <div className="flex items-center gap-1">
            {streaming ? (
              <button
                onClick={handleSend}
                className="w-10 h-10 rounded-full bg-red-500/15 text-red-500 hover:bg-red-500/25 transition-colors flex items-center justify-center"
                title="Stop generation"
              >
                <PiStopBold className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="gradient-btn w-10 h-10 rounded-full text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none active:scale-95 transition-all"
                title={input.trim() ? "Send message" : "Type a message to send"}
              >
                <PiPaperPlaneRightBold className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
      <p className="text-center text-[10px] text-txt-muted mt-2">
        I can make mistakes. Check important info.
      </p>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-screen min-w-0 bg-surface-0">
      {/* Header */}
      <header className="flex items-center gap-2 px-3 sm:px-4 py-2.5 border-b border-border bg-surface-0/85 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-1 min-w-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-surface-2 text-txt-secondary transition-colors"
            aria-label="Open sidebar"
          >
            <PiListBold className="w-5 h-5" />
          </button>

          <button
            onClick={() => createChat()}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-2 rounded-xl hover:bg-surface-2 text-txt-secondary hover:text-txt transition-colors text-sm font-medium"
            title="New chat"
          >
            <PiPlusBold className="w-4 h-4" />
            <span className="hidden md:inline">New chat</span>
          </button>

          {hasMessages && (
            <p className="hidden md:block text-[13px] text-txt-muted font-medium truncate min-w-0 max-w-md pl-2">
              {activeChat?.title}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-txt-muted hover:bg-surface-2 hover:text-txt-secondary transition-colors"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <PiSunBold className="w-[18px] h-[18px]" /> : <PiMoonBold className="w-[18px] h-[18px]" />}
          </button>
        </div>
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {!hasMessages ? (
          <div className="flex-1 flex flex-col items-center justify-center py-10">
            <div className="text-center mb-10">
              <div className="w-14 h-14 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto mb-4 shadow-lg overflow-hidden">
                <img
                  src={theme === "dark" ? "/lumina-logo-light.png" : "/lumina-logo.png"}
                  alt="Lumina"
                  className="w-14 h-14 object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-txt font-display">
                {getGreeting()}
              </h2>
              <p className="text-sm text-txt-muted mt-2 max-w-md">
                How can I help you today? I can write code, explain concepts, help with writing, and much more.
              </p>
            </div>
            <div className="w-full max-w-xl">
              {composer}
            </div>
            <div className="mt-8 w-full max-w-xl">
              <SuggestionCards onSend={handleSuggestion} />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col w-full max-w-3xl mx-auto px-4 py-6">
            {messages.map((msg, idx) => {
              const isUser = msg.role === "user";
              const isLast = idx === messages.length - 1;

              return (
                <div key={msg.id || idx} className={`mb-6 ${isUser ? "flex justify-end" : ""}`}>
                  {isUser ? (
                    <div className="group/bubble relative max-w-[85%] min-w-0">
                      <div className="bg-surface-2 text-txt rounded-2xl rounded-br-md px-4 py-2.5 text-sm leading-relaxed shadow-sm border border-border/60">
                        {msg.content}
                      </div>
                      {isLast && !streaming && msg.id && (
                        <button
                          onClick={() => editMessage(msg.id, msg.content)}
                          className="absolute -bottom-4 left-1 p-1 rounded-md bg-surface-1 border border-border text-txt-muted hover:text-txt opacity-0 group-hover/bubble:opacity-100 transition-all"
                          title="Edit & resend"
                        >
                          <PiPencilSimpleBold className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div>
                      {msg.thinking && (
                        <ThinkingBlock
                          messageId={msg.id || String(idx)}
                          thinking={msg.thinking}
                          isStreaming={isLast && streaming}
                        />
                      )}
                      {msg.images && msg.images.length > 0 ? (
                        <ImageMessage images={msg.images} prompt={msg.content || ""} />
                      ) : msg.imageUrl ? (
                        <ImageMessage imageUrl={msg.imageUrl} />
                      ) : (
                        <MarkdownRenderer content={msg.content || ""} />
                      )}
                      {msg.sources && <SourceLinks sources={msg.sources} />}
                      <FeedbackButtons
                        messageId={msg.id || String(idx)}
                        feedback={msg.feedback ?? null}
                        isLast={isLast}
                        isStreaming={isLast && streaming}
                        onRegenerate={regenerateResponse}
                        content={msg.content || ""}
                      />
                    </div>
                  )}
                </div>
              );
            })}
            {loading && !streaming && (
              <div className="flex gap-1.5 mb-6 pl-1">
                <div className="w-1.5 h-1.5 rounded-full bg-accent loader-dot" />
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 loader-dot" />
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 loader-dot" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area (docked at bottom in messages view) */}
      {hasMessages && (
        <div className="shrink-0 px-4 pb-4 pt-2 bg-surface-0">
          {composer}
        </div>
      )}
    </div>
  );
};

export default ChatWindow;