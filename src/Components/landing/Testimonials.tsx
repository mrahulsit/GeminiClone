import ScrollReveal from "./ScrollReveal";
import { useStagger } from "../../hooks/useReveal";
import { useGlow } from "../../hooks/useGlow";

const Testimonials = () => {
  const { ref, visible, delays } = useStagger(3, { delayMs: 110 });
  const { onMouseMove } = useGlow();

  const testimonials = [
    {
      name: "Alexandre",
      role: "Software Engineer",
      content:
        "Lumina has become my pair programmer. It writes clean code, catches bugs, and explains concepts perfectly.",
      avatar: "/lumina-logo-light.png",
    },
    {
      name: "Maria",
      role: "Designer",
      content:
        "The image generation is incredible. I can create unique visuals for my projects in seconds.",
      avatar: "/lumina-logo-light.png",
    },
    {
      name: "James",
      role: "Product Manager",
      content:
        "The thinking display is a game-changer. I can see the AI's reasoning and trust its outputs more.",
      avatar: "/lumina-logo-light.png",
    },
  ];

  return (
    <section
      id="testimonials"
      className="landing-section bg-gray-900"
    >
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal variant="up" className="text-center mb-16">
          <span className="text-xs font-semibold text-indigo-500 uppercase tracking-widest">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mt-3 mb-4">
            What Users Say
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <div
              key={testimonial.name}
              className={`reveal ${visible ? "reveal-in" : ""} bg-gray-800 rounded-2xl p-6 border border-gray-700 transition-all hover:shadow-xl duration-300`}
              style={{ animationDelay: visible ? delays[idx] : undefined }}
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border border-gray-700"
                />
                <div>
                  <p className="text-sm font-medium text-gray-100">{testimonial.name}</p>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <blockquote className="blockquote">
                <p className="text-gray-400 quoting">
                  {testimonial.content}
                </p>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Quote component for testimonial styling
const Quote = ({ children }: { children: React.ReactNode }) => (
  <p className="border-l-4 border-indigo-600 pl-4 italic text-lg line-clamp-4">
    {children}
  </p>
);

Quote.displayName = "Quote";

export default Testimonials;