import { useContext, useRef, useEffect, useState } from "react";
import { Context } from "../../context/context";
import {
  PiPaperPlaneRightBold,
  PiPaperclipBold,
  PiListBold,
  PiStopBold,
  PiGlobeBold,
  PiImageBold,
  PiSparkleBold,
  PiCaretDownBold,
  PiLightningBold,
} from "react-icons/pi";
import MarkdownRenderer from "../ui/MarkdownRenderer";
import FeedbackButtons from "../ui/FeedbackButtons";
import ThinkingBlock from "./ThinkingBlock";
import SuggestionCards from "./SuggestionCards";
import ImageMessage from "./ImageMessage";
import SourceLinks from "./SourceLinks";

const MODEL_LABELS: Record<string, string> = {
  "gemini-2.5-flash": "2.5 Flash",
  "gemini-2.5-pro": "2.5 Pro",
  "gemini-3.6-flash": "3.6 Flash",
};

const MODEL_OPTIONS = [
  { value: "gemini-2.5-flash", label: "2.5 Flash", icon: PiLightningBold, desc: "Fast & efficient" },
  { value: "gemini-2.5-pro", label: "2.5 Pro", icon: PiSparkleBold, desc: "Most capable" },
  { value: "gemini-3.6-flash", label: "3.6 Flash", icon: PiSparkleBold, desc: "Latest model" },
];

const ChatWindow = () => {
  const {
    activeChat,
    selectedModel,
    setSelectedModel,
    input,
    setInput,
    onSent,
    streaming,
    loading,
    stopGeneration,
    searchEnabled,
    setSearchEnabled,
    imageMode,
    setImageMode,
    thinkingLevel,
    setSidebarOpen,
    theme,
  } = useContext(Context);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [modelOpen, setModelOpen] = useState(false);

  const salutations = ["Hello", "Hi", "Hey", "Welcome", "Greetings"];
  const getGreeting = () => salutations[new Date().getHours() % salutations.length];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() || streaming) {
        if (streaming) stopGeneration();
        else onSent();
      }
    }
  };

  const handleSend = () => {
    if (streaming) {
      stopGeneration();
    } else if (input.trim()) {
      onSent();
    }
  };

  const handleSuggestion = (prompt: string) => {
    setInput(prompt);
    setTimeout(() => onSent(), 100);
  };

  const messages = activeChat?.messages || [];
  const hasMessages = messages.length > 0;

  return (
    <div className="flex-1 flex flex-col h-screen min-w-0 bg-black">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-black shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-700 text-gray-300 transition-colors"
          >
            <PiListBold className="w-5 h-5" />
          </button>
          <div className="relative">
            <button
              onClick={() => setModelOpen(!modelOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-700 transition-colors text-sm font-medium text-gray-200"
            >
              <span>{MODEL_LABELS[selectedModel] || selectedModel}</span>
              <PiCaretDownBold className={`w-3.5 h-3.5 text-gray-400 transition-transform ${modelOpen ? "rotate-180" : ""}`} />
            </button>
            {modelOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setModelOpen(false)} />
                <div className="absolute top-full left-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl shadow-black/20 z-50 animate-fade-in p-1.5">
                  {MODEL_OPTIONS.map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.value}
                        onClick={() => { setSelectedModel(m.value); setModelOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                          selectedModel === m.value
                            ? "bg-indigo-600/20 text-indigo-400"
                            : "text-gray-300 hover:bg-gray-800"
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <div>
                          <p className="text-sm font-medium">{m.label}</p>
                          <p className="text-[11px] text-gray-500">{m.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchEnabled(!searchEnabled)}
            className={`p-2 rounded-xl transition-colors ${
              searchEnabled ? "text-indigo-400 bg-indigo-600/20" : "text-gray-400 hover:bg-gray-800"
            }`}
            title="Web search"
          >
            <PiGlobeBold className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={() => setImageMode(!imageMode)}
            className={`p-2 rounded-xl transition-colors ${
              imageMode ? "text-indigo-400 bg-indigo-600/20" : "text-gray-400 hover:bg-gray-800"
            }`}
            title="Image generation"
          >
            <PiImageBold className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {!hasMessages ? (
          <div className="flex-1 flex flex-col items-center justify-center py-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <PiSparkleBold className="w-8 h-8 text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-100">
                {getGreeting()}, there
              </h2>
              <p className="text-sm text-gray-500 mt-2 max-w-md">
                How can I help you today? I can write code, explain concepts, help with writing, and much more.
              </p>
            </div>
            <SuggestionCards onSend={handleSuggestion} />
          </div>
        ) : (
          <div className="flex-1 flex flex-col px-4 py-6 overflow-y-auto">
            {messages.map((msg, idx) => {
              const isUser = msg.role === "user";
              const isLast = idx === messages.length - 1;

              return (
                <div key={msg.id || idx} className={`mb-6 ${isUser ? "self-end" : ""}`}>
                  {!isUser && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
                        <PiSparkleBold className="w-3 h-3 text-indigo-400" />
                      </div>
                      <span className="text-xs font-medium text-gray-400">Lumina</span>
                    </div>
                  )}
                  <div className={`${isUser ? "max-w-[80%]" : ""}`}>
                    {!isUser && msg.thinking && (
                      <ThinkingBlock
                        messageId={msg.id || String(idx)}
                        thinking={msg.thinking}
                        isStreaming={isLast && streaming}
                      />
                    )}
                    {isUser ? (
                      <div className="bg-gray-900 border border-gray-700 rounded-2xl rounded-tr px-4 py-3 text-sm text-gray-100 max-w-[80%]">
                        {msg.content}
                      </div>
                    ) : (
                      <div>
                        {msg.imageUrl ? (
                          <ImageMessage imageUrl={msg.imageUrl} />
                        ) : (
                          <MarkdownRenderer content={msg.content || ""} />
                        )}
                        {msg.sources && <SourceLinks sources={msg.sources} />}
                        <FeedbackButtons
                          messageId={msg.id || String(idx)}
                          isLast={isLast}
                          isStreaming={isLast && streaming}
                          onRegenerate={() => onSent()}
                          content={msg.content || ""}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {loading && !streaming && (
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
                  <PiSparkleBold className="w-3 h-3 text-indigo-400" />
                </div>
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse [animation-delay:150ms]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="shrink-0 px-4 pb-4 pt-2 bg-black border-t border-border">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={imageMode ? "Describe the image you want to create..." : "Message Lumina..."}
              rows={1}
              className="flex-1 bg-gray-900 border border-gray-700 rounded-xl rounded-bl-2xl outline-none text-sm text-gray-100 placeholder:text-gray-400 resize-none max-h-[200px] px-4 py-3"
            />
            <div className="flex items-center gap-1">
              {streaming ? (
                <button
                  onClick={handleSend}
                  className="p-2 rounded-xl bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
                  title="Stop generation"
                >
                  <PiStopBold className="w-4 h-4 text-red-400" />
                </button>
              ) : (
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="p-2 rounded-xl bg-indigo-600 text-white hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  title="Send message"
                >
                  <PiPaperPlaneRightBold className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
          </div>
          <p className="text-center text-[10px] text-gray-500 mt-2">
            Lumina can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;