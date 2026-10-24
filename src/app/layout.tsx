import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { GITHUB_PORTFOLIO, data, fmtDate } from "@/lib/data";
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
  title: "quirq space · on Vercel",
  description: "A portfolio of everything our space has shipped on Vercel: live projects, what changed, and where they live.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-8">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
              <svg viewBox="0 0 76 65" className="size-4 fill-current" aria-hidden>
                <path d="M37.5 0 75 65H0z" />
              </svg>
              quirq space
              <span className="font-normal text-muted">/ vercel</span>
            </Link>
            <nav className="flex gap-1 rounded-lg border border-grid bg-card p-1 text-sm">
              <Link href="/" className="rounded-md bg-raised px-3 py-1.5 text-primary">
                Vercel
              </Link>
              <a href={GITHUB_PORTFOLIO} className="rounded-md px-3 py-1.5 text-muted hover:text-primary">
                GitHub ↗
              </a>
            </nav>
          </header>
          {children}
          <footer className="mt-6 border-t border-grid pt-6 text-xs text-muted">
            A static snapshot of our Vercel team, taken {fmtDate(data.takenAt)}. No tokens, no
            tracking: just links to what we&apos;ve shipped.
          </footer>
        </main>
      </body>
    </html>
  );
}
