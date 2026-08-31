import { useState } from "react";
import { PiDownloadSimpleBold } from "react-icons/pi";

interface GeneratedImage {
  mimeType: string;
  data: string;
}

interface ImageMessageProps {
  images?: GeneratedImage[];
  imageUrl?: string;
  prompt?: string;
}

const ImageMessage = ({ images, imageUrl, prompt }: ImageMessageProps) => {
  const [copied, setCopied] = useState(false);

  const toDataUrl = (img: GeneratedImage) =>
    `data:${img.mimeType || "image/png"};base64,${img.data}`;

  const downloadImage = (src: string, index: number) => {
    const a = document.createElement("a");
    a.href = src;
    a.download = `lumina-image-${Date.now()}-${index + 1}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const copyPrompt = async () => {
    if (!prompt) return;
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const allImages =
    images && images.length > 0
      ? images.map(toDataUrl)
      : imageUrl
      ? [imageUrl]
      : [];

  if (allImages.length === 0) return null;

  return (
    <div className="mt-2 space-y-3">
      {prompt && (
        <button
          onClick={copyPrompt}
          className="text-xs text-txt-muted italic text-left hover:text-txt transition-colors cursor-pointer flex items-center gap-1.5"
          title="Copy prompt"
        >
          <span>"{prompt}"</span>
          <span className="text-[10px] not-italic shrink-0">
            {copied ? "Copied!" : "Copy prompt"}
          </span>
        </button>
      )}
      <div className="flex flex-wrap gap-3">
        {allImages.map((src, i) => (
          <div key={i} className="relative group inline-block">
            <img
              src={src}
              alt={prompt ? `${prompt} — image ${i + 1}` : `Generated image ${i + 1}`}
              className="max-w-sm w-full rounded-xl border border-border shadow-lg"
            />
            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => downloadImage(src, i)}
                className="p-2 rounded-lg bg-surface-1/90 backdrop-blur-sm border border-border hover:bg-surface-2 transition-colors"
                title="Download image"
              >
                <PiDownloadSimpleBold className="w-4 h-4 text-txt-secondary" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageMessage;