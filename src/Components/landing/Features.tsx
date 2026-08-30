import React from "react";
import { Link } from "react-router-dom";
import { PiCheckBold, PiSparkleBold, PiInfinityBold } from "react-icons/pi";
import ScrollReveal from "./ScrollReveal";
import TiltCard from "./TiltCard";
import { useStagger } from "../../hooks/useReveal";
import { useGlow } from "../../hooks/useGlow";

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType;
  color: string;
}

const FEATURES: Feature[] = [
  {
    id: 1,
    title: "Chat & Streaming",
    description: "Real-time AI conversations with streaming responses",
    icon: PiSparkleBold,
    color: "text-indigo-400",
  },
  {
    id: 2,
    title: "Image Generation",
    description: "Create and understand images with AI",
    icon: PiInfinityBold,
    color: "text-purple-400",
  },
  {
    id: 3,
    title: "Code Generation",
    description: "Write and explain code instantly",
    icon: PiCheckBold,
    color: "text-green-400",
  },
  {
    id: 4,
    title: "Thinking Display",
    description: "View the AI's reasoning process",
    icon: PiSparkleBold,
    color: "text-indigo-400",
  },
];

const Features = () => {
  const { ref, visible, delays } = useStagger(FEATURES.length, { delayMs: 110 });
  const { onMouseMove } = useGlow();

  return (
    <section
      id="features"
      className="landing-section landing-section-divider bg-gray-900"
    >
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal variant="up" className="text-center mb-16">
          <span className="text-xs font-semibold text-indigo-500 uppercase tracking-widest">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mt-3 mb-4">
            Powerful Features
          </h2>
          <p className="text-txt-secondary max-w-lg mx-auto">
            Everything you need to code, create, and collaborate with AI.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
          {FEATURES.map((feature) => (
            <div
              key={feature.id}
              className={`reveal ${visible ? "reveal-in" : ""}`}
              style={{ animationDelay: visible ? delays[feature.id - 1] : undefined }}
            >
              <TiltCard>
                <div
                  className={`card-glow relative h-full rounded-2xl border p-7 transition-all duration-300 hover:shadow-xl hover:shadow-gray-800/30 ${
                    feature.color === "text-indigo-400"
                      ? "bg-gray-800 border-gray-700 shadow-gray-700/20"
                      : feature.color === "text-purple-400"
                      ? "bg-gray-800 border-gray-700 shadow-purple-600/20"
                      : "bg-gray-800 border-gray-700 shadow-green-600/20"
                  }`}
                  onMouseMove={onMouseMove}
                >
                  {/* Icon */}
                  <div className="mb-5 flex items-center justify-center">
                    {React.createElement(feature.icon, { className: `w-10 h-10 ${feature.color}` })}
                  </div>

                  {/* Header */}
                  <div className="mb-4">
                    <h3 className="text-base font-semibold text-gray-100 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {feature.description}
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

export default Features;