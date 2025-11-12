"use client";

import { useTheme } from "next-themes";
import Link from "next/link";

interface LogoProps {
  children: React.ReactNode;
}

function Logo({ children }: LogoProps) {
  const { theme } = useTheme();
  
  return (
    <Link
      href="/"
      className="text-xl font-bold text-gray-900 transition-all duration-300 ease-in-out hover:text-gray-600 dark:text-white dark:hover:text-gray-300 cursor-pointer"
    >
      {children}
    </Link>
  );
}

export default Logo;

