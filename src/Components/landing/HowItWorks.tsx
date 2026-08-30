import ScrollReveal from "./ScrollReveal";

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="landing-section bg-gray-900"
    >
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal variant="up" className="text-center mb-16">
          <span className="text-xs font-semibold text-indigo-500 uppercase tracking-widest">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mt-3 mb-4">
            Simple & Intuitive
          </h2>
          <p className="text-txt-secondary max-w-lg mx-auto">
            Get started in minutes. No complicated setup required.
          </p>
        </ScrollReveal>

        <div className="grid max-w-4xl mx-auto grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="reveal">
            <div className="flex items-center gap-3 px-4 py-6 rounded-xl bg-gray-800 border border-gray-700">
              <div className="w-12 h-12 rounded-full bg-indigo-600/20 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-indigo-400">1</span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-100">Describe Your Idea</h3>
                <p className="text-sm text-gray-500">Tell Lumina what you want to create or discuss</p>
              </div>
            </div>
          </div>

          <div className="reveal">
            <div className="flex items-center gap-3 px-4 py-6 rounded-xl bg-gray-800 border border-gray-700">
              <div className="w-12 h-12 rounded-full bg-indigo-600/20 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-indigo-400">2</span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-100">AI Processes</h3>
                <p className="text-sm text-gray-500">Lumina's AI analyzes your request and generates a response</p>
              </div>
            </div>
          </div>

          <div className="reveal">
            <div className="flex items-center gap-3 px-4 py-6 rounded-xl bg-gray-800 border border-gray-700">
              <div className="w-12 h-12 rounded-full bg-indigo-600/20 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-indigo-400">3</span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-100">Review & Iterate</h3>
                <p className="text-sm text-gray-500">Read the response and ask for refinements</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;