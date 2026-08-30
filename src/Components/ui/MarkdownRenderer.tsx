import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import { PiCopyBold, PiCheckBold } from "react-icons/pi";
import { useState } from "react";

interface MarkdownRendererProps {
  content: string;
}

const CodeBlock = ({ language, children }: { language?: string; children: React.ReactNode }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = String(children).replace(/\n$/, "");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-3 rounded-xl overflow-hidden border border-border bg-surface-2">
      {language && (
        <div className="flex items-center justify-between px-4 py-2 bg-surface-3/50 border-b border-border">
          <span className="text-[11px] text-txt-muted font-mono">{language}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] text-txt-muted hover:text-txt transition-colors"
          >
            {copied ? <PiCheckBold className="w-3 h-3" /> : <PiCopyBold className="w-3 h-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
        <code className="text-txt-secondary">{children}</code>
      </pre>
    </div>
  );
};

const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  return (
    <div className="prose-custom text-sm leading-relaxed w-full">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeKatex]}
        components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const isInline = !match && !className;
          if (isInline) {
            return (
              <code className="px-1.5 py-0.5 rounded-md bg-surface-2 text-accent text-[13px] font-mono" {...props}>
                {children}
              </code>
            );
          }
          return <CodeBlock language={match?.[1]}>{children}</CodeBlock>;
        },
        a({ href, children, ...props }) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
              {...props}
            >
              {children}
            </a>
          );
        },
        p({ children, ...props }) {
          return <p className="mb-2 last:mb-0" {...props}>{children}</p>;
        },
        ul({ children, ...props }) {
          return <ul className="list-disc list-inside mb-2 space-y-1" {...props}>{children}</ul>;
        },
        ol({ children, ...props }) {
          return <ol className="list-decimal list-inside mb-2 space-y-1" {...props}>{children}</ol>;
        },
        li({ children, ...props }) {
          return <li className="text-txt-secondary" {...props}>{children}</li>;
        },
        h1({ children, ...props }) {
          return <h1 className="text-xl font-bold text-txt mb-2 mt-4" {...props}>{children}</h1>;
        },
        h2({ children, ...props }) {
          return <h2 className="text-lg font-bold text-txt mb-2 mt-3" {...props}>{children}</h2>;
        },
        h3({ children, ...props }) {
          return <h3 className="text-base font-semibold text-txt mb-1 mt-3" {...props}>{children}</h3>;
        },
        blockquote({ children, ...props }) {
          return (
            <blockquote className="border-l-3 border-accent/40 pl-3 my-2 text-txt-muted italic" {...props}>
              {children}
            </blockquote>
          );
        },
        table({ children, ...props }) {
          return (
            <div className="overflow-x-auto my-2">
              <table className="w-full text-sm border border-border rounded-lg overflow-hidden" {...props}>
                {children}
              </table>
            </div>
          );
        },
        th({ children, ...props }) {
          return <th className="px-3 py-2 bg-surface-2 text-left font-semibold text-txt border-b border-border" {...props}>{children}</th>;
        },
        td({ children, ...props }) {
          return <td className="px-3 py-2 border-b border-border text-txt-secondary" {...props}>{children}</td>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
