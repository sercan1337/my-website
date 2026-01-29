"use client";

import { Github, Mail, ShieldAlert, Terminal } from "lucide-react";

interface CommentLoginProps {
  onGithubLogin?: () => void;
  onGoogleLogin?: () => void;
}

export default function CommentLogin({ onGithubLogin, onGoogleLogin }: CommentLoginProps) {
  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-100/50 dark:bg-gray-950/50">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
            </div>
            <span className="ml-2 text-[10px] font-mono text-gray-500 uppercase tracking-wider">
              auth_protocol.exe
            </span>
          </div>
          <ShieldAlert size={14} className="text-gray-400" />
        </div>

        <div className="p-8 flex flex-col items-center text-center">
          <div className="mb-6 p-3 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            <Terminal size={24} />
          </div>

          <h3 className="text-lg font-bold font-mono text-gray-900 dark:text-white mb-2">
            Identification Required
          </h3>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-8 font-mono">
            To initialize the comment stream, please verify your identity.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <button
              onClick={onGithubLogin}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 transition-all active:scale-95"
            >
              <Github size={18} />
              <span className="text-sm font-medium">System Login</span>
            </button>
          </div>
          
          <div className="mt-6 flex items-center gap-2 text-[10px] text-gray-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            WAITING FOR INPUT...
          </div>
        </div>
      </div>
    </div>
  );
}   