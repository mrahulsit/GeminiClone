import { useState, useRef, useEffect } from "react";
import {
  PiEyeBold,
  PiCodeBold,
  PiCopyBold,
  PiCheckBold,
  PiDownloadBold,
  PiArrowsOutBold,
} from "react-icons/pi";

interface HtmlViewerProps {
  html: string;
}

const HtmlViewer = ({ html }: HtmlViewerProps) => {
  const [mode, setMode] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState(300);

  // Post the HTML content to the iframe after it loads
  const fullHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${html.includes("<style>") ? "" : `body{margin:0;padding:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111;background:#fff;line-height:1.6}a{color:#6366f1}`}</style>
</head>
<body>
${html}
</body>
</html>
`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Resize iframe to fit content
  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        const height = Math.max(
          doc.body.scrollHeight,
          doc.documentElement.scrollHeight,
          doc.body.offsetHeight,
          doc.documentElement.offsetHeight,
          200
        );
        setIframeHeight(height);
      }
    }
  }, [html]);

  // Send HTML to iframe on mode change or content change
  useEffect(() => {
    if (mode === "preview" && iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(fullHtml);
        doc.close();
      }
    }
  }, [mode, html]);

  return (
    <div className="my-4 rounded-xl border border-border bg-surface-1 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-surface-2/50 border-b border-border">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMode("preview")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              mode === "preview"
                ? "bg-accent/10 text-accent"
                : "text-txt-muted hover:text-txt hover:bg-surface-3"
            }`}
          >
            <PiEyeBold className="w-3.5 h-3.5" />
            Preview
          </button>
          <button
            onClick={() => setMode("code")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              mode === "code"
                ? "bg-accent/10 text-accent"
                : "text-txt-muted hover:text-txt hover:bg-surface-3"
            }`}
          >
            <PiCodeBold className="w-3.5 h-3.5" />
            Code
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg hover:bg-surface-3 text-txt-muted hover:text-txt transition-colors"
            title="Copy HTML"
          >
            {copied ? (
              <PiCheckBold className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <PiCopyBold className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            onClick={() => {
              const blob = new Blob([html], { type: "text/html" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "preview.html";
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="p-1.5 rounded-lg hover:bg-surface-3 text-txt-muted hover:text-txt transition-colors"
            title="Download HTML"
          >
            <PiDownloadBold className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-surface-1 overflow-hidden">
        {mode === "preview" ? (
          <iframe
            ref={iframeRef}
            title="Live HTML Preview"
            sandbox="allow-scripts allow-styles allow-popups allow-popups-to-escape-sandbox"
            className="w-full border-none"
            style={{ height: `${iframeHeight}px` }}
            srcDoc={fullHtml}
          />
        ) : (
          <pre className="p-4 overflow-x-auto text-sm leading-relaxed text-txt-secondary">
            <code>{html}</code>
          </pre>
        )}
      </div>
    </div>
  );
};

export default HtmlViewer;
