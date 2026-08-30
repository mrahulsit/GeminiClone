import { Link } from "react-router-dom";
import { PiCodeBold, PiLightbulbBold, PiPencilSimpleBold, PiBookOpenBold } from "react-icons/pi";
import ScrollReveal from "./ScrollReveal";
import TiltCard from "./TiltCard";
import { useStagger } from "../../hooks/useReveal";
import { useGlow } from "../../hooks/useGlow";

const UseCases = () => {
  const { ref, visible, delays } = useStagger(4, { delayMs: 110 });
  const { onMouseMove } = useGlow();

  const useCases = [
    {
      title: "Write Code",
      description: "Generate production-ready code in any language or framework",
      icon: PiCodeBold,
      bg: "from-indigo-600/10 to-indigo-500/10",
      border: "border-indigo-600/20",
    },
    {
      title: "Explain Concepts",
      description: "Break down complex topics into easy-to-understand explanations",
      icon: PiLightbulbBold,
      bg: "from-purple-600/10 to-pink-600/10",
      border: "border-purple-600/20",
    },
    {
      title: "Help Me Write",
      description: "Generate emails, documents, and content in your voice",
      icon: PiPencilSimpleBold,
      bg: "from-orange-600/10 to-yellow-600/10",
      border: "border-orange-600/20",
    },
    {
      title: "Learn Something New",
      description: "Teach yourself topics with practical examples and analogies",
      icon: PiBookOpenBold,
      bg: "from-green-600/10 to-emerald-600/10",
      border: "border-green-600/20",
    },
  ];

  return (
    <section
      id="use-cases"
      className="landing-section landing-section-divider bg-gray-900"
    >
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal variant="up" className="text-center mb-16">
          <span className="text-xs font-semibold text-indigo-500 uppercase tracking-widest">
            Use Cases
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mt-3 mb-4">
            What You Can Build
          </h2>
          <p className="text-txt-secondary max-w-lg mx-auto">
            Discover what's possible with Lumina AI.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
          {useCases.map((useCase) => (
            <div
              key={useCase.title}
              className={`reveal ${visible ? "reveal-in" : ""}`}
              style={{ animationDelay: visible ? delays[useCases.indexOf(useCase)] : undefined }}
            >
              <TiltCard>
                <div
                  className={`card-glow relative h-full rounded-2xl border p-7 transition-all duration-300 hover:shadow-xl hover:shadow-gray-800/30 ${
                    useCase.bg
                  }`}
                  onMouseMove={onMouseMove}
                >
                  {/* Icon */}
                  <div className="mb-5 flex items-center justify-center">
                    <useCase.icon
                      className={`w-10 h-10 ${useCase.bg.includes("indigo") ? "text-indigo-400" : useCase.bg.includes("purple") ? "text-purple-400" : useCase.bg.includes("orange") ? "text-orange-400" : "text-green-400"}`}
                    />
                  </div>

                  {/* Header */}
                  <div className="mb-4">
                    <h3 className="text-base font-semibold text-gray-100 mb-1">
                      {useCase.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {useCase.description}
                    </p>
                  </div>
                </div>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;