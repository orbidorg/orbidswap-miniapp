import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { MiniKitProvider } from "@worldcoin/minikit-js/minikit-provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "OrbIdSwap - Mini App",
  description: "Human-First DeFi on World Chain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <MiniKitProvider>
        <body className={`${inter.variable} font-sans bg-white dark:bg-[#0d111c] text-gray-900 dark:text-white`}>
          <Providers>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#131a2a',
                  color: '#fff',
                  border: '1px solid #293249',
                },
              }}
            />
          </Providers>
          <Analytics />
          <SpeedInsights />
        </body>
      </MiniKitProvider>
    </html>
  );
}
