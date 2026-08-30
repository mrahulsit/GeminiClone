import { PiDownloadSimpleBold } from "react-icons/pi";

interface ImageMessageProps {
  imageUrl: string;
  prompt?: string;
}

const ImageMessage = ({ imageUrl, prompt }: ImageMessageProps) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `lumina-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(imageUrl, "_blank");
    }
  };

  return (
    <div className="mt-2">
      {prompt && (
        <p className="text-xs text-txt-muted mb-2 italic">{prompt}</p>
      )}
      <div className="relative group inline-block">
        <img
          src={imageUrl}
          alt={prompt || "Generated image"}
          className="max-w-sm rounded-xl border border-border shadow-lg"
        />
        <button
          onClick={handleDownload}
          className="absolute top-2 right-2 p-2 rounded-lg bg-surface-1/80 backdrop-blur-sm border border-border
            opacity-0 group-hover:opacity-100 transition-opacity duration-200
            hover:bg-surface-2 text-txt-secondary hover:text-txt"
          title="Download image"
        >
          <PiDownloadSimpleBold className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ImageMessage;
