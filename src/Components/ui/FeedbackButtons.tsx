import { PiThumbsUpBold, PiThumbsDownBold, PiArrowClockwiseBold, PiCopyBold, PiCheckBold } from "react-icons/pi";
import { useState } from "react";

interface FeedbackButtonsProps {
  messageId: string;
  isLast: boolean;
  isStreaming: boolean;
  onRegenerate: () => void;
  content: string;
}

const FeedbackButtons = ({ messageId, isLast, isStreaming, onRegenerate, content }: FeedbackButtonsProps) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isLast || isStreaming) return null;

  return (
    <div className="flex items-center gap-1 mt-2 animate-fade-in">
      <button
        onClick={() => setLiked(liked === true ? null : true)}
        className={`p-1.5 rounded-lg transition-colors ${
          liked === true
            ? "text-accent bg-accent/10"
            : "text-txt-muted hover:text-txt hover:bg-surface-2"
        }`}
        title="Good response"
      >
        <PiThumbsUpBold className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => setLiked(liked === false ? null : false)}
        className={`p-1.5 rounded-lg transition-colors ${
          liked === false
            ? "text-red-400 bg-red-500/10"
            : "text-txt-muted hover:text-txt hover:bg-surface-2"
        }`}
        title="Bad response"
      >
        <PiThumbsDownBold className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={handleCopy}
        className="p-1.5 rounded-lg text-txt-muted hover:text-txt hover:bg-surface-2 transition-colors"
        title="Copy"
      >
        {copied ? <PiCheckBold className="w-3.5 h-3.5 text-green-400" /> : <PiCopyBold className="w-3.5 h-3.5" />}
      </button>
      <button
        onClick={onRegenerate}
        className="p-1.5 rounded-lg text-txt-muted hover:text-txt hover:bg-surface-2 transition-colors"
        title="Regenerate"
      >
        <PiArrowClockwiseBold className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default FeedbackButtons;
