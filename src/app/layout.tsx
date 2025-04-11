import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
// import Sidebar from "@/components/Sidebar";
import Toaster from "@/components/ui/Toaster";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "ChessMates",
  description: "A social media website for chess enthusiast.",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn("bg-white text-slate-900 antialias light", inter.className)}
    >
      <body className="min-h-screen pt-12 bg-slate-50 antialiased ">
        <Providers>
          {/* responsive bottom bar for mobile and styling remains  */}
          {/* <Sidebar /> */}
          {/* @ts-expect-error Async Server Component */}
          <Navbar />

          <div className="px-2 sm:container max-w-7xl mx-auto h-full pt-12 ">
            {children}
          </div>

          <Toaster />
        </Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
