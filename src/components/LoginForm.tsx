"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Lock, Terminal, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"LOGIN" | "REGISTER" | "RESET">("LOGIN");
  const [identifier, setIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (mode === "LOGIN") {
        await login(identifier, password);
        if (onSuccess) onSuccess();
      } 
      else if (mode === "REGISTER") {
        await register(identifier, email, password);
        setMessage("ACCESS_GRANTED: Welcome to the system.");
        if (onSuccess) {
          setTimeout(() => onSuccess(), 1000); 
        }
      } 
      else if (mode === "RESET") {
        setMessage("Feature pending server configuration.");
        setMode("LOGIN");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "ACCESS_DENIED: Operation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6 flex items-center gap-2 text-xs font-mono text-gray-500 border-b border-gray-800 pb-2">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span>SECURE_CHANNEL_V1.4</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {mode === "REGISTER" && (
          <div className="group relative">
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-1 group-focus-within:text-green-500 transition-colors">
              {/* NICKNAME */}
            </label>
            <div className="flex items-center border-b border-gray-700 group-focus-within:border-green-500 transition-colors py-2">
              <span className="text-gray-500 mr-2 font-mono">{">"}</span>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="your_nickname"
                className="w-full bg-transparent border-none outline-none text-sm font-mono text-white placeholder:text-gray-700 focus:ring-0 p-0"
                required
              />
            </div>
          </div>
        )}

        {mode === "LOGIN" && (
          <div className="group relative">
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-1 group-focus-within:text-green-500 transition-colors">
              {/* USER_IDENTITY */}
            </label>
            <div className="flex items-center border-b border-gray-700 group-focus-within:border-green-500 transition-colors py-2">
              <span className="text-gray-500 mr-2 font-mono">{">"}</span>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="user@system.local"
                className="w-full bg-transparent border-none outline-none text-sm font-mono text-white placeholder:text-gray-700 focus:ring-0 p-0"
                required
              />
            </div>
          </div>
        )}

        {mode === "REGISTER" && (
          <div className="group relative">
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-1 group-focus-within:text-green-500 transition-colors">
              {/* EMAIL */}
            </label>
            <div className="flex items-center border-b border-gray-700 group-focus-within:border-green-500 transition-colors py-2">
              <span className="text-gray-500 mr-2 font-mono">{">"}</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full bg-transparent border-none outline-none text-sm font-mono text-white placeholder:text-gray-700 focus:ring-0 p-0"
                required
              />
            </div>
          </div>
        )}

        {mode === "RESET" && (
          <div className="group relative">
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-1 group-focus-within:text-green-500 transition-colors">
              {/* EMAIL */}
            </label>
            <div className="flex items-center border-b border-gray-700 group-focus-within:border-green-500 transition-colors py-2">
              <span className="text-gray-500 mr-2 font-mono">{">"}</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full bg-transparent border-none outline-none text-sm font-mono text-white placeholder:text-gray-700 focus:ring-0 p-0"
                required
              />
            </div>
          </div>
        )}

        {(mode === "LOGIN" || mode === "REGISTER") && (
          <div className="group relative">
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-1 group-focus-within:text-green-500 transition-colors">
              {/* ACCESS_KEY */}
            </label>
            <div className="flex items-center border-b border-gray-700 group-focus-within:border-green-500 transition-colors py-2">
              <Lock size={12} className="text-gray-500 mr-2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent border-none outline-none text-sm font-mono text-white placeholder:text-gray-700 focus:ring-0 p-0"
                required
              />
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-xs font-mono bg-red-500/10 p-2 rounded border border-red-500/20">
            <AlertCircle size={12} />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="flex items-center gap-2 text-green-500 text-xs font-mono bg-green-500/10 p-2 rounded border border-green-500/20">
            <span>{message}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-3 rounded-md transition-all duration-300",
            "bg-gray-900 border border-gray-700 text-gray-400 font-mono text-sm",
            "hover:bg-green-500/10 hover:text-green-500 hover:border-green-500",
            loading && "opacity-50 cursor-not-allowed"
          )}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>AUTHENTICATING...</span>
            </>
          ) : (
            <>
              <Terminal size={16} />
              <span>{">"} EXECUTE_{mode === "LOGIN" ? "LOGIN" : mode === "REGISTER" ? "REGISTER" : "RESET"}</span>
            </>
          )}
        </button>

        <div className="flex justify-between items-center text-[10px] font-mono text-gray-600 pt-4">
          <button 
            type="button" 
            onClick={() => {
              setMode(mode === "LOGIN" ? "REGISTER" : "LOGIN");
              setError("");
              setMessage("");
            }}
            className="hover:text-green-500 transition-colors flex items-center gap-1"
          >
            <span className="text-green-500">*</span> {mode === "LOGIN" ? "CREATE_NEW_USER" : "BACK_TO_LOGIN"}
          </button>
          <button 
            type="button" 
            onClick={() => {
              setMode("RESET");
              setError("");
              setMessage("");
              setEmail("");
              setPassword("");
              setIdentifier("");
            }}
            className="hover:text-red-400 transition-colors"
          >
            LOST_KEY?
          </button>
        </div>
      </form>
    </div>
  );
}
