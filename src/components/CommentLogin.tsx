"use client";

import { useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, Mail, Lock, User, 
  ArrowRight, Loader2, ChevronLeft, Command, AlertTriangle
} from "lucide-react";
import { toast } from "sonner"; 
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface CommentLoginProps {
  onLoginSuccess?: () => void;
}

type AuthView = "INTRO" | "LOGIN" | "REGISTER";

const emptySubscribe = () => () => {};

export default function CommentLogin({ onLoginSuccess }: CommentLoginProps) {
  const [view, setView] = useState<AuthView>("INTRO");
  const [isLoading, setIsLoading] = useState(false);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const toastClass = `
    group flex items-center gap-3 p-4 rounded-lg shadow-xl border
    font-mono text-xs tracking-wide
    !bg-white text-zinc-900 border-zinc-200
    dark:!bg-zinc-950 dark:text-zinc-200 dark:border-zinc-800
  `;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = (type: "LOGIN" | "REGISTER") => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!formData.email) {
      newErrors.email = "ERR: MISSING_EMAIL";
      isValid = false;
    }
    if (!formData.password) {
      newErrors.password = "ERR: MISSING_KEY";
      isValid = false;
    }
    if (type === "REGISTER" && !formData.name) {
      newErrors.name = "ERR: MISSING_USER";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm("LOGIN")) return;

    setIsLoading(true);
    const toastId = toast.loading('Authenticating...', { className: toastClass });

    try {
      // toast.promise yerine direkt await kullanarak sonucu kontrol ediyoruz
      const { data, error } = await authClient.signIn.email({
          email: formData.email,
          password: formData.password,
      });

      if (error) {
        setIsLoading(false);
        // Şifre yanlışsa veya başka hata varsa burası çalışır
        toast.error(`ERROR: ${error.message || "Access Denied"}`, { 
          id: toastId,
          className: toastClass 
        });
        return;
      }

      // Giriş başarılıysa
      setIsLoading(false);
      toast.success("ACCESS GRANTED", { 
        id: toastId,
        className: toastClass 
      });
      
      router.refresh();
      
      setTimeout(() => {
           onLoginSuccess?.();
      }, 500);

    } catch (err) {
      setIsLoading(false);
      toast.error("ERROR: System Failure", { id: toastId, className: toastClass });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm("REGISTER")) return;

    setIsLoading(true);
    const toastId = toast.loading('Writing to database...', { className: toastClass });

    try {
      const { data, error } = await authClient.signUp.email({
          email: formData.email,
          password: formData.password,
          name: formData.name,
      });

      if (error) {
        setIsLoading(false);
        toast.error(`ERROR: ${error.message || "Registration Failed"}`, { 
          id: toastId, 
          className: toastClass 
        });
        return;
      }

      setIsLoading(false);
      toast.success("USER REGISTERED", { id: toastId, className: toastClass });
      router.refresh();
      setView("LOGIN");

    } catch (err) {
      setIsLoading(false);
      toast.error("ERROR: System Failure", { id: toastId, className: toastClass });
    }
  };

  const handleDisabledFeature = () => {
    toast("COMMAND REJECTED", {
        description: "Feature [reset_key] is offline.",
        icon: <AlertTriangle className="w-4 h-4 text-[#42CF8E] dark:text-white" />,
        className: toastClass,
    });
  };

  if (!mounted) return null;

  return (
    <div className="w-full max-w-[360px] mx-auto my-12 font-mono text-zinc-300 antialiased">
      <div className="relative flex flex-col items-center justify-center min-h-[320px]">
        <AnimatePresence mode="wait">
          
          {/* --- INTRO VIEW --- */}
          {view === "INTRO" && (
            <motion.div key="intro" {...animProps} className="flex flex-col items-center justify-center w-full space-y-8">
              <div className="flex items-center gap-3 text-zinc-500 select-none">
                <Terminal size={20} className="text-[#42CF8E] dark:text-zinc-500" />
                <span className="text-sm font-medium">guest@system:~ $</span>
                <span className="w-2 h-4 bg-[#42CF8E] dark:bg-zinc-500 animate-pulse block shadow-[0_0_8px_rgba(66,207,142,0.5)] dark:shadow-none"></span>
              </div>
              
              <button
                onClick={() => setView("LOGIN")}
                className="
                  group flex items-center gap-3 px-8 py-3 rounded-lg border transition-all duration-300 active:scale-95
                  bg-white border-zinc-200 text-zinc-600 shadow-sm
                  hover:border-[#42CF8E] hover:text-[#42CF8E] hover:shadow-md
                  dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 
                  dark:hover:bg-zinc-800 dark:hover:border-zinc-600 dark:hover:text-zinc-200
                "
              >
                <span className="text-sm font-bold tracking-wide">INITIALIZE_LOGIN</span>
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1 opacity-50 group-hover:opacity-100 group-hover:text-[#42CF8E] dark:group-hover:text-zinc-200" />
              </button>
            </motion.div>
          )}

          {/* --- LOGIN VIEW --- */}
          {view === "LOGIN" && (
            <motion.div key="login" {...animProps} className="w-full">
              <HeaderTitle title="login" />
              <form onSubmit={handleLogin} className="space-y-5" noValidate>
                <div className="space-y-4">
                  <InputGroup 
                    icon={<Mail size={16} />} 
                    type="email" 
                    name="email" 
                    placeholder="email address" 
                    value={formData.email} 
                    onChange={handleChange}
                    error={errors.email}
                  />
                  <InputGroup 
                    icon={<Lock size={16} />} 
                    type="password" 
                    name="password" 
                    placeholder="passcode" 
                    value={formData.password} 
                    onChange={handleChange}
                    error={errors.password}
                  />
                </div>
                
                <div className="flex justify-between items-center w-full px-1">
                   <button type="button" onClick={() => { setView("REGISTER"); setErrors({}); }} className="text-[11px] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors font-medium">
                    create_account
                  </button>
                  <button type="button" onClick={handleDisabledFeature} className="text-[11px] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors font-medium">
                    reset_key?
                  </button>
                </div>

                <SubmitButton isLoading={isLoading}>ENTER</SubmitButton>
              </form>
              <BackButton onClick={() => { setView("INTRO"); setErrors({}); }} />
            </motion.div>
          )}

          {/* --- REGISTER VIEW --- */}
          {view === "REGISTER" && (
            <motion.div key="register" {...animProps} className="w-full">
              <HeaderTitle title="register" />
              <form onSubmit={handleRegister} className="space-y-5" noValidate>
                <div className="space-y-4">
                    <InputGroup 
                      icon={<User size={16} />} 
                      type="text" 
                      name="name" 
                      placeholder="username" 
                      value={formData.name} 
                      onChange={handleChange}
                      error={errors.name}
                    />
                    <InputGroup 
                      icon={<Mail size={16} />} 
                      type="email" 
                      name="email" 
                      placeholder="email address" 
                      value={formData.email} 
                      onChange={handleChange}
                      error={errors.email}
                    />
                    <InputGroup 
                      icon={<Lock size={16} />} 
                      type="password" 
                      name="password" 
                      placeholder="set passcode" 
                      value={formData.password} 
                      onChange={handleChange}
                      error={errors.password}
                    />
                </div>
                
                <div className="flex justify-start w-full px-1">
                   <button type="button" onClick={() => { setView("LOGIN"); setErrors({}); }} className="text-[11px] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors font-medium">
                    already_have_account
                  </button>
                </div>

                <SubmitButton isLoading={isLoading}>CREATE</SubmitButton>
              </form>
              <BackButton onClick={() => { setView("LOGIN"); setErrors({}); }} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

// --- Bileşenler aynı kalıyor ---

interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
  error?: string;
}

const InputGroup = ({ icon, error, ...props }: InputGroupProps) => (
  <div className="relative">
    <div 
      className={`
        group flex items-center gap-3 border-b py-3 transition-colors duration-300
        ${error 
          ? "border-red-500/50 text-red-500" 
          : `
            border-zinc-200 dark:border-zinc-800 
            text-zinc-400 dark:text-zinc-500 
            focus-within:border-[#42CF8E] focus-within:text-[#42CF8E]
            dark:focus-within:border-zinc-500 dark:focus-within:text-zinc-200
            `
        }
      `}
    >
      <div className={`shrink-0 transition-colors duration-300 ${
        error 
          ? "text-red-500" 
          : `
            group-focus-within:text-[#42CF8E] group-focus-within:drop-shadow-[0_0_5px_rgba(66,207,142,0.5)]
            dark:group-focus-within:text-zinc-200 dark:group-focus-within:drop-shadow-none
            `
      }`}>
        {error ? <AlertTriangle size={16} /> : icon}
      </div>

      <input 
        {...props} 
        className={`
          w-full bg-transparent border-none outline-none text-sm font-mono 
          placeholder:text-zinc-400 dark:placeholder:text-zinc-700 
          focus:placeholder:text-zinc-300 dark:focus:placeholder:text-zinc-600
          ${error ? "text-red-500 placeholder:text-red-300" : "text-zinc-800 dark:text-zinc-200"}
        `} 
      />
    </div>

    {error && (
      <motion.span 
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute right-0 top-3 text-[10px] text-red-500 font-bold bg-white dark:bg-black px-1"
      >
        ERROR
      </motion.span>
    )}
  </div>
);

const SubmitButton = ({ isLoading, children }: { isLoading: boolean; children: React.ReactNode }) => (
  <button 
    type="submit" 
    disabled={isLoading} 
    className="
      w-full mt-4 py-3 rounded transition-all duration-300 flex items-center justify-center gap-2 
      disabled:opacity-50 text-xs font-bold tracking-widest uppercase
      bg-zinc-900 text-white hover:bg-zinc-800
      dark:bg-zinc-100 dark:text-black dark:hover:bg-white dark:hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]
    "
  >
    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
  </button>
);

const HeaderTitle = ({ title }: { title: string }) => (
  <div className="mb-8 w-full">
    <div className="flex items-center gap-2 text-zinc-500 mb-2">
        <Command size={14} className="text-[#42CF8E] dark:text-zinc-500" />
        <span className="text-xs font-bold font-mono uppercase tracking-widest">~/{title}</span>
    </div>
    <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800"></div>
  </div>
);

const BackButton = ({ onClick }: { onClick: () => void }) => (
  <div className="mt-8 flex justify-center">
    <button onClick={onClick} className="p-2 text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900/50 rounded-full">
      <ChevronLeft size={16} />
    </button>
  </div>
);

const animProps = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
  transition: { duration: 0.2, ease: "circOut" as const }
};