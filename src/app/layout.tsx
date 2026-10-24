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
        <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 pt-8 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <svg viewBox="0 0 76 65" className="size-4 fill-current" aria-hidden>
              <path d="M37.5 0 75 65H0z" />
            </svg>
            Space portfolio
            <span className="font-normal text-muted">/ vercel</span>
          </Link>
          <div className="flex items-center gap-2">
            <nav aria-label="Portfolio sections" className="flex gap-1 rounded-lg border border-grid bg-card p-1 text-sm">
              <Link href="/" aria-current="page" className="rounded-md bg-raised px-3 py-1.5 text-primary">
                Vercel
              </Link>
              <a href={GITHUB_PORTFOLIO} className="rounded-md px-3 py-1.5 text-muted hover:text-primary">
                GitHub ↗
              </a>
            </nav>
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
