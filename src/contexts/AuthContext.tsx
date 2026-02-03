"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authClient } from "@/lib/auth-client";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isPending: boolean;
  session: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: sessionData, isPending, error } = authClient.useSession();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (sessionData?.user) {
      setUser(sessionData.user as User);
    } else {
      setUser(null);
    }
  }, [sessionData]);

  const login = async (email: string, password: string) => {
    await authClient.signIn.email({
      email,
      password,
      callbackURL: "/",
    }, {
      onError: (ctx) => {
        throw new Error(ctx.error.message);
      }
    });
  };

  const register = async (name: string, email: string, password: string) => {
    await authClient.signUp.email({
      email,
      password,
      name: name,
    }, {
      onError: (ctx) => {
        throw new Error(ctx.error.message);
      }
    });
  };

  const logout = async () => {
    await authClient.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isPending, session: sessionData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}