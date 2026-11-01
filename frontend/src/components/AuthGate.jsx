import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Loader2, RefreshCw } from "lucide-react";

import { bootstrapAuth, subscribeAuth } from "../services/auth";
import LoginScreen from "./LoginScreen";

function StatusScreen({ icon: Icon, title, message, action }) {
  return (
    <div className="min-h-screen animated-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass rounded-2xl p-8 border border-white/[0.08] text-center"
      >
        <div className="mx-auto mb-4 w-12 h-12 rounded-xl flex items-center justify-center bg-purple-500/10 border border-purple-500/20">
          <Icon size={20} className="text-purple-300" />
        </div>
        <h2 className="text-lg font-semibold text-white mb-2">{title}</h2>
        <p className="text-sm text-slate-400">{message}</p>
        {action && (
          <button
            onClick={action.onClick}
            className="mt-5 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}
          >
            <RefreshCw size={14} />
            {action.label}
          </button>
        )}
      </motion.div>
    </div>
  );
}

export default function AuthGate({ children }) {
  const [status, setStatus] = useState("checking");
  const [config, setConfig] = useState(null);
  const [error, setError] = useState("");

  const initialize = useCallback(async () => {
    setStatus("checking");
    setError("");

    try {
      const result = await bootstrapAuth();
      setConfig(result.config);
      setStatus(
        result.status === "unauthenticated" ? "unauthenticated" : "authenticated"
      );
    } catch (err) {
      setError(err.message || "Unable to reach the CLARA backend.");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    initialize();

    const unsubscribe = subscribeAuth((event) => {
      if (event === "unauthenticated") {
        setStatus("unauthenticated");
      }
      if (event === "authenticated") {
        setStatus("authenticated");
      }
    });

    return unsubscribe;
  }, [initialize]);

  if (status === "checking") {
    return (
      <StatusScreen
        icon={Loader2}
        title="Connecting to CLARA"
        message="Checking your session... (Render free-tier instances may take up to 45 seconds to wake up on initial visit)"
      />
    );
  }

  if (status === "error") {
    return (
      <StatusScreen
        icon={AlertTriangle}
        title="CLARA is unreachable"
        message={error}
        action={{ label: "Retry", onClick: initialize }}
      />
    );
  }

  if (status === "unauthenticated") {
    return (
      <LoginScreen
        config={config}
        onSuccess={() => setStatus("authenticated")}
      />
    );
  }

  return children;
}
