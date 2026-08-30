import { PiCodeBold, PiLightbulbBold, PiPencilSimpleBold, PiBookOpenBold } from "react-icons/pi";

interface SuggestionCardsProps {
  onSend: (prompt: string) => void;
}

const suggestions = [
  {
    icon: PiCodeBold,
    title: "Write code",
    prompt: "Write a React component that fetches and displays a list of users",
    gradient: "from-blue-500/10 to-cyan-500/10",
    border: "border-blue-500/15",
    iconColor: "text-blue-400",
  },
  {
    icon: PiLightbulbBold,
    title: "Explain concepts",
    prompt: "Explain how React hooks work under the hood",
    gradient: "from-purple-500/10 to-pink-500/10",
    border: "border-purple-500/15",
    iconColor: "text-purple-400",
  },
  {
    icon: PiPencilSimpleBold,
    title: "Help me write",
    prompt: "Help me write a professional email to request a deadline extension",
    gradient: "from-orange-500/10 to-yellow-500/10",
    border: "border-orange-500/15",
    iconColor: "text-orange-400",
  },
  {
    icon: PiBookOpenBold,
    title: "Learn something new",
    prompt: "Teach me about TypeScript generics with practical examples",
    gradient: "from-green-500/10 to-emerald-500/10",
    border: "border-green-500/15",
    iconColor: "text-green-400",
  },
];

const SuggestionCards = ({ onSend }: SuggestionCardsProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 max-w-xl mx-auto mt-8">
      {suggestions.map((s) => {
        const Icon = s.icon;
        return (
          <button
            key={s.title}
            onClick={() => onSend(s.prompt)}
            className={`flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br ${s.gradient} border ${s.border}
              hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-left`}
          >
            <div className={`mt-0.5 ${s.iconColor}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-txt">{s.title}</p>
              <p className="text-xs text-txt-muted mt-1 line-clamp-2">{s.prompt}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default SuggestionCards;
