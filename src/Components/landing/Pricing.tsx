import { Link } from "react-router-dom";
import { PiCheckBold, PiSparkleBold, PiInfinityBold } from "react-icons/pi";
import ScrollReveal from "./ScrollReveal";
import TiltCard from "./TiltCard";
import { useStagger } from "../../hooks/useReveal";
import { useGlow } from "../../hooks/useGlow";

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  badge?: string;
}

const tiers: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for exploring Lumina's capabilities.",
    features: [
      "50 messages per day",
      "Basic code generation",
      "Chat history (7 days)",
      "Community support",
    ],
    cta: "Get Started Free",
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description:
      "For developers who want the full Lumina experience.",
    features: [
      "Unlimited messages",
      "Advanced code generation",
      "Image understanding",
      "Priority streaming",
      "Chat history (unlimited)",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For teams and organizations.",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Custom model fine-tuning",
      "SSO & SAML",
      "Dedicated support",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
  },
];

const Pricing = () => {
  const { ref, visible, delays } = useStagger(tiers.length, { delayMs: 110 });
  const { onMouseMove } = useGlow();

  return (
    <section
      id="pricing"
      className="landing-section landing-section-divider bg-gray-900"
    >
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal variant="up" className="text-center mb-16">
          <span className="text-xs font-semibold text-indigo-500 uppercase tracking-widest">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mt-3 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-txt-secondary max-w-lg mx-auto">
            Start free, upgrade when you need more. No hidden fees.
          </p>
        </ScrollReveal>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start"
        >
          {tiers.map((tier, i) => (
            <div
              key={tier.name}
              className={`reveal ${visible ? "reveal-in" : ""}`}
              style={{ animationDelay: visible ? delays[i] : undefined }}
            >
              <TiltCard>
                <div
                  className={`card-glow relative h-full rounded-2xl border p-7 transition-all duration-300 hover:shadow-xl hover:shadow-gray-800/30 ${
                    tier.highlighted
                      ? "bg-gray-800 border-indigo-600/30 shadow-indigo-600/50"
                      : "bg-gray-800 border-gray-700 hover:border-gray-600"
                  }`}
                  onMouseMove={onMouseMove}
                >
                  {/* Badge */}
                  {tier.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25">
                        <PiSparkleBold className="w-3 h-3" />
                        {tier.badge}
                      </span>
                    </div>
                  )}

                  {/* Header */}
                  <div className="mb-6">
                    <h3 className="text-base font-semibold text-gray-100 mb-1">
                      {tier.name}
                    </h3>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-4xl font-bold text-gray-100">
                        {tier.price}
                      </span>
                      {tier.period && (
                        <span className="text-sm text-gray-500">
                          {tier.period}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {tier.description}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <PiCheckBold className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-400">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    to="/app"
                    className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 ${
                      tier.highlighted
                        ? "bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo/25"
                        : "bg-gray-700 text-gray-200 border border-gray-600 hover:border-gray-500 hover:bg-gray-800"
                    }`}
                  >
                    {tier.highlighted ? (
                      <PiSparkleBold className="w-3.5 h-3.5" />
                    ) : tier.name === "Enterprise" ? (
                      <PiInfinityBold className="w-3.5 h-3.5" />
                    ) : null}
                    {tier.cta}
                  </Link>
                </div>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;