import { useGlow } from "../../hooks/useGlow";
import ScrollReveal from "./ScrollReveal";
import TiltCard from "./TiltCard";
import { useStagger } from "../../hooks/useReveal";

const Hero = () => {
  const { ref, visible, delays } = useStagger(1, { delayMs: 110 });
  const { onMouseMove } = useGlow();

  return (
    <section
      id="hero"
      className="min-h-screen bg-gray-900 flex items-center justify-center relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-600/20 rounded-full animate-spin" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full animate-spin" />
      </div>

      <div className="relative flex flex-col items-center justify-center px-6 py-12 text-center">
        <ScrollReveal variant="up" className="mb-8">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-100 mb-4 tracking-tight">
            Think Smarter. Build Faster.
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            An AI-powered chat assistant for coding, reasoning, and creation.
          </p>
        </ScrollReveal>

        <div className="flex gap-4 mt-8 pt-8 border-t border-gray-700">
          <button
            onClick={() => {}}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors"
          >
            Start Chatting
          </button>
          <button
            onClick={() => {}}
            className="px-6 py-3 rounded-xl border border-indigo-600 text-indigo-400 font-medium hover:bg-indigo-600/20 transition-colors"
          >
            Watch Demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;