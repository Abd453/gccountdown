import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Graduation Countdown",
  description: "A modern countdown and planner for the journey to graduation day.",
  authors: [{ name: "Abdallah Abdurazak" }],
  applicationName: "Graduation Countdown",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white">
        <div className="flex min-h-screen flex-col">
          <div className="flex-1">{children}</div>
          <footer className="border-t border-white/10 bg-black/80 px-4 py-4 text-center backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-6xl">
              <p className="text-xs text-blue-100/70 sm:text-sm">
                © 2026
                <a
                  href="https://github.com/Abd453"
                  className="ml-1 font-semibold text-blue-400 
               hover:text-gray-300 
               hover:underline underline-offset-4
               transition-all duration-300 ease-in-out
               cursor-pointer"
                >
                  Abdallah Abdurazak
                </a>. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
