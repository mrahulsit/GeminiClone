import { useContext, useState } from "react";
import { Context } from "../../context/context";
import {
  PiSpinnerBold,
  PiEyeBold,
  PiEyeSlashBold,
  PiArrowRightBold,
  PiGoogleLogoBold,
} from "react-icons/pi";

const Auth = () => {
  const { login, register } = useContext(Context);
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: string) => {
    // TODO: integrate with backend OAuth
    window.location.href = `${import.meta.env.VITE_API_URL || ""}/api/auth/${provider}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-900">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo + Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl font-bold text-indigo-400 font-display">L</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-100 font-display mb-2">
            {isLogin ? "Welcome back" : "Join Lumina"}
          </h1>
          <p className="text-sm text-gray-500">
            {isLogin
              ? "Your AI companion for coding, reasoning, and creation"
              : "Start building with the power of AI today"}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 shadow-xl shadow-black/10">
          {/* OAuth Buttons */}
          <div className="space-y-2.5 mb-5">
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-700 bg-gray-700/20 hover:bg-gray-600 transition-colors text-sm font-medium text-gray-200"
            >
              <PiGoogleLogoBold className="w-4 h-4" />
              Continue with Google
            </button>
            <button
              type="button"
              onClick={() => handleOAuth("microsoft")}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-700 bg-gray-700/20 hover:bg-gray-600 transition-colors text-sm font-medium text-gray-200"
            >
              <PiSpinnerBold className="w-4 h-4" />
              Continue with Microsoft
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-gray-600" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-xs text-gray-400 bg-gray-800">or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 auth-enter">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-sm text-gray-200 placeholder:text-gray-400 outline-none focus:border-indigo-500 focus:bg-gray-900 transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-sm text-gray-200 placeholder:text-gray-400 outline-none focus:border-indigo-500 focus:bg-gray-900 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-12 rounded-xl bg-gray-700 border border-gray-600 text-sm text-gray-200 placeholder:text-gray-400 outline-none focus:border-indigo-500 focus:bg-gray-900 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  {showPassword ? (
                    <PiEyeSlashBold className="w-4 h-4" />
                  ) : (
                    <PiEyeBold className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-3 py-2 rounded-lg bg-red-600/10 border border-red-600/20 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <PiSpinnerBold className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign in" : "Create account"}
                  <PiArrowRightBold className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-sm text-gray-400 hover:text-indigo-400 transition-colors"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;