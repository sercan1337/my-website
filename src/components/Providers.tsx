"use client";

import { ThemeProvider } from "next-themes";
import { ToastProvider } from "@/components/Toast";
import { AuthProvider } from "@/contexts/AuthContext";
import BiosKeyboardNavigation from "@/components/BiosKeyboardNavigation";
import KonamiCode from "@/components/KonamiCode";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <ToastProvider>
          {children}
          <BiosKeyboardNavigation />
          <KonamiCode />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

