import { useState } from "react";
import { PiCaretDownBold, PiSparkleBold } from "react-icons/pi";

interface ThinkingBlockProps {
  messageId: string;
  thinking?: string;
  isStreaming: boolean;
}

const ThinkingBlock = ({ messageId, thinking, isStreaming }: ThinkingBlockProps) => {
  const [expanded, setExpanded] = useState(false);

  if (!thinking) return null;

  return (
    <div className="mb-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-2/50 hover:bg-surface-2 text-txt-muted hover:text-txt transition-colors text-xs font-medium"
      >
        <PiSparkleBold className="w-3.5 h-3.5 text-accent" />
        <span>Thoughts</span>
        {isStreaming && (
          <span className="flex gap-0.5 ml-1">
            <span className="w-1 h-1 rounded-full bg-accent animate-pulse" />
            <span className="w-1 h-1 rounded-full bg-purple-500 animate-pulse [animation-delay:150ms]" />
            <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse [animation-delay:300ms]" />
          </span>
        )}
        <PiCaretDownBold className={`w-3 h-3 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
      </button>
      {expanded && (
        <div className="mt-2 px-3 py-2 rounded-lg bg-surface-2/30 border border-border/50 text-xs text-txt-muted leading-relaxed whitespace-pre-wrap animate-fade-in">
          {thinking}
        </div>
      )}
    </div>
  );
};

export default ThinkingBlock;
