import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Providers } from "@/components/Providers";
import ScrollToTop from "@/components/ScrollToTop";
import { Toaster } from "@/components/ui/sonner"; 
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-gray-900 dark:text-gray-100 transition-colors duration-300 overflow-x-hidden`}
      >
        <Providers>
          
            <div className="fixed inset-0 -z-50 h-full w-full bg-background transition-colors duration-300">
            <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute inset-0 bg-white/30 dark:bg-gray-950/30 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          </div>

          <Header />
          
          <main className="relative z-10 pt-32 pb-0 px-4 sm:px-8 max-w-[72rem] mx-auto w-full min-h-screen">
            {children}
          </main>
          
          <ScrollToTop />
          <Toaster position="top-center" richColors />
          <SpeedInsights />
          <Analytics/>
        </Providers>
      </body>
    </html>
  );
}