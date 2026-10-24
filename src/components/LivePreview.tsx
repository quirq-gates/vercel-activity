"use client";

import { useState } from "react";

// Shows the snapshot screenshot; "Try it here" swaps in the live site.
export function LivePreview({ name, url, shot }: { name: string; url: string | null; shot: string | null }) {
  const [live, setLive] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-grid bg-card">
      <div className="flex items-center gap-2 border-b border-grid px-3 py-2 text-xs text-muted">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-grid" />
          <span className="size-2.5 rounded-full bg-grid" />
          <span className="size-2.5 rounded-full bg-grid" />
        </span>
        <span className="flex-1 truncate text-center font-mono">
          {url ? url.replace("https://", "") : "no public URL"}
        </span>
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            Open ↗
          </a>
        )}
      </div>
      <div className="relative aspect-[16/10] bg-surface">
        {live && url ? (
          <iframe
            src={url}
            title={`${name} live`}
            className="absolute inset-0 size-full bg-white"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            loading="lazy"
          />
        ) : (
          <>
            {shot ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={shot} alt={`${name} screenshot`} className="absolute inset-0 size-full object-cover object-top" />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-sm text-muted">
                No preview captured
              </div>
            )}
            {url && (
              <button
                type="button"
                onClick={() => setLive(true)}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-surface shadow-lg hover:opacity-90"
              >
                Try it here
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
