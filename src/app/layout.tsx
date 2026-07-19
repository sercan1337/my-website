import type { Metadata } from "next";
import { VT323 } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Providers } from "@/components/Providers";
import SmoothScroll from "@/components/SmoothScroll";
import PageLoadOverlay from "@/components/PageLoadOverlay";
import RetroSound from "@/components/RetroSound";
import { Toaster } from "@/components/ui/sonner"; 
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from "@vercel/analytics/next"

const terminalFont = VT323({
  variable: "--font-terminal",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://my-website-one-rho-66.vercel.app'),
  title: "Home | Sercan Duran",
  description: "Personal blog and portfolio website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden" suppressHydrationWarning>
      <body
        className={`${terminalFont.variable} retro-os text-gray-900 dark:text-gray-100 transition-colors duration-300 overflow-x-hidden`}
      >
        <Providers>
          <PageLoadOverlay />
          <SmoothScroll />
          <div className="crt-stage fixed inset-0 -z-50 h-full w-full bg-[#0500a8] transition-colors duration-300">
            <div className="crt-grid absolute inset-0 h-full w-full"></div>
            <div className="crt-vignette absolute inset-0 h-full w-full"></div>
          </div>

          <Header />
          <RetroSound />
          
          <main className="relative z-10 pt-24 sm:pt-28 pb-0 px-4 sm:px-8 max-w-[76rem] mx-auto w-full min-h-screen page-enter-up">
            {children}
          </main>
          
          <Toaster position="top-center" richColors />
          <SpeedInsights />
          <Analytics/>
        </Providers>
      </body>
    </html>
  );
}
