import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { GITHUB_PORTFOLIO, data, fmtDate } from "@/lib/data";
import { ThemeSwitch, themeScript } from "@/components/ThemeSwitch";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Space portfolio · Vercel",
  description: "Everything this space has shipped on Vercel: live projects, what changed, and where they live.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        {/* Shared with the GitHub portfolio: a subtle full-width bar with the two sites as tabs. */}
        <header className="border-b border-grid bg-card">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-5">
              <Link href="/" className="font-semibold">
                Space portfolio
              </Link>
              <nav aria-label="Portfolio sections" className="flex items-center gap-1 text-sm">
                <a href={GITHUB_PORTFOLIO} className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-secondary hover:bg-raised hover:text-primary">
                  <svg viewBox="0 0 16 16" className="size-3.5 fill-current" aria-hidden>
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                  GitHub
                </a>
                <Link href="/" aria-current="page" className="flex items-center gap-1.5 rounded-md bg-raised px-2.5 py-1 font-medium text-primary">
                  <svg viewBox="0 0 76 65" className="size-3 fill-current" aria-hidden>
                    <path d="M37.5 0 75 65H0z" />
                  </svg>
                  Vercel
                </Link>
              </nav>
            </div>
            <ThemeSwitch />
          </div>
        </header>
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-8 sm:px-6">
          {children}
        </main>
        <footer className="mx-auto w-full max-w-6xl px-4 py-6 text-xs text-muted sm:px-6">
          A static snapshot of our Vercel team, taken {fmtDate(data.takenAt)}. No tokens, no
          tracking: just links to what we&apos;ve shipped.
        </footer>
      </body>
    </html>
  );
}
