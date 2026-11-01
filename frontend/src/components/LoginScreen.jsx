import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Zap, Loader2, AlertTriangle } from "lucide-react";

import { login } from "../services/auth";

export default function LoginScreen({ config, onSuccess }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const configured = config?.auth_configured !== false;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!password) {
      setError("Enter the owner password.");
      return;
    }

    setLoading(true);

    try {
      await login(password);
      setPassword("");
      onSuccess?.();
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass rounded-2xl p-8 border border-white/[0.08]"
        style={{ boxShadow: "0 0 60px rgba(124,58,237,0.15)" }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}
          >
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text tracking-wider">
              CLARA
            </h1>
            <p className="text-[11px] text-slate-500 uppercase tracking-widest">
              Owner access
            </p>
          </div>
        </div>

        {config?.demo_mode && (
          <div className="mb-5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
            Demo mode is enabled. Email sending and calendar changes are disabled.
          </div>
        )}

        {!configured && (
          <div className="mb-5 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
            <span>
              Server authentication is not configured. Set
              {" "}OWNER_PASSWORD_HASH on the backend.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-xs font-medium text-slate-400">
              Password
            </span>
            <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 focus-within:border-purple-500/50">
              <Lock size={15} className="text-slate-500" />
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={loading || !configured}
                placeholder="Owner password"
                className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none"
              />
            </div>
          </label>

          {error && (
            <p className="text-xs text-red-400" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !configured}
            className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #2563eb)",
              boxShadow: "0 4px 15px rgba(124,58,237,0.3)",
            }}
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            {loading ? "Signing in..." : "Unlock CLARA"}
          </button>
        </form>

        <p className="mt-5 text-center text-[10px] text-slate-600">
          Single-owner access. Sessions use short-lived tokens.
        </p>
      </motion.div>
    </div>
  );
}
