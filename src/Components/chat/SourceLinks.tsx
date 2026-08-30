import { PiLinkBold } from "react-icons/pi";
import { Source } from "../../types";

interface SourceLinksProps {
  sources: Source[];
}

const SourceLinks = ({ sources }: SourceLinksProps) => {
  if (sources.length === 0) return null;

  return (
    <div className="mt-4 pt-3 border-t border-border">
      <p className="text-[11px] text-txt-muted font-medium mb-2 flex items-center gap-1.5">
        <PiLinkBold className="w-3 h-3" /> Sources
      </p>
      <div className="flex flex-wrap gap-2">
        {sources.map((s, i) => (
          <a
            key={i}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-accent hover:underline bg-accent/5 px-2 py-1 rounded-md border border-accent/10"
          >
            {s.title}
          </a>
        ))}
      </div>
    </div>
  );
};

export default SourceLinks;
