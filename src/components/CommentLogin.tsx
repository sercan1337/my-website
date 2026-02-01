"use client";

import { useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, Terminal, LogIn, Mail, Lock, User, 
  ArrowRight, Loader2, ChevronLeft 
} from "lucide-react";
import { toast } from "sonner"; 
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface CommentLoginProps {
  onLoginSuccess?: () => void;
}

type AuthView = "INTRO" | "LOGIN" | "REGISTER" | "FORGOT_EMAIL";

const emptySubscribe = () => () => {};

export default function CommentLogin({ onLoginSuccess }: CommentLoginProps) {
  const [view, setView] = useState<AuthView>("INTRO");
  const [isLoading, setIsLoading] = useState(false);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const promise = authClient.signIn.email({
        email: formData.email,
        password: formData.password,
    });

    toast.promise(promise, {
      loading: 'Verifying credentials...',
      success: () => {
        setIsLoading(false);
        onLoginSuccess?.();
        router.refresh();
        return "ACCESS GRANTED: Session initialized.";
      },
      error: (err) => {
        setIsLoading(false);
        return `ACCESS DENIED: ${err.error?.message || "Invalid credentials"}`;
      },
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const promise = authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
    });

    toast.promise(promise, {
      loading: 'Creating new identity...',
      success: () => {
        setIsLoading(false);
        setView("LOGIN");
        return "IDENTITY CREATED: Please login.";
      },
      error: (err) => {
        setIsLoading(false);
        return `ERROR: ${err.error?.message || "Registration failed"}`;
      },
    });
  };

  const handleForgotEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const promise = authClient.requestPasswordReset({
        email: formData.email,
        redirectTo: "/reset-password", 
    });

    toast.promise(promise, {
      loading: 'Generating reset token...',
      success: () => {
        setIsLoading(false);
        setView("LOGIN");
        return "TOKEN SENT: Check your email.";
      },
      error: (err) => {
        setIsLoading(false);
        return `ERROR: ${err.error?.message || "Failed to send email"}`;
      },
    });
  };

  if (!mounted) return null;

  return (
    <div className="w-full max-w-2xl mx-auto my-8 font-mono">
      <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm transition-all duration-300">
        
        {/* TERMINAL HEADER */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-100/50 dark:bg-gray-950/50">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
            </div>
            <span className="ml-2 text-[10px] text-gray-500 uppercase">better_auth_cli</span>
          </div>
          <ShieldAlert size={14} className="text-gray-400" />
        </div>

        {/* CONTENT */}
        <div className="p-8 flex flex-col items-center text-center min-h-[350px] justify-center">
          <AnimatePresence mode="wait">

            {view === "INTRO" && (
              <motion.div key="intro" {...animProps} className="flex flex-col items-center w-full">
                <div className="mb-6 p-3 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-500">
                  <Terminal size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Authentication Required</h3>
                <p className="text-sm text-gray-500 max-w-sm mb-8">System uses Better Auth for secure identity storage.</p>
                <button
                  onClick={() => setView("LOGIN")}
                  className="group w-full max-w-xs flex items-center justify-center gap-3 px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black hover:border-green-500/50 transition-all active:scale-95"
                >
                  <LogIn size={18} className="text-gray-500 group-hover:text-green-500" />
                  <span className="text-sm font-medium">INITIALIZE_SESSION</span>
                </button>
              </motion.div>
            )}

            {view === "LOGIN" && (
              <motion.div key="login" {...animProps} className="w-full max-w-sm">
                <HeaderTitle title="System Login" subtitle="Authenticating via Better Auth." />
                <form onSubmit={handleLogin} className="space-y-4 text-left">
                  <InputGroup icon={<Mail />} type="email" name="email" placeholder="user@email.com" value={formData.email} onChange={handleChange} />
                  <InputGroup icon={<Lock />} type="password" name="password" placeholder="Passcode" value={formData.password} onChange={handleChange} />
                  <div className="flex justify-end">
                    <button type="button" onClick={() => setView("FORGOT_EMAIL")} className="text-[10px] text-blue-500 hover:underline uppercase tracking-wide">Lost Key?</button>
                  </div>
                  <SubmitButton isLoading={isLoading}>AUTHENTICATE</SubmitButton>
                </form>
                <FooterNav text="No record?" actionText="INSERT_NEW_USER" onClick={() => setView("REGISTER")} onBack={() => setView("INTRO")} />
              </motion.div>
            )}

            {view === "REGISTER" && (
              <motion.div key="register" {...animProps} className="w-full max-w-sm">
                <HeaderTitle title="New Entry" subtitle="Creating secure user session." />
                <form onSubmit={handleRegister} className="space-y-4 text-left">
                  <InputGroup icon={<User />} type="text" name="name" placeholder="Username" value={formData.name} onChange={handleChange} />
                  <InputGroup icon={<Mail />} type="email" name="email" placeholder="user@email.com" value={formData.email} onChange={handleChange} />
                  <InputGroup icon={<Lock />} type="password" name="password" placeholder="Set Passcode" value={formData.password} onChange={handleChange} />
                  <SubmitButton isLoading={isLoading}>COMMIT_TRANSACTION</SubmitButton>
                </form>
                <FooterNav text="Key exists?" actionText="LOGIN" onClick={() => setView("LOGIN")} onBack={() => setView("INTRO")} />
              </motion.div>
            )}

            {view === "FORGOT_EMAIL" && (
              <motion.div key="forgot" {...animProps} className="w-full max-w-sm">
                <HeaderTitle title="Key Recovery" subtitle="Triggering recovery protocol." />
                <form onSubmit={handleForgotEmail} className="space-y-4 text-left">
                   <InputGroup icon={<Mail />} type="email" name="email" placeholder="Target Email" value={formData.email} onChange={handleChange} />
                   <SubmitButton isLoading={isLoading}>EXECUTE_RECOVERY</SubmitButton>
                </form>
                <FooterNav onBack={() => setView("LOGIN")} />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// --- HELPERS ---
interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
}

const InputGroup = ({ icon, ...props }: InputGroupProps) => (
  <div className="relative group">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors">
      <div className="w-4 h-4">{icon}</div>
    </div>
    <input {...props} required className="w-full bg-white/50 dark:bg-black/50 border border-gray-200 dark:border-gray-800 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-green-500/50 transition-all font-mono" />
  </div>
);

const SubmitButton = ({ isLoading, children }: { isLoading: boolean; children: React.ReactNode }) => (
  <button type="submit" disabled={isLoading} className="w-full bg-gray-900 dark:bg-white text-white dark:text-black font-bold py-2.5 rounded-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm font-mono tracking-wide">
    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
    {!isLoading && <ArrowRight className="w-4 h-4" />}
  </button>
);

const HeaderTitle = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="mb-6 text-center">
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 font-mono">{title}</h3>
    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{subtitle}</p>
  </div>
);

interface FooterNavProps {
  text?: string;
  actionText?: string;
  onClick?: () => void;
  onBack?: () => void;
}

const FooterNav = ({ text, actionText, onClick, onBack }: FooterNavProps) => (
  <div className="mt-6 flex flex-col items-center gap-3">
    {text && (
      <div className="text-xs text-gray-500 font-mono">
        {text} <button type="button" onClick={onClick} className="text-green-600 dark:text-green-400 font-bold hover:underline">{actionText}</button>
      </div>
    )}
    {onBack && (
      <button type="button" onClick={onBack} className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest font-mono">
        <ChevronLeft size={10} /> Abort_Sequence
      </button>
    )}
  </div>
);

const animProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 }
};