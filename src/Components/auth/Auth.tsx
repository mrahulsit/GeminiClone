import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../context/context";
import {
  PiSpinnerBold,
  PiEyeBold,
  PiEyeSlashBold,
  PiArrowRightBold,
  PiGoogleLogoBold,
  PiWindowsLogoBold,
  PiChatCircleDotsBold,
  PiLightningBold,
  PiShieldCheckBold,
  PiCheckCircleBold,
  PiStarFill,
} from "react-icons/pi";

const perks = [
  {
    icon: PiChatCircleDotsBold,
    title: "Chat that thinks out loud",
    subtitle: "Streamed answers with your model's reasoning made visible.",
  },
  {
    icon: PiLightningBold,
    title: "Code, search & images",
    subtitle: "Powerful tools built into one polished workspace.",
  },
  {
    icon: PiShieldCheckBold,
    title: "Private by design",
    subtitle: "Your data is encrypted and never trained on.",
  },
];

const Auth = () => {
  const { login, register } = useContext(Context);
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);

    try {
      const msg = isLogin ? await login(email, password) : await register(name, email, password);
      if (msg) setError(msg);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: string) => {
    // OAuth provider is not wired to the backend yet — surface a friendly notice instead of a 404
    setError("");
    setNotice(`${provider === "google" ? "Google" : "Microsoft"} sign-in is coming soon. Please use email instead.`);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setNotice("");
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-surface-2/70 border border-border text-sm text-txt placeholder:text-txt-muted outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition-all";

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-surface-0">
      {/* ── Brand panel (desktop) ── */}
      <div className="hidden lg:flex flex-col justify-between relative overflow-hidden p-12 border-r border-border">
        <div className="absolute inset-0 bg-grid pointer-events-none" />
        <div className="absolute -top-32 -left-24 w-96 h-96 bg-accent/14 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/12 rounded-full blur-[110px] pointer-events-none" />

        <div className="relative flex items-center gap-3">
          <img
            src="/lumina-logo.png"
            alt="Lumina"
            className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-accent/25"
          />
          <span className="text-xl font-bold text-txt font-display tracking-tight">Lumina</span>
        </div>

        <div className="relative max-w-md">
          <h1 className="text-4xl font-bold text-txt font-display tracking-tight leading-tight">
            Your AI companion for{" "}
            <span className="text-gradient">coding, reasoning &amp; creation.</span>
          </h1>

          <div className="mt-10 space-y-5">
            {perks.map((perk) => (
              <div key={perk.title} className="flex items-start gap-4">
                <span className="w-10 h-10 rounded-xl bg-surface-2/80 border border-border flex items-center justify-center shrink-0">
                  <perk.icon className="w-5 h-5 text-accent" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-txt">{perk.title}</p>
                  <p className="text-[13px] text-txt-secondary mt-0.5">{perk.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center gap-2 text-sm text-txt-muted">
          <span className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <PiStarFill key={i} className="w-3.5 h-3.5 text-amber-400" />
            ))}
          </span>
          Trusted by 12,000+ developers
        </div>
      </div>

      {/* ── Form panel ── */}
      <div className="relative flex items-center justify-center min-h-screen lg:min-h-0 p-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none lg:hidden">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
        </div>

        <div className="relative w-full max-w-md">
          {/* Mobile brand */}
          <div className="lg:hidden text-center mb-7">
            <img
              src="/lumina-logo.png"
              alt="Lumina"
              className="w-14 h-14 rounded-2xl object-cover mx-auto mb-4 shadow-lg shadow-accent/25"
            />
            <h1 className="text-2xl font-bold text-txt font-display">
              {isLogin ? "Welcome back" : "Join Lumina"}
            </h1>
          </div>

          {/* Card */}
          <div className="rounded-3xl p-[1px] bg-gradient-to-br from-border via-border to-accent/30">
            <div className="rounded-3xl bg-surface-1/90 backdrop-blur-xl p-8 shadow-2xl shadow-black/20">
              {/* Heading (desktop) */}
              <div className="hidden lg:block text-center mb-7">
                <h1 className="text-2xl font-bold text-txt font-display">
                  {isLogin ? "Welcome back" : "Join Lumina"}
                </h1>
                <p className="text-sm text-txt-muted mt-1">
                  {isLogin
                    ? "Sign in to continue your conversations"
                    : "Create your free account in seconds"}
                </p>
              </div>

              {/* OAuth buttons */}
              <div className="space-y-2.5 mb-5">
                <button
                  type="button"
                  onClick={() => handleOAuth("google")}
                  className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border border-border bg-surface-2/50 hover:bg-surface-2 hover:border-accent/30 transition-all text-sm font-medium text-txt-secondary hover:text-txt"
                >
                  <PiGoogleLogoBold className="w-4 h-4" />
                  Continue with Google
                </button>
                <button
                  type="button"
                  onClick={() => handleOAuth("microsoft")}
                  className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border border-border bg-surface-2/50 hover:bg-surface-2 hover:border-accent/30 transition-all text-sm font-medium text-txt-secondary hover:text-txt"
                >
                  <PiWindowsLogoBold className="w-4 h-4" />
                  Continue with Microsoft
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-border" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 text-xs text-txt-muted bg-surface-1">
                    or continue with email
                  </span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-txt-secondary mb-1.5">
                      Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={!isLogin}
                      placeholder="Your full name"
                      className={inputClass}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-txt-secondary mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-txt-secondary">
                      Password
                    </label>
                    {isLogin && (
                      <button
                        type="button"
                        onClick={() =>
                          setNotice("Password reset is coming soon. In the meantime, just ask Lumina to help you remember it. 😉")
                        }
                        className="text-xs text-txt-muted hover:text-accent transition-colors"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder={isLogin ? "••••••••" : "At least 8 characters"}
                      className={`${inputClass} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-txt-muted hover:text-txt transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <PiEyeSlashBold className="w-4 h-4" /> : <PiEyeBold className="w-4 h-4" />}
                    </button>
                  </div>
                  {!isLogin && (
                    <p className="flex items-center gap-1.5 mt-2 text-[11px] text-txt-muted">
                      <PiCheckCircleBold className="w-3.5 h-3.5 text-green-400/70" />
                      Use 8+ characters with a mix of letters and numbers.
                    </p>
                  )}
                </div>

                {notice && (
                  <div className="px-3.5 py-2.5 rounded-xl bg-accent/10 border border-accent/25 text-sm text-txt-secondary">
                    {notice}
                  </div>
                )}

                {error && (
                  <div className="px-3.5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/25 text-sm text-red-500">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full gradient-btn flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
                >
                  {loading ? (
                    <>
                      <PiSpinnerBold className="w-4 h-4 animate-spin" />
                      {isLogin ? "Signing in…" : "Creating account…"}
                    </>
                  ) : (
                    <>
                      {isLogin ? "Sign in" : "Create account"}
                      <PiArrowRightBold className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <p className="mt-6 text-center text-sm text-txt-muted">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  onClick={toggleMode}
                  className="font-medium text-accent hover:text-accent-light transition-colors"
                >
                  {isLogin ? "Sign up free" : "Sign in"}
                </button>
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-txt-muted">
            By continuing you agree to our{" "}
            <Link to="/" className="hover:text-accent transition-colors">Terms</Link> &amp;{" "}
            <Link to="/" className="hover:text-accent transition-colors">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;