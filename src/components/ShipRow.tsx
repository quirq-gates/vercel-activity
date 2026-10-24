import Link from "next/link";
import type { Ship } from "@/lib/data";
import { fmtDuration } from "@/lib/data";
import { StateBadge } from "./StateBadge";
import { TimeAgo } from "./TimeAgo";

export function ShipRow({ ship, project }: { ship: Ship; project?: string }) {
  const title = ship.message ?? (ship.sha ? `commit ${ship.sha}` : "manual deploy");
  return (
    <li className="flex items-start gap-4 border-t border-grid py-3 first:border-t-0">
      <div className="w-20 shrink-0 pt-0.5">
        <StateBadge state={ship.state} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          {!ship.production && (
            <span className="rounded border border-grid px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted">
              preview
            </span>
          )}
          {project && (
            <Link href={`/p/${project}`} className="font-medium hover:underline">
              {project}
            </Link>
          )}
          {ship.commitUrl ? (
            <a
              href={ship.commitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-secondary hover:text-primary"
            >
              {title}
            </a>
          ) : (
            <span className="truncate text-secondary">{title}</span>
          )}
        </div>
        {(ship.branch || ship.sha) && (
          <div className="font-mono text-[11px] text-muted">
            {[ship.branch, ship.sha, fmtDuration(ship.durationMs) && `built in ${fmtDuration(ship.durationMs)}`]
              .filter(Boolean)
              .join(" · ")}
          </div>
        )}
      </div>
      <div className="shrink-0 text-xs text-muted">
        <TimeAgo ts={ship.createdAt} />
      </div>
    </li>
  );
}
